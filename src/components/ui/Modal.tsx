import React, { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-xl'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className={`relative w-full ${maxWidth} bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl animate-scale-in`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                    <h2 className="text-xl font-bold text-[var(--color-foreground)] tracking-tight">
                        {title}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] rounded-xl transition-all duration-200"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
