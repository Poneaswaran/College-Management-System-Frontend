import PageLayout from '../../components/layout/PageLayout';
import NotificationSettings from '../../components/notifications/NotificationSettings';

export default function NotificationSettingsPage() {
    return (
        <PageLayout>
            <div className="p-6 max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Settings</h1>
                    <p className="text-sm text-[var(--color-foreground-muted)] mt-1">
                        Manage your notification preferences
                    </p>
                </div>
                <NotificationSettings />
            </div>
        </PageLayout>
    );
}
