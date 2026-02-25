import { PartyPopper } from 'lucide-react';

export default function NotificationEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(6, 182, 212, 0.12)' }}
            >
                <PartyPopper size={28} style={{ color: '#06b6d4' }} />
            </div>
            <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-1">
                You're all caught up! 🎉
            </h3>
            <p className="text-sm text-[var(--color-foreground-muted)] max-w-[220px]">
                No new notifications. We'll let you know when something comes up.
            </p>
        </div>
    );
}
