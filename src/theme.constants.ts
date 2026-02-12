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
