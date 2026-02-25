/**
 * ============================================================
 * KEYBOARD SHORTCUTS
 * ============================================================
 *
 * Centralized keyboard shortcut system for the application.
 * All shortcut definitions, the hook, and the help modal
 * live in this single file.
 *
 * Usage:
 *   1. Import { KeyboardShortcutsProvider } in providers.tsx
 *   2. Import { useKeyboardShortcuts } anywhere to add custom shortcuts
 *   3. Press "?" to open the shortcut cheat-sheet modal
 *
 * Colors come from CSS variables defined in theme.tsx / theme.constants.ts.
 */

import {
    useEffect,
    useCallback,
    useState,
    createContext,
    useContext,
    useRef,
    type ReactNode,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Keyboard, X, Search, ArrowUp } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface ShortcutDefinition {
    /** Unique key – e.g. "goto-dashboard" */
    id: string;
    /** Human-readable label shown in the cheat-sheet */
    label: string;
    /** Keys displayed in the UI (e.g. ["Ctrl", "K"]) */
    keys: string[];
    /** Category for grouping in the modal */
    category: 'navigation' | 'actions' | 'ui' | 'custom';
    /** The handler to call when the shortcut fires */
    handler: () => void;
    /** If true, the shortcut is only active when no input is focused */
    ignoreInInput?: boolean;
}

interface KeyboardShortcutsContextType {
    /** Register a new shortcut (or overwrite an existing one) */
    register: (shortcut: ShortcutDefinition) => void;
    /** Unregister a shortcut by id */
    unregister: (id: string) => void;
    /** All currently registered shortcuts */
    shortcuts: ShortcutDefinition[];
    /** Open / close the help modal */
    isHelpOpen: boolean;
    setIsHelpOpen: (open: boolean) => void;
}

// ============================================
// CONTEXT
// ============================================

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

// ============================================
// HOOK — use from any component
// ============================================

// eslint-disable-next-line react-refresh/only-export-components
export function useKeyboardShortcuts() {
    const ctx = useContext(KeyboardShortcutsContext);
    if (!ctx) throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
    return ctx;
}

// ============================================
// HELPERS
// ============================================

/** Check if the currently focused element is a text input */
function isInputFocused(): boolean {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if ((el as HTMLElement).isContentEditable) return true;
    return false;
}

/** Keyboard key display label (pretty-print) */
function prettyKey(key: string): string {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const map: Record<string, string> = {
        ctrl: isMac ? '⌘' : 'Ctrl',
        alt: isMac ? '⌥' : 'Alt',
        shift: '⇧',
        meta: '⌘',
        enter: '↵',
        escape: 'Esc',
        backspace: '⌫',
        arrowup: '↑',
        arrowdown: '↓',
        arrowleft: '←',
        arrowright: '→',
    };
    return map[key.toLowerCase()] ?? key.toUpperCase();
}

