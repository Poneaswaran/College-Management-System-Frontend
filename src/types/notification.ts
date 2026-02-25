// ============================================
// NOTIFICATION TYPE DEFINITIONS
// ============================================

export interface Notification {
    id: number;
    notificationType: string;
    category: NotificationCategory;
    priority: NotificationPriority;
    title: string;
    message: string;
    actionUrl: string;
    metadata: Record<string, unknown>;
    isRead: boolean;
    readAt: string | null;
    actorName: string | null;
    createdAt: string;
    timeAgo: string;
}

export interface NotificationConnection {
    notifications: Notification[];
    totalCount: number;
    unreadCount: number;
    hasMore: boolean;
}

export interface NotificationPreference {
    category: string;
    isEnabled: boolean;
    isSseEnabled: boolean;
    isEmailEnabled: boolean;
}

export interface NotificationStats {
    totalCount: number;
    unreadCount: number;
    readCount: number;
    byCategory: Record<string, { total: number; unread: number; read: number }>;
}

export type NotificationCategory = 'ATTENDANCE' | 'ASSIGNMENT' | 'GRADE' | 'SYSTEM';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type SSEConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// SSE event types
export const NOTIFICATION_EVENT_TYPES = [
    'ATTENDANCE_SESSION_OPENED',
    'ATTENDANCE_SESSION_CLOSED',
    'LOW_ATTENDANCE_ALERT',
    'ATTENDANCE_MARKED',
    'ASSIGNMENT_PUBLISHED',
    'ASSIGNMENT_DUE_SOON',
    'ASSIGNMENT_OVERDUE',
    'ASSIGNMENT_GRADED',
    'ASSIGNMENT_RETURNED',
    'SUBMISSION_RECEIVED',
    'GRADE_PUBLISHED',
    'RESULT_DECLARED',
    'ANNOUNCEMENT',
    'FEE_REMINDER',
    'SYSTEM_ALERT',
    'PROFILE_UPDATE',
] as const;

export type NotificationEventType = typeof NOTIFICATION_EVENT_TYPES[number];
