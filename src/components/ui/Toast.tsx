/**
 * Toast Notification Component
 * Lightweight toast system for real-time in-app feedback.
 * Colors sourced from theme CSS variables.
 */

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

// ============================================
// TYPES
// ============================================

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

// ============================================
// CONTEXT
// ============================================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newToast = { ...toast, id };
        setToasts(prev => [...prev, newToast]);

        // Auto-dismiss
        const timeout = toast.duration ?? 4000;
        if (timeout > 0) {
            setTimeout(() => removeToast(id), timeout);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
}

// ============================================
// TOAST ITEM
// ============================================

const toastConfig: Record<ToastType, { icon: typeof Info; bg: string; border: string; text: string; iconColor: string }> = {
    success: {
        icon: CheckCircle,
        bg: 'bg-[var(--color-success)]/10',
        border: 'border-[var(--color-success)]/40',
        text: 'text-[var(--color-success)]',
        iconColor: 'var(--color-success)',
    },
    error: {
        icon: XCircle,
        bg: 'bg-[var(--color-error)]/10',
        border: 'border-[var(--color-error)]/40',
        text: 'text-[var(--color-error)]',
        iconColor: 'var(--color-error)',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-[var(--color-warning)]/10',
        border: 'border-[var(--color-warning)]/40',
        text: 'text-[var(--color-warning)]',
        iconColor: 'var(--color-warning)',
    },
    info: {
        icon: Info,
        bg: 'bg-[var(--color-info)]/10',
        border: 'border-[var(--color-info)]/40',
        text: 'text-[var(--color-info)]',
        iconColor: 'var(--color-info)',
    },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const [isExiting, setIsExiting] = useState(false);
    const config = toastConfig[toast.type];
    const Icon = config.icon;

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    // Auto-exit animation before removal
    useEffect(() => {
        const remaining = (toast.duration ?? 4000) - 300;
        if (remaining > 0) {
            const timer = setTimeout(() => setIsExiting(true), remaining);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    return (
        <div
            className={`
                flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg
                max-w-sm w-full pointer-events-auto
                ${config.bg} ${config.border}
                ${isExiting ? 'toast-exit' : 'toast-enter'}
            `}
            role="alert"
        >
            <Icon size={20} style={{ color: config.iconColor }} className="mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${config.text}`}>{toast.title}</p>
                {toast.message && (
                    <p className="text-xs text-[var(--color-foreground-secondary)] mt-0.5">{toast.message}</p>
                )}
            </div>
            <button
                onClick={handleDismiss}
                className="p-1 rounded-lg hover:bg-[var(--color-background-tertiary)] transition-colors flex-shrink-0"
                aria-label="Dismiss notification"
            >
                <X size={14} className="text-[var(--color-foreground-muted)]" />
            </button>
        </div>
    );
}

// ============================================
// TOAST CONTAINER
// ============================================

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
            aria-live="polite"
            aria-label="Notifications"
        >
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}
