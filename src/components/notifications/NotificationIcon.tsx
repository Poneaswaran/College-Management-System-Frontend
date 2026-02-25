import { Calendar, FileText, Award, AlertCircle } from 'lucide-react';
import type { NotificationCategory } from '../../types/notification';

const CATEGORY_ICONS: Record<NotificationCategory, typeof Calendar> = {
    ATTENDANCE: Calendar,
    ASSIGNMENT: FileText,
    GRADE: Award,
    SYSTEM: AlertCircle,
};

const CATEGORY_COLORS: Record<NotificationCategory, string> = {
    ATTENDANCE: '#10b981',
    ASSIGNMENT: '#06b6d4',
    GRADE: '#8b5cf6',
    SYSTEM: '#fbbf24',
};

interface NotificationIconProps {
    category: NotificationCategory;
    size?: number;
    className?: string;
}

export default function NotificationIcon({ category, size = 18, className = '' }: NotificationIconProps) {
    const Icon = CATEGORY_ICONS[category] ?? AlertCircle;
    const color = CATEGORY_COLORS[category] ?? '#a1a1aa';

    return (
        <div
            className={`flex items-center justify-center rounded-lg flex-shrink-0 ${className}`}
            style={{
                width: size + 14,
                height: size + 14,
                backgroundColor: `${color}18`,
            }}
        >
            <Icon size={size} style={{ color }} />
        </div>
    );
}
