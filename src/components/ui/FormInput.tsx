/**
 * FormInput — A themed text/number/date/email input with optional label, error state, and icon.
 *
 * Usage:
 *   <FormInput
 *     label="Assignment Title"
 *     name="title"
 *     value={formData.title}
 *     onChange={handleInputChange}
 *     placeholder="e.g., Data Structures Assignment 1"
 *     error={validationErrors.title}
 *     required
 *   />
 *
 * Colors come from CSS variables (theme.tsx / theme.constants.ts).
 */

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Optional label above the input */
    label?: string;
    /** Optional error message below the input */
    error?: string;
    /** Optional helper text below the input */
    helperText?: string;
    /** Optional icon rendered inside the input on the left */
    icon?: ReactNode;
    /** Additional className for the outer wrapper */
    wrapperClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    className = '',
    label,
    error,
    helperText,
    icon,
    required,
    id,
    wrapperClassName = '',
    ...props
}, ref) => {
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
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] pointer-events-none">
                        {icon}
                    </span>
                )}
                <input
                    ref={ref}
                    id={id}
                    required={required}
                    className={`w-full px-3 py-2 ${icon ? 'pl-9' : ''} border ${error
                            ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
                            : 'border-[var(--color-border)] focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]'
                        } rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-[var(--color-error)] mt-1">{error}</p>}
            {!error && helperText && (
                <p className="text-xs text-[var(--color-foreground-muted)] mt-1">{helperText}</p>
            )}
        </div>
    );
});
FormInput.displayName = 'FormInput';
export default FormInput;
