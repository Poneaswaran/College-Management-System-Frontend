// ============================================
// THEME CONFIGURATION - Neo-Academic Brutalism
// ============================================
// Bold, high-contrast design for modern education

export const themeConfig = {
    // ========== BRAND COLORS ==========
    brand: {
        primary: '#06b6d4',        // Electric Cyan - Main brand
        primaryHover: '#0891b2',   // Cyan hover
        primaryLight: '#22d3ee',   // Bright cyan
        primaryDark: '#0e7490',    // Deep cyan

        secondary: '#ec4899',      // Hot Pink - Secondary accent
        secondaryHover: '#db2777',
        secondaryLight: '#f472b6',
        secondaryDark: '#be185d',

        accent: '#fbbf24',         // Amber - Warm accent
        accentHover: '#f59e0b',
        accentLight: '#fcd34d',
        accentDark: '#d97706',
    },

    // ========== UI COLORS ==========
    ui: {
        background: '#0a0a0a',         // Deep charcoal
        backgroundSecondary: '#141414', // Slightly lighter charcoal
        backgroundTertiary: '#1a1a1a',  // Card background

        foreground: '#ffffff',          // Pure white text
        foregroundSecondary: '#a1a1aa', // Zinc-400
        foregroundMuted: '#71717a',     // Zinc-500

        border: '#27272a',              // Zinc-800
        borderHover: '#3f3f46',         // Zinc-700

        card: '#1a1a1a',                // Dark card
        cardHover: '#202020',           // Lighter on hover
    },

    // ========== STATUS COLORS ==========
    status: {
        success: '#10b981',             // Emerald-500
        successLight: '#34d399',        // Emerald-400
        successDark: '#059669',         // Emerald-600

        warning: '#fbbf24',             // Amber-400
        warningLight: '#fcd34d',        // Amber-300
        warningDark: '#f59e0b',         // Amber-500

        error: '#ef4444',               // Red-500
        errorLight: '#f87171',          // Red-400
        errorDark: '#dc2626',           // Red-600

        info: '#06b6d4',                // Cyan-500
        infoLight: '#22d3ee',           // Cyan-400
        infoDark: '#0891b2',            // Cyan-600
    },

    // ========== GRADIENTS ==========
    gradients: {
        primary: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',     // Cyan to Pink
        secondary: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',   // Pink to Purple
        accent: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',      // Warm amber
        hero: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',        // Cyan to Purple
        dark: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',        // Deep charcoal
        neon: 'linear-gradient(135deg, #22d3ee 0%, #f472b6 100%)',        // Bright neon
    },

    // ========== TYPOGRAPHY ==========
    typography: {
        fontFamily: {
            sans: "'DM Sans', system-ui, -apple-system, sans-serif",
            display: "'DM Sans', system-ui, -apple-system, sans-serif",
            mono: "'Space Mono', 'Courier New', monospace",
        },
        fontSize: {
            xs: '0.75rem',      // 12px
            sm: '0.875rem',     // 14px
            base: '1rem',       // 16px
            lg: '1.125rem',     // 18px
            xl: '1.25rem',      // 20px
            '2xl': '1.5rem',    // 24px
            '3xl': '2rem',      // 32px
            '4xl': '2.5rem',    // 40px
            '5xl': '3rem',      // 48px
            '6xl': '3.75rem',   // 60px
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            black: '900',
        },
        lineHeight: {
            tight: '1.15',
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
