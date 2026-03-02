/**
 * Select — Custom listbox dropdown with full keyboard navigation, ARIA, and theme support.
 *
 * API is fully backwards-compatible with the old <select>-based implementation.
 *
 * Usage:
 *   <Select
 *     value={filter}
 *     onChange={setFilter}
 *     options={[{ value: 'ALL', label: 'All' }, ...]}
 *     label="Department"
 *     placeholder="Choose one…"
 *     error="Required"
 *     loading={isFetching}
 *     searchable
 *   />
 *
 * Colors come from CSS variables (theme.tsx / theme.constants.ts).
 */

import {
    useRef,
    useState,
    useEffect,
    useId,
    useCallback,
    type ReactNode,
    type KeyboardEvent,
} from 'react';
import { ChevronDown, Check, Search, Loader2, AlertCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps {
    /** Controlled value */
    value: string;
    /** Called with the new value string */
    onChange: (value: string) => void;
    /** Option list */
    options: SelectOption[];
    /** Label rendered above the trigger */
    label?: string;
    /** Error message rendered below the trigger */
    error?: string;
    /** Shows red asterisk on label */
    required?: boolean;
    /** Icon rendered left of the trigger text */
    icon?: ReactNode;
    /** Placeholder shown when value is empty / no match */
    placeholder?: string;
    /** Size variant — affects height + font size */
    size?: 'sm' | 'md' | 'lg';
    /** Disables the control entirely */
    disabled?: boolean;
    /** Shows a spinner and disables interaction */
    loading?: boolean;
    /** Enables an inline search input inside the dropdown */
    searchable?: boolean;
    /** Additional className for the outer wrapper div */
    wrapperClassName?: string;
    /** Additional className forwarded to the trigger button */
    className?: string;
    /** id for the trigger (used to link the label) */
    id?: string;
    /** name attribute — kept for API compat, not rendered */
    name?: string;
}

// ─── Size maps ────────────────────────────────────────────────────────────────

const TRIGGER_SIZE: Record<NonNullable<SelectProps['size']>, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-4 text-base',
};

