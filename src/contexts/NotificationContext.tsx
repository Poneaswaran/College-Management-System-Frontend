import {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation } from '@apollo/client/react';
import { selectIsAuthenticated } from '../store/auth.store';
import { client } from '../lib/graphql';
import { useNotificationSSE } from '../hooks/useNotificationSSE';
import { useToast } from '../components/ui/Toast';
import {
    MY_NOTIFICATIONS_QUERY,
    UNREAD_COUNT_QUERY,
    MARK_NOTIFICATION_READ_MUTATION,
    MARK_ALL_NOTIFICATIONS_READ_MUTATION,
    DISMISS_NOTIFICATION_MUTATION,
} from '../graphql/notifications';
import { PRIORITY_CONFIG } from '../utils/notificationUtils';
import type { Notification, SSEConnectionStatus, NotificationConnection } from '../types/notification';

// ============================================
// CONTEXT TYPES
// ============================================

interface NotificationContextType {
    unreadCount: number;
    notifications: Notification[];
    connectionStatus: SSEConnectionStatus;
    loading: boolean;
    hasMore: boolean;
    totalCount: number;
    markAsRead: (id: number) => void;
    markAllAsRead: (category?: string) => void;
    dismissNotification: (id: number) => void;
    refetchNotifications: () => void;
    loadMore: () => void;
    activeCategory: string | null;
    setActiveCategory: (category: string | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ============================================
// Cache update helpers — typed
// ============================================

interface MyNotificationsCache {
    myNotifications: NotificationConnection;
}

interface UnreadCountCache {
    unreadCount: number;
}

// ============================================
// PROVIDER
// ============================================

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { addToast } = useToast();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // ------ Ref to track seen notification IDs (dedupe SSE) ------
    const seenIdsRef = useRef<Set<number>>(new Set());

    // ------ Token ------
    const token = localStorage.getItem('token') ?? '';

    // ------ GraphQL: Notifications list ------
    const {
        data: notifData,
        loading,
        refetch: refetchNotifications,
        fetchMore,
    } = useQuery<MyNotificationsCache>(MY_NOTIFICATIONS_QUERY, {
        variables: { limit: 20, offset: 0, category: activeCategory },
        skip: !isAuthenticated,
        fetchPolicy: 'cache-and-network',
    });

    const notifications = notifData?.myNotifications?.notifications ?? [];
    const hasMore = notifData?.myNotifications?.hasMore ?? false;
    const totalCount = notifData?.myNotifications?.totalCount ?? 0;

    // ------ GraphQL: Unread count (lightweight polling fallback) ------
    const { data: unreadData } = useQuery<UnreadCountCache>(UNREAD_COUNT_QUERY, {
        skip: !isAuthenticated,
        pollInterval: 60_000, // fallback poll every 60 s
        fetchPolicy: 'cache-and-network',
    });

    const unreadCount = unreadData?.unreadCount ?? notifData?.myNotifications?.unreadCount ?? 0;

    // ------ Seed seenIds from initial fetch ------
    useEffect(() => {
        notifications.forEach((n: Notification) => seenIdsRef.current.add(n.id));
    }, [notifications]);

    // ------ SSE: Real-time push ------
    const handleSSENotification = useCallback(
        (notification: Notification) => {
            // ── Deduplicate ──
            if (seenIdsRef.current.has(notification.id)) return;
            seenIdsRef.current.add(notification.id);

            // ── Update Apollo cache: myNotifications ──
            client.cache.updateQuery<MyNotificationsCache>(
                {
                    query: MY_NOTIFICATIONS_QUERY,
                    variables: { limit: 20, offset: 0, category: activeCategory },
                },
                (existing) => {
                    if (!existing) return existing;
                    return {
                        myNotifications: {
                            ...existing.myNotifications,
                            notifications: [notification, ...existing.myNotifications.notifications],
                            totalCount: existing.myNotifications.totalCount + 1,
                            unreadCount: existing.myNotifications.unreadCount + 1,
                        },
                    };
                },
            );

            // ── Update Apollo cache: unreadCount ──
            client.cache.updateQuery<UnreadCountCache>(
                { query: UNREAD_COUNT_QUERY },
                (existing) => {
                    if (!existing) return existing;
                    return { unreadCount: existing.unreadCount + 1 };
                },
            );

            // ── Toast ──
            const priorityCfg = PRIORITY_CONFIG[notification.priority];
            const toastType = notification.priority === 'URGENT' ? 'error' : 'info';
            addToast({
                type: toastType,
                title: notification.title,
                message: notification.message.length > 80 ? notification.message.slice(0, 80) + '…' : notification.message,
                duration: priorityCfg.toastDuration,
            });
        },
        [addToast, activeCategory],
    );

    const { connectionStatus } = useNotificationSSE({
        token,
        enabled: isAuthenticated,
        onNotification: handleSSENotification,
    });

    // ------ Mutations ------
    const [markReadMutation] = useMutation(MARK_NOTIFICATION_READ_MUTATION);
    const [markAllReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_READ_MUTATION);
    const [dismissMutation] = useMutation(DISMISS_NOTIFICATION_MUTATION);

    const markAsRead = useCallback(
        async (id: number) => {
            try {
                await markReadMutation({
                    variables: { notificationId: id },
                    optimisticResponse: {
                        markNotificationRead: {
                            __typename: 'NotificationType',
                            id,
                            isRead: true,
                            readAt: new Date().toISOString(),
                        },
                    },
                });
                // Update notifications list cache
                client.cache.updateQuery<MyNotificationsCache>(
                    {
                        query: MY_NOTIFICATIONS_QUERY,
                        variables: { limit: 20, offset: 0, category: activeCategory },
                    },
                    (existing) => {
                        if (!existing) return existing;
                        return {
                            myNotifications: {
                                ...existing.myNotifications,
                                notifications: existing.myNotifications.notifications.map(
                                    (n: Notification) => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n,
                                ),
                                unreadCount: Math.max(0, existing.myNotifications.unreadCount - 1),
                            },
                        };
                    },
                );
                // Decrement unread count
                client.cache.updateQuery<UnreadCountCache>({ query: UNREAD_COUNT_QUERY }, (existing) => {
                    if (!existing) return existing;
                    return { unreadCount: Math.max(0, existing.unreadCount - 1) };
                });
            } catch (err) {
                console.error('[Notifications] markAsRead failed:', err);
            }
        },
        [markReadMutation, activeCategory],
    );

    const markAllAsRead = useCallback(
        async (category?: string) => {
            try {
                await markAllReadMutation({
                    variables: { category: category ?? null },
                    refetchQueries: [
                        { query: MY_NOTIFICATIONS_QUERY, variables: { limit: 20, offset: 0, category: activeCategory } },
                        { query: UNREAD_COUNT_QUERY },
                    ],
                });
            } catch (err) {
                console.error('[Notifications] markAllAsRead failed:', err);
            }
        },
        [markAllReadMutation, activeCategory],
    );

    const dismissNotificationFn = useCallback(
        async (id: number) => {
            try {
                const wasUnread = notifications.find((n: Notification) => n.id === id && !n.isRead);
                await dismissMutation({
                    variables: { notificationId: id },
                });
                // Update notifications list cache
                client.cache.updateQuery<MyNotificationsCache>(
                    {
                        query: MY_NOTIFICATIONS_QUERY,
                        variables: { limit: 20, offset: 0, category: activeCategory },
                    },
                    (existing) => {
                        if (!existing) return existing;
                        return {
                            myNotifications: {
                                ...existing.myNotifications,
                                notifications: existing.myNotifications.notifications.filter(
                                    (n: Notification) => n.id !== id,
                                ),
                                totalCount: existing.myNotifications.totalCount - 1,
                                unreadCount: wasUnread
                                    ? existing.myNotifications.unreadCount - 1
                                    : existing.myNotifications.unreadCount,
                            },
                        };
                    },
                );
                if (wasUnread) {
                    client.cache.updateQuery<UnreadCountCache>({ query: UNREAD_COUNT_QUERY }, (existing) => {
                        if (!existing) return existing;
                        return { unreadCount: Math.max(0, existing.unreadCount - 1) };
                    });
                }
            } catch (err) {
                console.error('[Notifications] dismiss failed:', err);
            }
        },
        [dismissMutation, activeCategory, notifications],
    );

    const loadMore = useCallback(() => {
        if (!hasMore || loading) return;
        fetchMore({
            variables: { offset: notifications.length },
            updateQuery: (prev: MyNotificationsCache, { fetchMoreResult }: { fetchMoreResult?: MyNotificationsCache }) => {
                if (!fetchMoreResult) return prev;
                return {
                    myNotifications: {
                        ...fetchMoreResult.myNotifications,
                        notifications: [
                            ...prev.myNotifications.notifications,
                            ...fetchMoreResult.myNotifications.notifications,
                        ],
                    },
                };
            },
        });
    }, [hasMore, loading, fetchMore, notifications.length]);

    return (
        <NotificationContext.Provider
            value={{
                unreadCount,
                notifications,
                connectionStatus,
                loading,
                hasMore,
                totalCount,
                markAsRead,
                markAllAsRead,
                dismissNotification: dismissNotificationFn,
                refetchNotifications,
                loadMore,
                activeCategory,
                setActiveCategory,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
}
