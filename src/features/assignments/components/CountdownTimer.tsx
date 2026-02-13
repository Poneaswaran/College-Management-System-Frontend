/**
 * Countdown Timer Component
 * Shows time remaining until assignment deadline
 */

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  dueDate: string;
  isOverdue?: boolean;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  dueDate,
  isOverdue = false,
  className = '',
}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'warning' | 'danger'>('normal');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const deadline = new Date(dueDate).getTime();
      const difference = deadline - now;

      if (difference <= 0) {
        setTimeRemaining('Expired');
        setUrgency('danger');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 2) {
        setTimeRemaining(`${days} days remaining`);
        setUrgency('normal');
      } else if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h remaining`);
        setUrgency('warning');
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
        setUrgency('danger');
      } else {
        setTimeRemaining(`${minutes}m remaining`);
        setUrgency('danger');
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [dueDate]);

  const getColorClass = () => {
    if (isOverdue || urgency === 'danger') {
      return 'text-red-600 dark:text-red-400';
    }
    if (urgency === 'warning') {
      return 'text-orange-600 dark:text-orange-400';
    }
    return 'text-[var(--color-muted-foreground)]';
  };

  return (
    <div className={`flex items-center gap-1 text-sm ${getColorClass()} ${className}`}>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{timeRemaining}</span>
    </div>
  );
};
