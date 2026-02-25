import { useEffect, useRef, useState, useCallback } from 'react';
import { SERVER_URL } from '../config/constant';
import { normalizeNotification } from '../utils/notificationUtils';
import { NOTIFICATION_EVENT_TYPES } from '../types/notification';
import type { Notification, SSEConnectionStatus } from '../types/notification';

interface UseNotificationSSEOptions {
    token: string;
    enabled?: boolean;
    onNotification?: (notification: Notification) => void;
    onConnectionChange?: (status: SSEConnectionStatus) => void;
}

interface UseNotificationSSEReturn {
    connectionStatus: SSEConnectionStatus;
    lastNotification: Notification | null;
}

/**
 * Custom hook to manage SSE connection for real-time notifications.
 * Opens EventSource to backend SSE endpoint, normalizes incoming events,
 * and invokes callbacks for new notifications.
 */
export function useNotificationSSE({
    token,
    enabled = true,
    onNotification,
    onConnectionChange,
}: UseNotificationSSEOptions): UseNotificationSSEReturn {
    const [connectionStatus, setConnectionStatus] = useState<SSEConnectionStatus>(
        () => (enabled && token) ? 'connecting' : 'disconnected',
    );
    const [lastNotification, setLastNotification] = useState<Notification | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const onNotificationRef = useRef(onNotification);
    const onConnectionChangeRef = useRef(onConnectionChange);

    // Keep refs up-to-date without re-triggering effect
    useEffect(() => {
        onNotificationRef.current = onNotification;
        onConnectionChangeRef.current = onConnectionChange;
    });

    const updateStatus = useCallback((status: SSEConnectionStatus) => {
        setConnectionStatus(status);
        onConnectionChangeRef.current?.(status);
    }, []);

    useEffect(() => {
        if (!enabled || !token) {
            // Close existing connection
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            // Don't call setState directly here — schedule it
            const id = setTimeout(() => updateStatus('disconnected'), 0);
            return () => clearTimeout(id);
        }

        // Clean token (strip "Bearer " prefix if present)
        const cleanToken = token.replace(/^Bearer\s+/i, '');
        const sseUrl = `${SERVER_URL}/api/notifications/stream/?token=${encodeURIComponent(cleanToken)}`;

        // Don't call setState here — let onopen handle it
        // The initial state is set via the lazy initializer

        const es = new EventSource(sseUrl);
        eventSourceRef.current = es;

        // --- System Events ---
        es.addEventListener('connected', () => {
            updateStatus('connected');
        });

        es.addEventListener('heartbeat', () => {
            // keepalive – no action needed
        });

        es.addEventListener('error', (event) => {
            // SSE spec "error" event or custom backend error
            console.warn('[SSE] Error event received:', event);
        });

        // Native onerror (connection lost / failure)
        es.onerror = () => {
            if (es.readyState === EventSource.CLOSED) {
                updateStatus('disconnected');
            } else {
                updateStatus('error');
            }
        };

        es.onopen = () => {
            updateStatus('connected');
        };

        // --- Notification Events ---
        const handleNotificationEvent = (event: MessageEvent) => {
            try {
                const payload = JSON.parse(event.data);
                const normalized = normalizeNotification(payload);
                setLastNotification(normalized);
                onNotificationRef.current?.(normalized);
            } catch (err) {
                console.error('[SSE] Failed to parse notification event data:', err);
            }
        };

        // Register listener for every known notification event type
        NOTIFICATION_EVENT_TYPES.forEach((eventType) => {
            es.addEventListener(eventType, handleNotificationEvent);
        });

        // Cleanup
        return () => {
            NOTIFICATION_EVENT_TYPES.forEach((eventType) => {
                es.removeEventListener(eventType, handleNotificationEvent);
            });
            es.close();
            eventSourceRef.current = null;
        };
    }, [token, enabled, updateStatus]);

    return { connectionStatus, lastNotification };
}

