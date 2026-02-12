import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { themeConfig, darkThemeOverrides } from './theme.constants';

// ============================================
// THEME CONTEXT
// ============================================
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: typeof themeConfig;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================
// THEME PROVIDER
// ============================================
interface ThemeProviderProps {
    children: ReactNode;
    defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode = 'light' }: ThemeProviderProps) {
    const [mode, setMode] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme-mode') as ThemeMode) || defaultMode;
        }
        return defaultMode;
    });

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const updateDarkMode = () => {
            let dark = false;
            if (mode === 'dark') {
                dark = true;
            } else if (mode === 'system') {
                dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            setIsDark(dark);

            // Update CSS variables
            const root = document.documentElement;
            const uiColors = dark ? darkThemeOverrides.ui : themeConfig.ui;

            root.style.setProperty('--color-background', uiColors.background);
            root.style.setProperty('--color-background-secondary', uiColors.backgroundSecondary);
            root.style.setProperty('--color-background-tertiary', uiColors.backgroundTertiary);
            root.style.setProperty('--color-foreground', uiColors.foreground);
            root.style.setProperty('--color-foreground-secondary', uiColors.foregroundSecondary);
            root.style.setProperty('--color-foreground-muted', uiColors.foregroundMuted);
            root.style.setProperty('--color-border', uiColors.border);
            root.style.setProperty('--color-border-hover', uiColors.borderHover);
            root.style.setProperty('--color-card', uiColors.card);
            root.style.setProperty('--color-card-hover', uiColors.cardHover);

            if (dark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        updateDarkMode();
        localStorage.setItem('theme-mode', mode);

        if (mode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', updateDarkMode);
            return () => mediaQuery.removeEventListener('change', updateDarkMode);
        }
    }, [mode]);

    // Apply all CSS variables on mount
    useEffect(() => {
        const root = document.documentElement;
        const { brand, status, typography, shadows, transitions } = themeConfig;

        // Brand colors
        root.style.setProperty('--color-primary', brand.primary);
        root.style.setProperty('--color-primary-hover', brand.primaryHover);
        root.style.setProperty('--color-primary-light', brand.primaryLight);
        root.style.setProperty('--color-primary-dark', brand.primaryDark);
        root.style.setProperty('--color-secondary', brand.secondary);
        root.style.setProperty('--color-secondary-hover', brand.secondaryHover);
        root.style.setProperty('--color-secondary-light', brand.secondaryLight);
        root.style.setProperty('--color-secondary-dark', brand.secondaryDark);
        root.style.setProperty('--color-accent', brand.accent);
        root.style.setProperty('--color-accent-hover', brand.accentHover);
        root.style.setProperty('--color-accent-light', brand.accentLight);
        root.style.setProperty('--color-accent-dark', brand.accentDark);

        // Status colors
        root.style.setProperty('--color-success', status.success);
        root.style.setProperty('--color-success-light', status.successLight);
        root.style.setProperty('--color-success-dark', status.successDark);
        root.style.setProperty('--color-warning', status.warning);
        root.style.setProperty('--color-warning-light', status.warningLight);
        root.style.setProperty('--color-warning-dark', status.warningDark);
        root.style.setProperty('--color-error', status.error);
        root.style.setProperty('--color-error-light', status.errorLight);
        root.style.setProperty('--color-error-dark', status.errorDark);
        root.style.setProperty('--color-info', status.info);
        root.style.setProperty('--color-info-light', status.infoLight);
        root.style.setProperty('--color-info-dark', status.infoDark);

        // Typography
        root.style.setProperty('--font-sans', typography.fontFamily.sans);
        root.style.setProperty('--font-serif', typography.fontFamily.serif);
        root.style.setProperty('--font-mono', typography.fontFamily.mono);

        // Shadows
        root.style.setProperty('--shadow-sm', shadows.sm);
        root.style.setProperty('--shadow-md', shadows.md);
        root.style.setProperty('--shadow-lg', shadows.lg);
        root.style.setProperty('--shadow-xl', shadows.xl);
        root.style.setProperty('--shadow-2xl', shadows['2xl']);

        // Transitions
        root.style.setProperty('--transition-fast', transitions.fast);
        root.style.setProperty('--transition-normal', transitions.normal);
        root.style.setProperty('--transition-slow', transitions.slow);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme: themeConfig, mode, setMode, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

// ============================================
// HOOK TO USE THEME
// ============================================
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
