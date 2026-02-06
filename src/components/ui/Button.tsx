import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className = '',
    variant = 'primary',
    size = 'md',
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={`btn btn-${variant} btn-${size} ${className}`}
            {...props}
        />
    );
});
Button.displayName = 'Button';
