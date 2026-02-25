import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import NotificationIcon from './NotificationIcon';
import { PRIORITY_CONFIG, getRelativeTime, CATEGORY_CONFIG } from '../../utils/notificationUtils';
import type { Notification } from '../../types/notification';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
    onDismiss: (id: number) => void;
    onClosePanel?: () => void;
}

export default function NotificationItem({
    notification,
    onMarkAsRead,
    onDismiss,
    onClosePanel,
}: NotificationItemProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const priorityCfg = PRIORITY_CONFIG[notification.priority];
    const categoryCfg = CATEGORY_CONFIG[notification.category];

    const handleClick = () => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }
        // If user is already on the target route, just close panel
        if (notification.actionUrl && location.pathname !== notification.actionUrl) {
            navigate(notification.actionUrl);
        }
        onClosePanel?.();
    };

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDismiss(notification.id);
    };

    const showPriorityDot = notification.priority === 'HIGH' || notification.priority === 'URGENT';

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
            className={`
                group relative flex items-start gap-3 px-4 py-3 cursor-pointer
                transition-all duration-200
                hover:bg-[var(--color-background-secondary)]
                ${!notification.isRead ? 'bg-[var(--color-background-tertiary)]/50' : ''}
            `}
            style={{
                borderLeft: !notification.isRead ? `3px solid ${categoryCfg.color}` : '3px solid transparent',
            }}
        >
            {/* Category icon */}
            <NotificationIcon category={notification.category} size={18} />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <p
                        className={`text-sm leading-snug truncate text-[var(--color-foreground)] ${!notification.isRead || priorityCfg.className ? 'font-semibold' : 'font-normal'
                            }`}
                    >
                        {notification.title}
                    </p>
                    {showPriorityDot && (
                        <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${notification.priority === 'URGENT' ? 'animate-pulse' : ''
                                }`}
                            style={{ backgroundColor: priorityCfg.dotColor }}
                        />
                    )}
                </div>
                <p className="text-xs text-[var(--color-foreground-muted)] line-clamp-2 leading-relaxed">
                    {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                    {notification.actorName && (
                        <span className="text-[11px] text-[var(--color-foreground-muted)]">
                            {notification.actorName}
                        </span>
                    )}
                    {notification.actorName && (
                        <span className="text-[10px] text-[var(--color-foreground-muted)]">·</span>
                    )}
                    <span className="text-[11px] text-[var(--color-foreground-muted)]">
                        {getRelativeTime(notification.createdAt, notification.timeAgo)}
                    </span>
                </div>
            </div>

            {/* Dismiss button */}
            <button
                onClick={handleDismiss}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-[var(--color-background-tertiary)] flex-shrink-0 mt-1"
                aria-label="Dismiss notification"
            >
                <X size={14} className="text-[var(--color-foreground-muted)]" />
            </button>

            {/* Unread dot */}
            {!notification.isRead && (
                <span
                    className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: categoryCfg.color }}
                />
            )}
        </div>
    );
}
