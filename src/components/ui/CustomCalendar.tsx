import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCalendarProps {
    value?: Date;
    onChange?: (date: Date) => void;
    className?: string;
    placeholder?: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toDateOnly = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const isSameDay = (a: Date, b: Date): boolean => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
    value,
    onChange,
    className = '',
    placeholder = 'Select date',
}) => {
    const selectedDate = value ? toDateOnly(value) : null;
    const today = toDateOnly(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [displayMonth, setDisplayMonth] = useState<Date>(() => {
        const current = selectedDate ?? today;
        return new Date(current.getFullYear(), current.getMonth(), 1);
    });
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const days = useMemo(() => {
        const firstDayOfMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1);
        const lastDayOfMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0);
        const leadingBlankDays = firstDayOfMonth.getDay();
        const totalDays = lastDayOfMonth.getDate();
        const slots: Array<Date | null> = [];

        for (let i = 0; i < leadingBlankDays; i += 1) {
            slots.push(null);
        }

        for (let day = 1; day <= totalDays; day += 1) {
            slots.push(new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day));
        }

        while (slots.length % 7 !== 0) {
            slots.push(null);
        }

        return slots;
    }, [displayMonth]);

    const monthLabel = displayMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    const selectedLabel = selectedDate
        ? selectedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : placeholder;

    const handleDateSelect = (date: Date) => {
        const normalized = toDateOnly(date);
        onChange?.(normalized);
        setIsOpen(false);
    };

    const goToPreviousMonth = () => {
        setDisplayMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setDisplayMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    return (
        <div className={`relative ${className}`} ref={calendarRef}>
            <button
                type="button"
                onClick={() => {
                    setDisplayMonth((prev) => {
                        if (isOpen) return prev;
                        const target = selectedDate ?? today;
                        return new Date(target.getFullYear(), target.getMonth(), 1);
                    });
                    setIsOpen((prev) => !prev);
                }}
                className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] hover:border-[var(--color-border-hover)] transition-colors flex items-center gap-2"
                title="Open calendar"
            >
                <Calendar size={16} className="text-[var(--color-primary)]" />
                <span className={`text-xs md:text-sm font-medium whitespace-nowrap ${selectedDate ? 'text-[var(--color-foreground)]' : 'text-[var(--color-foreground-muted)]'}`}>
                    {selectedLabel}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-theme-xl p-3 z-50 animate-scale-in">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-background-secondary)] text-[var(--color-foreground-secondary)]"
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <p className="text-sm font-semibold text-[var(--color-foreground)]">{monthLabel}</p>
                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-background-secondary)] text-[var(--color-foreground-secondary)]"
                            aria-label="Next month"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {WEEKDAYS.map((weekday) => (
                            <span key={weekday} className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-foreground-muted)] text-center py-1">
                                {weekday}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                            if (!day) {
                                return <span key={`empty-${index}`} className="h-8" aria-hidden="true" />;
                            }

                            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                            const isToday = isSameDay(day, today);

                            return (
                                <button
                                    key={day.toISOString()}
                                    type="button"
                                    onClick={() => handleDateSelect(day)}
                                    className={`h-8 rounded-lg text-sm font-medium transition-colors ${
                                        isSelected
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : isToday
                                                ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20'
                                                : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-foreground)]'
                                    }`}
                                >
                                    {day.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomCalendar;