import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// ============================================
// THEME CONFIGURATION
// ============================================
// Modify these values to change the entire app's appearance

export const themeConfig = {
    // ========== BRAND COLORS ==========
    brand: {
        primary: '#2563eb',        // Main brand color (blue)
        primaryHover: '#1d4ed8',   // Primary hover state
        primaryLight: '#3b82f6',   // Lighter primary
        primaryDark: '#1e40af',    // Darker primary

        secondary: '#7c3aed',      // Secondary brand color (purple)
        secondaryHover: '#6d28d9',
        secondaryLight: '#8b5cf6',
        secondaryDark: '#5b21b6',

        accent: '#f59e0b',         // Accent color (amber)
        accentHover: '#d97706',
        accentLight: '#fbbf24',
        accentDark: '#b45309',
    },

    // ========== UI COLORS ==========
    ui: {
        background: '#ffffff',
        backgroundSecondary: '#f8fafc',
        backgroundTertiary: '#f1f5f9',

        foreground: '#0f172a',
        foregroundSecondary: '#475569',
        foregroundMuted: '#94a3b8',

        border: '#e2e8f0',
        borderHover: '#cbd5e1',

        card: '#ffffff',
        cardHover: '#f8fafc',
    },

    // ========== STATUS COLORS ==========
    status: {
        success: '#22c55e',
        successLight: '#dcfce7',
        successDark: '#15803d',

        warning: '#f59e0b',
        warningLight: '#fef3c7',
        warningDark: '#b45309',

        error: '#ef4444',
        errorLight: '#fee2e2',
        errorDark: '#b91c1c',

        info: '#3b82f6',
        infoLight: '#dbeafe',
        infoDark: '#1d4ed8',
    },

    // ========== GRADIENTS ==========
    gradients: {
        primary: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        secondary: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        dark: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    },

    // ========== TYPOGRAPHY ==========
    typography: {
        fontFamily: {
            sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            serif: "'Georgia', 'Times New Roman', serif",
            mono: "'Fira Code', 'Consolas', monospace",
        },
        fontSize: {
            xs: '0.75rem',      // 12px
            sm: '0.875rem',     // 14px
            base: '1rem',       // 16px
            lg: '1.125rem',     // 18px
            xl: '1.25rem',      // 20px
            '2xl': '1.5rem',    // 24px
            '3xl': '1.875rem',  // 30px
            '4xl': '2.25rem',   // 36px
            '5xl': '3rem',      // 48px
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
        lineHeight: {
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75',
        },
    },

    // ========== SPACING ==========
    spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '1rem',       // 16px
        lg: '1.5rem',     // 24px
        xl: '2rem',       // 32px
        '2xl': '3rem',    // 48px
        '3xl': '4rem',    // 64px
    },

    // ========== BORDER RADIUS ==========
    borderRadius: {
        none: '0',
        sm: '0.25rem',    // 4px
        md: '0.5rem',     // 8px
        lg: '0.75rem',    // 12px
        xl: '1rem',       // 16px
        '2xl': '1.5rem',  // 24px
        full: '9999px',
    },

    // ========== SHADOWS ==========
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    },

    // ========== TRANSITIONS ==========
    transitions: {
        fast: '150ms ease-in-out',
        normal: '300ms ease-in-out',
        slow: '500ms ease-in-out',
    },

    // ========== Z-INDEX ==========
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },

    // ========== BREAKPOINTS ==========
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    // ========== UNIVERSITY BRANDING ==========
    university: {
        name: 'Vels University',
        tagline: 'Empowering the Future through Education.',
        logoColors: {
            shield: '#2563eb',
            shieldDark: '#1e40af',
            gold: '#fbbf24',
            goldDark: '#d97706',
        },
    },
} as const;

// ============================================
// DARK THEME OVERRIDE
// ============================================
export const darkThemeOverrides = {
    ui: {
        background: '#0f172a',
        backgroundSecondary: '#1e293b',
        backgroundTertiary: '#334155',

        foreground: '#f8fafc',
        foregroundSecondary: '#cbd5e1',
        foregroundMuted: '#64748b',

        border: '#334155',
        borderHover: '#475569',

        card: '#1e293b',
        cardHover: '#334155',
    },
} as const;

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
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// ============================================
// UTILITY CLASSES (for use without provider)
// ============================================
export const tw = {
    // Button variants
    btn: {
        primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg',
        secondary: 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg',
        outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300',
        ghost: 'text-[var(--color-foreground)] hover:bg-[var(--color-background-tertiary)] font-semibold py-3 px-6 rounded-lg transition-all duration-300',
    },

    // Input styles
    input: {
        base: 'w-full px-4 py-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200 outline-none',
        error: 'border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]',
    },

    // Card styles
    card: {
        base: 'bg-[var(--color-card)] rounded-xl shadow-[var(--shadow-md)] border border-[var(--color-border)] p-6',
        hover: 'hover:shadow-[var(--shadow-lg)] hover:border-[var(--color-border-hover)] transition-all duration-300',
    },

    // Text styles
    text: {
        heading: 'text-[var(--color-foreground)] font-bold',
        body: 'text-[var(--color-foreground-secondary)]',
        muted: 'text-[var(--color-foreground-muted)]',
        link: 'text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer',
    },

    // Status badges
    badge: {
        success: 'bg-[var(--color-success-light)] text-[var(--color-success-dark)] px-3 py-1 rounded-full text-sm font-medium',
        warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning-dark)] px-3 py-1 rounded-full text-sm font-medium',
        error: 'bg-[var(--color-error-light)] text-[var(--color-error-dark)] px-3 py-1 rounded-full text-sm font-medium',
        info: 'bg-[var(--color-info-light)] text-[var(--color-info-dark)] px-3 py-1 rounded-full text-sm font-medium',
    },
} as const;

// Export default theme
export default themeConfig;
