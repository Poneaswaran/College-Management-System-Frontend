/**
 * Page Transition Wrapper
 * Adds smooth fade + slide animations when navigating between routes.
 * Wrap route content with <PageTransition> for animated entry.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
    children: ReactNode;
    /** Animation variant */
    variant?: 'fade' | 'slide-up' | 'slide-left' | 'scale';
    /** Duration in ms */
    duration?: number;
    className?: string;
}

const variantStyles: Record<string, { initial: string; animate: string }> = {
    fade: {
        initial: 'opacity: 0;',
        animate: 'opacity: 1;',
    },
    'slide-up': {
        initial: 'opacity: 0; transform: translateY(16px);',
        animate: 'opacity: 1; transform: translateY(0);',
    },
    'slide-left': {
        initial: 'opacity: 0; transform: translateX(24px);',
        animate: 'opacity: 1; transform: translateX(0);',
    },
    scale: {
        initial: 'opacity: 0; transform: scale(0.97);',
        animate: 'opacity: 1; transform: scale(1);',
    },
};

export default function PageTransition({
    children,
    variant = 'slide-up',
    duration = 300,
    className = '',
}: PageTransitionProps) {
    const location = useLocation();
    const ref = useRef<HTMLDivElement>(null);
    const styles = variantStyles[variant] || variantStyles['slide-up'];

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Start in initial (hidden) state
        el.style.cssText = `${styles.initial} transition: all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1);`;

        // Trigger animation on next frame
        const raf = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.cssText = `${styles.animate} transition: all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1);`;
            });
        });

        return () => cancelAnimationFrame(raf);
    }, [location.pathname, styles, duration]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