const OPTION_SIZE: Record<NonNullable<SelectProps['size']>, string> = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-4 text-base',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Select({
    value,
    onChange,
    options,
    label,
    error,
    required = false,
    icon,
    placeholder,
    size = 'md',
    disabled = false,
    loading = false,
    searchable = false,
    wrapperClassName = '',
    className = '',
    id: externalId,
}: SelectProps) {
    const internalId = useId();
    const id = externalId ?? internalId;
    const listboxId = `${id}-listbox`;

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [openUpward, setOpenUpward] = useState(false);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

    const isDisabled = disabled || loading;

    const visibleOptions = searchable && query.trim()
        ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
        : options;

    const selectedOption = options.find((o) => o.value === value);
    const displayLabel = selectedOption?.label ?? '';

    // ── Position: flip up when near viewport bottom ───────────────────────────
    const calcDirection = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUpward(spaceBelow < 240);
    }, []);

    // ── Open / close ──────────────────────────────────────────────────────────
    const openPanel = useCallback(() => {
        if (isDisabled) return;
        calcDirection();
        setOpen(true);
        setQuery('');
        // Pre-select the active index to the currently selected option
        const idx = options.findIndex((o) => o.value === value);
        setActiveIndex(idx >= 0 ? idx : 0);
    }, [isDisabled, calcDirection, options, value]);

    const closePanel = useCallback(() => {
        setOpen(false);
        setQuery('');
        setActiveIndex(-1);
    }, []);

    // ── Click outside ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                triggerRef.current?.contains(e.target as Node) ||
                panelRef.current?.contains(e.target as Node)
            ) return;
            closePanel();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, closePanel]);

    // ── Focus search input when panel opens ───────────────────────────────────
    useEffect(() => {
        if (open && searchable) {
            requestAnimationFrame(() => searchRef.current?.focus());
        }
    }, [open, searchable]);

    // ── Scroll active option into view ────────────────────────────────────────
    useEffect(() => {
        if (open && activeIndex >= 0) {
            optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
        }
    }, [open, activeIndex]);

    // ── Select a value ────────────────────────────────────────────────────────
    const selectValue = useCallback((opt: SelectOption) => {
        if (opt.disabled) return;
        onChange(opt.value);
        closePanel();
        triggerRef.current?.focus();
    }, [onChange, closePanel]);

    // ── Keyboard: trigger button ──────────────────────────────────────────────
    const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        switch (e.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
                e.preventDefault();
                openPanel();
                break;
            case 'ArrowUp':
                e.preventDefault();
                openPanel();
                break;
        }
    };

    // ── Keyboard: panel (search + list) ──────────────────────────────────────
    const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const enabledIndices = visibleOptions
            .map((o, i) => (!o.disabled ? i : null))
            .filter((i): i is number => i !== null);

        switch (e.key) {
            case 'ArrowDown': {
                e.preventDefault();
                const next = enabledIndices.find((i) => i > activeIndex) ?? enabledIndices[0];
                if (next !== undefined) setActiveIndex(next);
                break;
            }
            case 'ArrowUp': {
                e.preventDefault();
                const prev = [...enabledIndices].reverse().find((i) => i < activeIndex) ?? enabledIndices[enabledIndices.length - 1];
                if (prev !== undefined) setActiveIndex(prev);
                break;
            }
            case 'Enter': {
                e.preventDefault();
                const opt = visibleOptions[activeIndex];
                if (opt) selectValue(opt);
                break;
            }
            case 'Tab':
            case 'Escape':
                e.preventDefault();
                closePanel();
                triggerRef.current?.focus();
                break;
        }
    };

    // ─── Trigger border style ─────────────────────────────────────────────────
    const triggerBorder = error
        ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/25 focus:border-[var(--color-error)]'
        : open
            ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]';

    // ─── Panel position ───────────────────────────────────────────────────────
    const panelPosition = openUpward
        ? 'bottom-full mb-1.5'
        : 'top-full mt-1.5';

    return (
        <div className={`${wrapperClassName}`}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5"
                >
                    {label}
                    {required && (
                        <span className="text-[var(--color-error)] ml-0.5" aria-hidden="true">*</span>
                    )}
                </label>
            )}

            {/* Trigger + Panel wrapper — relative container */}
            <div className="relative">
                {/* Trigger button */}
                <button
                    ref={triggerRef}
                    id={id}
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    aria-controls={listboxId}
                    aria-invalid={!!error}
                    aria-required={required}
                    disabled={isDisabled}
                    onClick={() => (open ? closePanel() : openPanel())}
                    onKeyDown={onTriggerKeyDown}
                    className={[
                        'w-full flex items-center gap-2 rounded-lg border bg-[var(--color-background)] text-left',
                        'transition-[border-color,box-shadow] duration-150',
                        'focus:outline-none',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        TRIGGER_SIZE[size],
                        triggerBorder,
                        className,
                    ].join(' ')}
                >
                    {/* Left icon */}
                    {icon && !loading && (
                        <span className="text-[var(--color-foreground-muted)] shrink-0" aria-hidden="true">
                            {icon}
                        </span>
                    )}

                    {/* Spinner (replaces icon when loading) */}
                    {loading && (
                        <Loader2
                            size={15}
                            className="shrink-0 text-[var(--color-foreground-muted)] animate-spin"
                            aria-hidden="true"
                        />
                    )}

                    {/* Selected label / placeholder */}
                    <span className={`flex-1 truncate ${displayLabel ? 'text-[var(--color-foreground)]' : 'text-[var(--color-foreground-muted)]'}`}>
                        {loading ? 'Loading…' : (displayLabel || placeholder || 'Select…')}
                    </span>

                    {/* Error indicator */}
                    {error && !loading && (
                        <AlertCircle size={15} className="shrink-0 text-[var(--color-error)]" aria-hidden="true" />
                    )}

                    {/* Chevron */}
                    <ChevronDown
                        size={15}
                        aria-hidden="true"
                        className={[
                            'shrink-0 text-[var(--color-foreground-muted)] transition-transform duration-150',
                            open ? 'rotate-180' : '',
                        ].join(' ')}
                    />
                </button>

                {/* Dropdown panel */}
                {open && (
                    <div
                        ref={panelRef}
                        onKeyDown={onPanelKeyDown}
                        className={[
                            'absolute left-0 right-0 z-50',
                            'bg-[var(--color-card)] border border-[var(--color-border)]',
                            'rounded-xl shadow-lg',
                            'overflow-hidden',
                            'animate-select-panel',
                            panelPosition,
                        ].join(' ')}
                        style={{ minWidth: '100%' }}
                    >
                        {/* Search input */}
                        {searchable && (
                            <div className="p-2 border-b border-[var(--color-border)]">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow] duration-150">
                                    <Search size={13} className="text-[var(--color-foreground-muted)] shrink-0" aria-hidden="true" />
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                                        placeholder="Search…"
                                        className="flex-1 bg-transparent text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] outline-none min-w-0"
                                        aria-label="Search options"
                                    />
                                    {query && (
                                        <button
                                            type="button"
                                            onClick={() => { setQuery(''); searchRef.current?.focus(); }}
                                            className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors text-xs"
                                            aria-label="Clear search"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Options list */}
                        <ul
                            id={listboxId}
                            role="listbox"
                            aria-label={label ?? 'Options'}
                            className="max-h-56 overflow-y-auto overscroll-contain py-1"
                        >
                            {/* Placeholder option */}
                            {placeholder && !searchable && (
                                <li
                                    role="option"
                                    aria-selected={value === ''}
                                    aria-disabled="true"
                                    className={[
                                        OPTION_SIZE[size],
                                        'text-[var(--color-foreground-muted)] cursor-default select-none',
                                    ].join(' ')}
                                >
                                    {placeholder}
                                </li>
                            )}

                            {visibleOptions.length === 0 ? (
                                <li className="py-6 text-center text-sm text-[var(--color-foreground-muted)] select-none">
                                    No options found
                                </li>
                            ) : (
                                visibleOptions.map((opt, idx) => {
                                    const isSelected = opt.value === value;
                                    const isActive = idx === activeIndex;
                                    return (
                                        <li
                                            key={opt.value}
                                            ref={(el) => { optionRefs.current[idx] = el; }}
                                            role="option"
                                            aria-selected={isSelected}
                                            aria-disabled={opt.disabled}
                                            onClick={() => selectValue(opt)}
                                            onMouseEnter={() => !opt.disabled && setActiveIndex(idx)}
                                            className={[
                                                OPTION_SIZE[size],
                                                'flex items-center justify-between gap-2 cursor-pointer select-none transition-colors duration-100',
                                                opt.disabled
                                                    ? 'opacity-40 cursor-not-allowed'
                                                    : isActive
                                                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                                        : isSelected
                                                            ? 'text-[var(--color-primary)]'
                                                            : 'text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)]',
                                            ].join(' ')}
                                        >
                                            <span className="truncate">{opt.label}</span>
                                            {isSelected && (
                                                <Check
                                                    size={14}
                                                    className="shrink-0 text-[var(--color-primary)]"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p className="flex items-center gap-1.5 text-xs text-[var(--color-error)] mt-1.5" role="alert">
                    <AlertCircle size={12} aria-hidden="true" />
                    {error}
                </p>
            )}
        </div>
    );
}

Select.displayName = 'Select';
export default Select;
