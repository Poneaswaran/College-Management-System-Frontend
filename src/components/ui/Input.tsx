import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    className = '',
    label,
    error,
    ...props
}, ref) => {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium">{label}</label>}
            <input
                ref={ref}
                className={`input ${error ? 'border-destructive' : ''} ${className}`}
                {...props}
            />
            {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
    );
});
Input.displayName = 'Input';
