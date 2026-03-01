/**
 * Select — A themed dropdown/select component with optional icon, label, and error state.
 *
 * Usage:
 *   <Select
 *     value={filter}
 *     onChange={setFilter}
 *     options={[{ value: 'ALL', label: 'All' }, ...]}
 *     label="Department"
 *   />
 *
 * Colors come from CSS variables (theme.tsx / theme.constants.ts).
 */

import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
    /** Current value */
    value: string;
    /** Callback when value changes — receives the string directly */
    onChange: (value: string) => void;
    /** Options to render */
    options: SelectOption[];
    /** Optional label above the select */
    label?: string;
    /** Optional error message below the select */
    error?: string;
    /** Whether the field is required (shows red asterisk after label) */
    required?: boolean;
    /** Optional icon rendered to the left of the select */
    icon?: ReactNode;
    /** Placeholder option text (first disabled option). If omitted, no placeholder is shown. */
    placeholder?: string;
    /** Size variant. Defaults to 'md' */
    size?: 'sm' | 'md' | 'lg';
    /** Additional className for the outer wrapper */
    wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    value,
    onChange,
    options,
    label,
    error,
    required = false,
    icon,
    placeholder,
    size = 'md',
    className = '',
    wrapperClassName = '',
    disabled,
    id,
    ...props
}, ref) => {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
    };

    const selectEl = (
        <div className="relative">
            {icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] pointer-events-none">
                    {icon}
                </span>
            )}
            <select
                ref={ref}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`w-full ${sizeClasses[size]} ${icon ? 'pl-9' : ''} pr-9 appearance-none border ${error
                    ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
                    : 'border-[var(--color-border)] focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]'
                    } rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] pointer-events-none"
            />
        </div>
    );

    // If there's a label or error, wrap in a field container
    if (label || error) {
        return (
            <div className={wrapperClassName}>
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-[var(--color-foreground)] mb-2"
                    >
                        {label}
                        {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
                    </label>
                )}
                {selectEl}
                {error && (
                    <p className="text-xs text-[var(--color-error)] mt-1">{error}</p>
                )}
            </div>
        );
    }

    return <div className={wrapperClassName}>{selectEl}</div>;
});
Select.displayName = 'Select';
export default Select;