// ============================================
// PROVIDER
// ============================================

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
    const [shortcuts, setShortcuts] = useState<ShortcutDefinition[]>([]);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // ── Register / Unregister ─────────────────────────
    const register = useCallback((shortcut: ShortcutDefinition) => {
        setShortcuts(prev => {
            const idx = prev.findIndex(s => s.id === shortcut.id);
            if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = shortcut;
                return copy;
            }
            return [...prev, shortcut];
        });
    }, []);

    const unregister = useCallback((id: string) => {
        setShortcuts(prev => prev.filter(s => s.id !== id));
    }, []);

    // ── Determine current role prefix from URL ────────
    const getRoleDashboard = useCallback((): string => {
        const path = location.pathname;
        if (path.startsWith('/faculty')) return '/faculty/dashboard';
        if (path.startsWith('/hod')) return '/hod/dashboard';
        if (path.startsWith('/student')) return '/student/dashboard';
        return '/dashboard';
    }, [location.pathname]);

    // ── Built-in shortcut handlers ────────────────────
    const builtInGotoDashboard = useCallback(() => {
        navigate(getRoleDashboard());
    }, [navigate, getRoleDashboard]);

    const builtInGotoProfile = useCallback(() => {
        const path = location.pathname;
        if (path.startsWith('/faculty')) navigate('/faculty/profile');
        else if (path.startsWith('/hod')) navigate('/hod/profile');
        else navigate('/student/profile');
    }, [navigate, location.pathname]);

    const builtInGotoAttendance = useCallback(() => {
        const path = location.pathname;
        if (path.startsWith('/faculty')) navigate('/faculty/attendance');
        else navigate('/student/attendance');
    }, [navigate, location.pathname]);

    const builtInGotoAssignments = useCallback(() => {
        const path = location.pathname;
        if (path.startsWith('/faculty')) navigate('/faculty/assignments');
        else if (path.startsWith('/hod')) navigate('/hod/assignments');
        else navigate('/student/assignments');
    }, [navigate, location.pathname]);

    const builtInGotoCourses = useCallback(() => {
        const path = location.pathname;
        if (path.startsWith('/faculty')) navigate('/faculty/courses');
        else navigate('/student/courses');
    }, [navigate, location.pathname]);

    const builtInToggleTheme = useCallback(() => {
        // Toggle dark class on root
        const root = document.documentElement;
        const isDark = root.classList.contains('dark');
        if (isDark) {
            root.classList.remove('dark');
            localStorage.setItem('theme-mode', 'light');
        } else {
            root.classList.add('dark');
            localStorage.setItem('theme-mode', 'dark');
        }
        // Dispatch storage event so ThemeProvider picks it up
        window.dispatchEvent(new Event('theme-change'));
    }, []);

    const builtInScrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const builtInOpenSearch = useCallback(() => {
        setIsSearchOpen(true);
        setSearchQuery('');
    }, []);

    // ── Register built-in shortcuts on mount ──────────
    useEffect(() => {
        const builtIns: ShortcutDefinition[] = [
            {
                id: 'open-search',
                label: 'Open Quick Search',
                keys: ['Ctrl', 'K'],
                category: 'actions',
                handler: builtInOpenSearch,
                ignoreInInput: false,
            },
            {
                id: 'show-help',
                label: 'Show Keyboard Shortcuts',
                keys: ['?'],
                category: 'ui',
                handler: () => setIsHelpOpen(prev => !prev),
                ignoreInInput: true,
            },
            {
                id: 'goto-dashboard',
                label: 'Go to Dashboard',
                keys: ['G', 'D'],
                category: 'navigation',
                handler: builtInGotoDashboard,
                ignoreInInput: true,
            },
            {
                id: 'goto-profile',
                label: 'Go to Profile',
                keys: ['G', 'P'],
                category: 'navigation',
                handler: builtInGotoProfile,
                ignoreInInput: true,
            },
            {
                id: 'goto-attendance',
                label: 'Go to Attendance',
                keys: ['G', 'A'],
                category: 'navigation',
                handler: builtInGotoAttendance,
                ignoreInInput: true,
            },
            {
                id: 'goto-assignments',
                label: 'Go to Assignments',
                keys: ['G', 'S'],
                category: 'navigation',
                handler: builtInGotoAssignments,
                ignoreInInput: true,
            },
            {
                id: 'goto-courses',
                label: 'Go to Courses',
                keys: ['G', 'C'],
                category: 'navigation',
                handler: builtInGotoCourses,
                ignoreInInput: true,
            },
            {
                id: 'toggle-theme',
                label: 'Toggle Dark / Light Mode',
                keys: ['Ctrl', 'Shift', 'T'],
                category: 'ui',
                handler: builtInToggleTheme,
                ignoreInInput: false,
            },
            {
                id: 'scroll-top',
                label: 'Scroll to Top',
                keys: ['T'],
                category: 'ui',
                handler: builtInScrollToTop,
                ignoreInInput: true,
            },
            {
                id: 'close-modal',
                label: 'Close Modal / Panel',
                keys: ['Escape'],
                category: 'ui',
                handler: () => {
                    setIsHelpOpen(false);
                    setIsSearchOpen(false);
                },
                ignoreInInput: false,
            },
        ];

        builtIns.forEach(s => register(s));
        return () => builtIns.forEach(s => unregister(s.id));
    }, [
        register, unregister,
        builtInGotoDashboard, builtInGotoProfile, builtInGotoAttendance,
        builtInGotoAssignments, builtInGotoCourses, builtInToggleTheme,
        builtInScrollToTop, builtInOpenSearch,
    ]);

    // ── Keystroke listener ────────────────────────────
    const sequenceBuffer = useRef<string[]>([]);
    const sequenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const inputFocused = isInputFocused();

            // --- Ctrl+K (search) —  always intercept ---
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                builtInOpenSearch();
                return;
            }

            // --- Ctrl+Shift+T (theme) ---
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                builtInToggleTheme();
                return;
            }

            // --- Escape ---
            if (e.key === 'Escape') {
                setIsHelpOpen(false);
                setIsSearchOpen(false);
                return;
            }

            // Skip remaining if input focused
            if (inputFocused) return;

            // --- "?" for help (Shift + / on most keyboards) ---
            if (e.key === '?') {
                e.preventDefault();
                setIsHelpOpen(prev => !prev);
                return;
            }

            // --- "T" for scroll to top ---
            if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                builtInScrollToTop();
                return;
            }

            // --- Two-key sequences: G + <letter> ---
            const key = e.key.toUpperCase();
            sequenceBuffer.current.push(key);

            // Keep only last 2 keys
            if (sequenceBuffer.current.length > 2) {
                sequenceBuffer.current = sequenceBuffer.current.slice(-2);
            }

            // Clear after 800ms inactivity
            if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
            sequenceTimerRef.current = setTimeout(() => {
                sequenceBuffer.current = [];
            }, 800);

            // Match two-key shortcuts
            if (sequenceBuffer.current.length === 2) {
                const [first, second] = sequenceBuffer.current;
                const match = shortcuts.find(s =>
                    s.keys.length === 2 &&
                    s.keys[0].toUpperCase() === first &&
                    s.keys[1].toUpperCase() === second
                );
                if (match && (!match.ignoreInInput || !inputFocused)) {
                    e.preventDefault();
                    match.handler();
                    sequenceBuffer.current = [];
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, builtInOpenSearch, builtInToggleTheme, builtInScrollToTop]);

    // ── Quick-search navigation items ─────────────────
    const searchablePages = [
        { label: 'Dashboard', path: getRoleDashboard() },
        { label: 'Profile', path: '/student/profile' },
        { label: 'Attendance', path: '/student/attendance' },
        { label: 'Mark Attendance', path: '/student/mark-attendance' },
        { label: 'Attendance History', path: '/student/attendance-history' },
        { label: 'Courses', path: '/student/courses' },
        { label: 'Grades', path: '/student/grades' },
        { label: 'Timetable', path: '/student/timetable' },
        { label: 'Assignments', path: '/student/assignments' },
        { label: 'My Submissions', path: '/student/submissions' },
        { label: 'Faculty Dashboard', path: '/faculty/dashboard' },
        { label: 'Faculty Courses', path: '/faculty/courses' },
        { label: 'Student List', path: '/faculty/students' },
        { label: 'Attendance Management', path: '/faculty/attendance' },
        { label: 'Faculty Assignments', path: '/faculty/assignments' },
        { label: 'Create Assignment', path: '/faculty/assignments/create' },
        { label: 'Study Materials', path: '/faculty/materials' },
        { label: 'HOD Dashboard', path: '/hod/dashboard' },
        { label: 'HOD Assignments', path: '/hod/assignments' },
    ];

    const filteredPages = searchQuery.trim()
        ? searchablePages.filter(p =>
            p.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : searchablePages;

    // Focus input when search opens
    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isSearchOpen]);

    return (
        <KeyboardShortcutsContext.Provider value={{ register, unregister, shortcuts, isHelpOpen, setIsHelpOpen }}>
            {children}

            {/* ── QUICK SEARCH MODAL ────────────────── */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh]" role="dialog" aria-label="Quick search">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsSearchOpen(false)}
                    />
                    {/* Panel */}
                    <div className="relative w-full max-w-lg mx-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
                        {/* Search input */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
                            <Search size={20} className="text-[var(--color-foreground-muted)]" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search pages… type to filter"
                                className="flex-1 bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-foreground-muted)] outline-none text-sm"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && filteredPages.length > 0) {
                                        navigate(filteredPages[0].path);
                                        setIsSearchOpen(false);
                                    }
                                }}
                            />
                            <kbd className="kbd-key text-[10px]">ESC</kbd>
                        </div>
                        {/* Results */}
                        <div className="max-h-72 overflow-y-auto p-2">
                            {filteredPages.length === 0 && (
                                <p className="text-center text-sm text-[var(--color-foreground-muted)] py-6">
                                    No matching pages found
                                </p>
                            )}
                            {filteredPages.map(page => (
                                <button
                                    key={page.path}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-primary)] rounded-lg transition-colors text-left"
                                    onClick={() => {
                                        navigate(page.path);
                                        setIsSearchOpen(false);
                                    }}
                                >
                                    <ArrowUp size={14} className="rotate-45 opacity-40" />
                                    {page.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── HELP MODAL ───────────────────────── */}
            {isHelpOpen && (
                <div className="fixed inset-0 z-[9997] flex items-center justify-center" role="dialog" aria-label="Keyboard shortcuts">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsHelpOpen(false)}
                    />
                    {/* Panel */}
                    <div className="relative w-full max-w-2xl mx-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl animate-scale-in max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[var(--color-primary)]/20 rounded-lg flex items-center justify-center">
                                    <Keyboard size={18} className="text-[var(--color-primary)]" />
                                </div>
                                <h2 className="text-lg font-bold text-[var(--color-foreground)]">Keyboard Shortcuts</h2>
                            </div>
                            <button
                                onClick={() => setIsHelpOpen(false)}
                                className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors"
                            >
                                <X size={18} className="text-[var(--color-foreground-muted)]" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto p-6 space-y-6">
                            {(['navigation', 'actions', 'ui'] as const).map(category => {
                                const items = shortcuts.filter(s => s.category === category);
                                if (items.length === 0) return null;

                                const categoryLabels: Record<string, string> = {
                                    navigation: '🧭 Navigation',
                                    actions: '⚡ Actions',
                                    ui: '🎨 UI Controls',
                                };

                                return (
                                    <div key={category}>
                                        <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">
                                            {categoryLabels[category]}
                                        </h3>
                                        <div className="space-y-1">
                                            {items.map(s => (
                                                <div
                                                    key={s.id}
                                                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors"
                                                >
                                                    <span className="text-sm text-[var(--color-foreground-secondary)]">
                                                        {s.label}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {s.keys.map((k, i) => (
                                                            <span key={i}>
                                                                <kbd className="kbd-key">{prettyKey(k)}</kbd>
                                                                {i < s.keys.length - 1 && (
                                                                    <span className="text-[var(--color-foreground-muted)] text-xs mx-0.5">+</span>
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Custom shortcuts */}
                            {shortcuts.filter(s => s.category === 'custom').length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wider mb-3">
                                        🔧 Custom
                                    </h3>
                                    <div className="space-y-1">
                                        {shortcuts.filter(s => s.category === 'custom').map(s => (
                                            <div
                                                key={s.id}
                                                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors"
                                            >
                                                <span className="text-sm text-[var(--color-foreground-secondary)]">
                                                    {s.label}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {s.keys.map((k, i) => (
                                                        <span key={i}>
                                                            <kbd className="kbd-key">{prettyKey(k)}</kbd>
                                                            {i < s.keys.length - 1 && (
                                                                <span className="text-[var(--color-foreground-muted)] text-xs mx-0.5">+</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
                            <span className="text-xs text-[var(--color-foreground-muted)]">
                                Press <kbd className="kbd-key text-[10px]">?</kbd> to toggle this panel
                            </span>
                            <span className="text-xs text-[var(--color-foreground-muted)]">
                                {shortcuts.length} shortcuts registered
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </KeyboardShortcutsContext.Provider>
    );
}
