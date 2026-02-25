import type { Notification, NotificationCategory, NotificationPriority } from '../types/notification';

// ============================================
// SNAKE_CASE → CAMELCASE NORMALIZATION
// ============================================

/**
 * Normalize SSE snake_case payload to camelCase to match GraphQL shape.
 */
export function normalizeNotification(ssePayload: Record<string, unknown>): Notification {
    return {
        id: ssePayload.id as number,
        notificationType: (ssePayload.notification_type ?? ssePayload.notificationType) as string,
        category: (ssePayload.category) as NotificationCategory,
        priority: (ssePayload.priority) as NotificationPriority,
        title: ssePayload.title as string,
        message: ssePayload.message as string,
        actionUrl: (ssePayload.action_url ?? ssePayload.actionUrl) as string,
        metadata: (ssePayload.metadata ?? {}) as Record<string, unknown>,
        isRead: (ssePayload.is_read ?? ssePayload.isRead ?? false) as boolean,
        readAt: (ssePayload.read_at ?? ssePayload.readAt ?? null) as string | null,
        actorName: (ssePayload.actor_name ?? ssePayload.actorName ?? null) as string | null,
        createdAt: (ssePayload.created_at ?? ssePayload.createdAt) as string,
        timeAgo: (ssePayload.time_ago ?? ssePayload.timeAgo ?? 'just now') as string,
    };
}

// ============================================
// CATEGORY CONFIG
// ============================================

interface CategoryConfig {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
}

/**
 * Using colors aligned with theme.constants.ts:
 * - ATTENDANCE: Emerald/Green (#10b981 / var(--color-success))
 * - ASSIGNMENT: Cyan/Blue  (var(--color-primary) / #06b6d4)
 * - GRADE:     Purple (#8b5cf6 — custom)
 * - SYSTEM:    Amber (#fbbf24 / var(--color-accent))
 */
export const CATEGORY_CONFIG: Record<NotificationCategory, CategoryConfig> = {
    ATTENDANCE: {
        label: 'Attendance',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.12)',
        borderColor: 'rgba(16, 185, 129, 0.35)',
    },
    ASSIGNMENT: {
        label: 'Assignment',
        color: '#06b6d4',
        bgColor: 'rgba(6, 182, 212, 0.12)',
        borderColor: 'rgba(6, 182, 212, 0.35)',
    },
    GRADE: {
        label: 'Grade',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.12)',
        borderColor: 'rgba(139, 92, 246, 0.35)',
    },
    SYSTEM: {
        label: 'System',
        color: '#fbbf24',
        bgColor: 'rgba(251, 191, 36, 0.12)',
        borderColor: 'rgba(251, 191, 36, 0.35)',
    },
};

// ============================================
// PRIORITY CONFIG
// ============================================

interface PriorityConfig {
    label: string;
    /** Extra Tailwind classes to apply */
    className: string;
    /** Accent color for dot/indicator */
    dotColor: string;
    /** Toast auto-dismiss ms */
    toastDuration: number;
}

export const PRIORITY_CONFIG: Record<NotificationPriority, PriorityConfig> = {
    LOW: {
        label: 'Low',
        className: '',
        dotColor: 'transparent',
        toastDuration: 5000,
    },
    MEDIUM: {
        label: 'Medium',
        className: '',
        dotColor: 'transparent',
        toastDuration: 5000,
    },
    HIGH: {
        label: 'High',
        className: 'font-bold',
        dotColor: '#fbbf24',   // amber from theme
        toastDuration: 7000,
    },
    URGENT: {
        label: 'Urgent',
        className: 'font-bold',
        dotColor: '#ef4444',   // error red from theme
        toastDuration: 10000,
    },
};

/**
 * Sort comparator: URGENT/HIGH first, then by createdAt desc.
 */
export function sortNotifications(a: Notification, b: Notification): number {
    const priorityOrder: Record<NotificationPriority, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const pa = priorityOrder[a.priority] ?? 3;
    const pb = priorityOrder[b.priority] ?? 3;
    if (pa !== pb) return pa - pb;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

/**
 * Get human-readable relative time from a date string.
 * Falls back to the server-provided timeAgo if parsing fails.
 */
export function getRelativeTime(dateString: string, serverTimeAgo?: string): string {
    try {
        const now = Date.now();
        const then = new Date(dateString).getTime();
        const diffMs = now - then;
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return 'just now';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr}h ago`;
        const diffDay = Math.floor(diffHr / 24);
        if (diffDay < 7) return `${diffDay}d ago`;
        return `${Math.floor(diffDay / 7)}w ago`;
    } catch {
        return serverTimeAgo ?? 'just now';
    }
}
