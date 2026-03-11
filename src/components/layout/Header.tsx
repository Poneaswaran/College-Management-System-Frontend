import { 
    Mail, 
    Sun, 
    Moon, 
    ChevronDown, 
    Menu 
} from 'lucide-react';
import { useTheme } from '../../theme';
import { useAuth } from '../../features/auth/hooks';
import NotificationBell from '../notifications/NotificationBell';

interface HeaderProps {
    title: string;
    userName?: string;
    userInitials?: string;
}

export function Header({ 
    title, 
    userName: propUserName, 
    userInitials: propUserInitials
}: HeaderProps) {
    const { isDark, setMode } = useTheme();
    const { user } = useAuth();

    // Determine user name and initials
    const displayEmail = user?.email || '';
    const nameFromEmail = displayEmail.split('@')[0] || 'User';
    
    // Capitalize first letter of name from email
    const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    
    const userName = propUserName || capitalizedName;
    const userInitials = propUserInitials || userName.charAt(0).toUpperCase();
    const roleName = user?.role?.name || 'Account';

    const toggleTheme = () => {
        setMode(isDark ? 'light' : 'dark');
    };

    return (
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle - can be used to open Sidebar */}
                <button className="lg:hidden p-2 hover:bg-[var(--color-background-tertiary)] rounded-lg text-[var(--color-foreground-secondary)]">
                    <Menu size={20} />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">{title}</h1>
            </div>

            <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end max-w-4xl">


                <div className="flex items-center gap-2 md:gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-all"
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Chat/Mail */}
                    <button className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] relative hover:text-[var(--color-primary)] transition-all">
                        <Mail size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-error)] rounded-full border-2 border-[var(--color-background)]"></span>
                    </button>

                    {/* Notifications */}
                    <NotificationBell />

                    {/* User Profile */}
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-tertiary)] px-2 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[var(--color-border)]">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-[var(--color-primary)]/20">
                            {userInitials}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold text-[var(--color-foreground)] leading-tight max-w-[100px] truncate">
                                {userName}
                            </p>
                            <p className="text-[10px] text-[var(--color-foreground-muted)] font-medium">{roleName} Account</p>
                        </div>
                        <ChevronDown size={14} className="text-[var(--color-foreground-muted)] ml-1" />
                    </div>
                </div>
            </div>
        </header>
    );
}
