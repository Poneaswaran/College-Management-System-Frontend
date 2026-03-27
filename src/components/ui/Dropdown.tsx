import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
    label: string;
    value: string | number;
}

interface DropdownProps {
    options: DropdownOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    className?: string;
    dataTestId?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    error,
    required = false,
    className = '',
    dataTestId,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => String(opt.value) === String(value));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`flex flex-col gap-1.5 ${className} ${isOpen ? 'relative z-[60]' : 'relative'}`} ref={dropdownRef}>
            {label && (
                <label className="text-sm font-semibold text-[var(--color-foreground)] flex items-center gap-1 uppercase tracking-wider text-[11px]">
                    {label}
                    {required && <span className="text-[var(--color-error)]">*</span>}
                </label>
            )}
            
            <div className="relative">
                <button
                    type="button"
                    onClick={handleToggle}
                    data-testid={dataTestId}
                    className={`
                        w-full flex items-center justify-between px-4 py-2.5 
                        bg-[var(--color-background-secondary)] border 
                        rounded-xl transition-all duration-200 text-sm
                        ${isOpen ? 'border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'}
                        ${error ? 'border-[var(--color-error)] ring-4 ring-[var(--color-error)]/10' : ''}
                    `}
                >
                    <span className={selectedOption ? 'text-[var(--color-foreground)]' : 'text-[var(--color-foreground-muted)]'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown 
                        size={16} 
                        className={`text-[var(--color-foreground-secondary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-theme-xl overflow-hidden animate-scale-in">
                        <div className="max-h-60 overflow-y-auto">
                            {options.length > 0 ? (
                                options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-2.5 text-sm text-left
                                            transition-colors duration-150
                                            ${String(option.value) === String(value) 
                                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' 
                                                : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-foreground)]'}
                                        `}
                                    >
                                        <span>{option.label}</span>
                                        {String(option.value) === String(value) && <Check size={14} />}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-[var(--color-foreground-muted)] text-center">
                                    No options available
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {error && (
                <p className="text-xs text-[var(--color-error)] font-medium">{error}</p>
            )}
        </div>
    );
};

export default Dropdown;
