import { Sun, Moon } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import NotificationBell from '../../components/notifications/NotificationBell';
import { useTheme } from '../../theme';

export default function Dashboard() {
    const { isDark, setMode } = useTheme();

    const toggleTheme = () => {
        setMode(isDark ? 'light' : 'dark');
    };

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">Dashboard</h1>
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-all"
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <NotificationBell />
                    </div>
                </div>
                <div className="grid gap-6">
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4">Welcome Back</h2>
                        <p className="text-muted-foreground">Overview of your activity.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
