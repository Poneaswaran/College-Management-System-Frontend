import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSelector } from 'react-redux';
import {
    RefreshCw,
    Shield,
    Wifi,
    Mail,
    ToggleLeft,
    ToggleRight,
    Loader2,
} from 'lucide-react';
import { selectIsAuthenticated } from '../../store/auth.store';
import {
    MY_NOTIFICATION_PREFERENCES_QUERY,
    UPDATE_NOTIFICATION_PREFERENCE_MUTATION,
    RESET_NOTIFICATION_PREFERENCES_MUTATION,
} from '../../graphql/notifications';
import { CATEGORY_CONFIG } from '../../utils/notificationUtils';
import { useToast } from '../ui/Toast';
import type { NotificationPreference, NotificationCategory } from '../../types/notification';

const CATEGORY_ORDER: NotificationCategory[] = ['ATTENDANCE', 'ASSIGNMENT', 'GRADE', 'SYSTEM'];

interface NotificationSettingsProps {
    onClose?: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { addToast } = useToast();
    const [resetting, setResetting] = useState(false);

    const { data, loading } = useQuery<{ myNotificationPreferences: NotificationPreference[] }>(
        MY_NOTIFICATION_PREFERENCES_QUERY,
        { skip: !isAuthenticated, fetchPolicy: 'cache-and-network' },
    );

    const [updatePref] = useMutation(UPDATE_NOTIFICATION_PREFERENCE_MUTATION);
    const [resetPrefs] = useMutation(RESET_NOTIFICATION_PREFERENCES_MUTATION);

    const preferences = data?.myNotificationPreferences ?? [];

    const getPref = (category: string): NotificationPreference | undefined =>
        preferences.find((p: NotificationPreference) => p.category === category);

    const handleToggle = async (
        category: string,
        field: 'isEnabled' | 'isSseEnabled' | 'isEmailEnabled',
        currentValue: boolean,
    ) => {
        try {
            await updatePref({
                variables: {
                    category,
                    [field]: !currentValue,
                },
                optimisticResponse: {
                    updateNotificationPreference: {
                        __typename: 'NotificationPreferenceType',
                        category,
                        isEnabled: field === 'isEnabled' ? !currentValue : getPref(category)?.isEnabled ?? true,
                        isSseEnabled: field === 'isSseEnabled' ? !currentValue : getPref(category)?.isSseEnabled ?? true,
                        isEmailEnabled: field === 'isEmailEnabled' ? !currentValue : getPref(category)?.isEmailEnabled ?? false,
                    },
                },
                refetchQueries: [{ query: MY_NOTIFICATION_PREFERENCES_QUERY }],
            });
        } catch {
            addToast({ type: 'error', title: 'Failed to update preference' });
        }
    };

    const handleReset = async () => {
        setResetting(true);
        try {
            await resetPrefs({
                refetchQueries: [{ query: MY_NOTIFICATION_PREFERENCES_QUERY }],
            });
            addToast({ type: 'success', title: 'Preferences reset to defaults' });
        } catch {
            addToast({ type: 'error', title: 'Failed to reset preferences' });
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                <h2 className="text-lg font-bold text-[var(--color-foreground)]">
                    Notification Preferences
                </h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        disabled={resetting}
                        className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
                    >
                        {resetting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        Reset defaults
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-xs font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-error)] transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="px-6 py-8 space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 rounded-lg skeleton-shimmer" />
                    ))}
                </div>
            ) : (
                <div className="divide-y divide-[var(--color-border)]">
                    {CATEGORY_ORDER.map((cat) => {
                        const pref = getPref(cat);
                        const cfg = CATEGORY_CONFIG[cat];
                        const isEnabled = pref?.isEnabled ?? true;
                        const isSseEnabled = pref?.isSseEnabled ?? true;
                        const isEmailEnabled = pref?.isEmailEnabled ?? false;

                        return (
                            <div key={cat} className="px-6 py-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: cfg.color }}
                                        />
                                        <span className="text-sm font-semibold text-[var(--color-foreground)]">
                                            {cfg.label}
                                        </span>
                                    </div>
                                    <ToggleButton
                                        enabled={isEnabled}
                                        onToggle={() => handleToggle(cat, 'isEnabled', isEnabled)}
                                        label="Master toggle"
                                    />
                                </div>

                                <div
                                    className={`grid grid-cols-2 gap-3 pl-6 transition-opacity duration-200 ${isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
                                        }`}
                                >
                                    <div className="flex items-center justify-between bg-[var(--color-background-secondary)] rounded-lg px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <Wifi size={14} className="text-[var(--color-foreground-muted)]" />
                                            <span className="text-xs text-[var(--color-foreground-secondary)]">Real-time</span>
                                        </div>
                                        <ToggleButton
                                            enabled={isSseEnabled}
                                            onToggle={() => handleToggle(cat, 'isSseEnabled', isSseEnabled)}
                                            label="SSE toggle"
                                            small
                                        />
                                    </div>
                                    <div className="flex items-center justify-between bg-[var(--color-background-secondary)] rounded-lg px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-[var(--color-foreground-muted)]" />
                                            <span className="text-xs text-[var(--color-foreground-secondary)]">Email</span>
                                        </div>
                                        <ToggleButton
                                            enabled={isEmailEnabled}
                                            onToggle={() => handleToggle(cat, 'isEmailEnabled', isEmailEnabled)}
                                            label="Email toggle"
                                            small
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ============================================
// Toggle Button sub-component
// ============================================

function ToggleButton({
    enabled,
    onToggle,
    label,
    small = false,
}: {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    small?: boolean;
}) {
    const Icon = enabled ? ToggleRight : ToggleLeft;
    const size = small ? 20 : 24;
    return (
        <button
            onClick={onToggle}
            className="transition-colors flex-shrink-0"
            aria-label={label}
            title={enabled ? 'Enabled' : 'Disabled'}
        >
            <Icon
                size={size}
                className="transition-colors"
                style={{
                    color: enabled ? 'var(--color-primary)' : 'var(--color-foreground-muted)',
                }}
            />
            <Shield size={0} className="hidden" /> {/* preload */}
        </button>
    );
}
