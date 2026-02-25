import { Sun, Moon } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import NotificationBell from '../../components/notifications/NotificationBell';
import { useTheme } from '../../theme';

export default function Dashboard() {
    const { isDark, setMode } = useTheme();

    const toggleTheme = () => {
        setMode(isDark ? 'light' : 'dark');
    };

    return (
        <div className="flex min-h-screen bg-[var(--color-background)]">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-all"
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
        </div>
    );
}
