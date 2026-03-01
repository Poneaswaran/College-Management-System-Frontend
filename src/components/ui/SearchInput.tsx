/**
 * SearchInput — A themed search bar with built-in search icon.
 *
 * Usage:
 *   <SearchInput
 *     value={searchTerm}
 *     onChange={setSearchTerm}
 *     placeholder="Search students..."
 *   />
 *
 * Colors come from CSS variables (theme.tsx / theme.constants.ts).
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'size'> {
    /** Current search value */
    value: string;
    /** Callback when search value changes — receives the string directly */
    onChange: (value: string) => void;
    /** Whether to show a clear button when there's text. Defaults to true */
    showClear?: boolean;
    /** Size variant. Defaults to 'md' */
    size?: 'sm' | 'md' | 'lg';
    /** Additional className for the outer wrapper */
    wrapperClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
    value,
    onChange,
    placeholder = 'Search...',
    showClear = true,
    size = 'md',
    className = '',
    wrapperClassName = '',
    disabled,
    ...props
}, ref) => {
    const sizeClasses = {
        sm: { wrapper: '', icon: 16, input: 'pl-9 pr-8 py-1.5 text-sm' },
        md: { wrapper: '', icon: 18, input: 'pl-10 pr-9 py-2 text-sm' },
        lg: { wrapper: '', icon: 20, input: 'pl-11 pr-10 py-2.5 text-base' },
    };

    const s = sizeClasses[size];

    return (
        <div className={`relative ${s.wrapper} ${wrapperClassName}`}>
            <Search
                size={s.icon}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] pointer-events-none"
            />
            <input
                ref={ref}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full ${s.input} border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                {...props}
            />
            {showClear && value && !disabled && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
                    tabIndex={-1}
                    aria-label="Clear search"
                >
                    <X size={s.icon - 2} />
                </button>
            )}
        </div>
    );
});
SearchInput.displayName = 'SearchInput';
export default SearchInput;
