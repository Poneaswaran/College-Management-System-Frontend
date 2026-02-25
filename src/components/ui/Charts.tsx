/**
 * Animated Chart Components
 * Pure CSS + React animated charts without external chart libraries.
 * Uses theme colors from CSS variables (sourced from theme.tsx).
 */

import { useState, useEffect, useRef, useMemo } from 'react';

// ============================================
// ANIMATED PROGRESS RING (Circular)
// ============================================

interface ProgressRingProps {
    /** 0–100 percentage value */
    value: number;
    /** Outer diameter in px */
    size?: number;
    /** Stroke width in px */
    strokeWidth?: number;
    /** CSS color string – defaults to primary */
    color?: string;
    /** Track color – defaults to border */
    trackColor?: string;
    /** Label shown inside the ring */
    label?: string;
    /** Show percentage text inside */
    showValue?: boolean;
    /** Animation duration in ms */
    duration?: number;
    className?: string;
}

export function ProgressRing({
    value,
    size = 120,
    strokeWidth = 10,
    color = 'var(--color-primary)',
    trackColor = 'var(--color-border)',
    label,
    showValue = true,
    duration = 1200,
    className = '',
}: ProgressRingProps) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedValue / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedValue(Math.min(value, 100)), 100);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                />
                {/* Progress */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                        filter: `drop-shadow(0 0 6px ${color})`,
                    }}
                />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {showValue && (
                    <span
                        className="font-bold text-[var(--color-foreground)]"
                        style={{ fontSize: size * 0.22 }}
                    >
                        {Math.round(animatedValue)}%
                    </span>
                )}
                {label && (
                    <span
                        className="text-[var(--color-foreground-muted)]"
                        style={{ fontSize: size * 0.11 }}
                    >
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
}

// ============================================
// ANIMATED BAR CHART
// ============================================

export interface BarChartDataItem {
    label: string;
    value: number;
    color?: string;
}

interface BarChartProps {
    data: BarChartDataItem[];
    /** Maximum value for scaling – defaults to max in data */
    maxValue?: number;
    /** Bar height in the chart area (px) */
    height?: number;
    /** Show value labels on bars */
    showValues?: boolean;
    /** Title above the chart */
    title?: string;
    /** Animation delay between bars (ms) */
    staggerDelay?: number;
    className?: string;
}

export function BarChart({
    data,
    maxValue,
    height = 240,
    showValues = true,
    title,
    staggerDelay = 100,
    className = '',
}: BarChartProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const max = maxValue || Math.max(...data.map(d => d.value), 1);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const defaultColors = [
        'var(--color-primary)',
        'var(--color-secondary)',
        'var(--color-accent)',
        'var(--color-success)',
        'var(--color-info)',
        'var(--color-warning)',
        'var(--color-error)',
    ];

    return (
        <div
            ref={ref}
            className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 ${className}`}
        >
            {title && (
                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-6">{title}</h3>
            )}

            <div className="flex items-end gap-3 justify-around" style={{ height }}>
                {data.map((item, index) => {
                    const barH = (item.value / max) * 100;
                    const barColor = item.color || defaultColors[index % defaultColors.length];

                    return (
                        <div key={item.label} className="flex flex-col items-center flex-1 h-full justify-end">
                            {/* Value label */}
                            {showValues && (
                                <span
                                    className="text-xs font-semibold text-[var(--color-foreground-secondary)] mb-1 transition-opacity duration-500"
                                    style={{ opacity: isVisible ? 1 : 0, transitionDelay: `${index * staggerDelay + 400}ms` }}
                                >
                                    {item.value}
                                </span>
                            )}
                            {/* Bar */}
                            <div
                                className="w-full max-w-[48px] rounded-t-lg transition-all"
                                style={{
                                    height: isVisible ? `${barH}%` : '0%',
                                    backgroundColor: barColor,
                                    transitionDuration: '800ms',
                                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                                    transitionDelay: `${index * staggerDelay}ms`,
                                    boxShadow: isVisible ? `0 0 12px ${barColor}40` : 'none',
                                }}
                            />
                            {/* Label */}
                            <span className="text-xs text-[var(--color-foreground-muted)] mt-2 text-center truncate w-full">
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================
// ANIMATED HORIZONTAL PROGRESS BAR
// ============================================

interface ProgressBarProps {
    /** 0–100 */
    value: number;
    label?: string;
    color?: string;
    height?: number;
    showValue?: boolean;
    /** Animation duration in ms */
    duration?: number;
    className?: string;
}

export function ProgressBar({
    value,
    label,
    color = 'var(--color-primary)',
    height = 10,
    showValue = true,
    duration = 1000,
    className = '',
}: ProgressBarProps) {
    const [animatedWidth, setAnimatedWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedWidth(Math.min(value, 100)), 100);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className={`w-full ${className}`}>
            {(label || showValue) && (
                <div className="flex items-center justify-between mb-1.5">
                    {label && (
                        <span className="text-sm font-medium text-[var(--color-foreground-secondary)]">{label}</span>
                    )}
                    {showValue && (
                        <span className="text-sm font-bold text-[var(--color-foreground)]">{Math.round(animatedWidth)}%</span>
                    )}
                </div>
            )}
            <div
                className="w-full rounded-full overflow-hidden bg-[var(--color-background-tertiary)]"
                style={{ height }}
            >
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${animatedWidth}%`,
                        backgroundColor: color,
                        transition: `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                        boxShadow: `0 0 10px ${color}60`,
                    }}
                />
            </div>
        </div>
    );
}

// ============================================
// ANIMATED DONUT CHART
// ============================================

export interface DonutSegment {
    label: string;
    value: number;
    color: string;
}

interface DonutChartProps {
    segments: DonutSegment[];
    size?: number;
    strokeWidth?: number;
    /** Center text */
    centerLabel?: string;
    centerValue?: string;
    title?: string;
    className?: string;
}

export function DonutChart({
    segments,
    size = 180,
    strokeWidth = 24,
    centerLabel,
    centerValue,
    title,
    className = '',
}: DonutChartProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Precompute cumulative rotation offsets for each donut segment (pure – no mutation)
    const segmentLayouts = useMemo(() => {
        return segments.map((segment, i) => {
            const cumulativeValue = segments.slice(0, i).reduce((sum, s) => sum + s.value, 0);
            const segmentLength = (segment.value / total) * circumference;
            const rotation = (cumulativeValue / total) * 360;
            return { segmentLength, rotation };
        });
    }, [segments, total, circumference]);

    return (
        <div ref={ref} className={`flex flex-col items-center ${className}`}>
            {title && (
                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4">{title}</h3>
            )}

            <div className="relative inline-flex items-center justify-center">
                <svg width={size} height={size} className="-rotate-90">
                    {/* Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth={strokeWidth}
                    />
                    {/* Segments */}
                    {segments.map((segment, i) => {
                        const { segmentLength, rotation } = segmentLayouts[i];

                        return (
                            <circle
                                key={segment.label}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                                strokeDashoffset={isVisible ? 0 : circumference}
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    transformOrigin: 'center',
                                    transition: `stroke-dashoffset ${800 + i * 200}ms cubic-bezier(0.4, 0, 0.2, 1) ${i * 150}ms`,
                                    filter: `drop-shadow(0 0 4px ${segment.color}60)`,
                                }}
                            />
                        );
                    })}
                </svg>
                {/* Center */}
                {(centerValue || centerLabel) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {centerValue && (
                            <span className="font-bold text-2xl text-[var(--color-foreground)]">{centerValue}</span>
                        )}
                        {centerLabel && (
                            <span className="text-xs text-[var(--color-foreground-muted)]">{centerLabel}</span>
                        )}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {segments.map(seg => (
                    <div key={seg.label} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                        <span className="text-xs text-[var(--color-foreground-secondary)]">
                            {seg.label} ({seg.value})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// ANIMATED COUNTER (Count-up number)
// ============================================

interface AnimatedCounterProps {
    /** Target value */
    value: number;
    /** Duration in ms */
    duration?: number;
    /** Number of decimal places */
    decimals?: number;
    /** Prefix (e.g. "$") */
    prefix?: string;
    /** Suffix (e.g. "%") */
    suffix?: string;
    className?: string;
}

export function AnimatedCounter({
    value,
    duration = 1500,
    decimals = 0,
    prefix = '',
    suffix = '',
    className = '',
}: AnimatedCounterProps) {
    const [displayed, setDisplayed] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const startTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startTimeRef.current = null;

                    const animate = (timestamp: number) => {
                        if (!startTimeRef.current) startTimeRef.current = timestamp;
                        const elapsed = timestamp - startTimeRef.current;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setDisplayed(eased * value);

                        if (progress < 1) {
                            rafRef.current = requestAnimationFrame(animate);
                        }
                    };

                    rafRef.current = requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => {
            observer.disconnect();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [value, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {displayed.toFixed(decimals)}
            {suffix}
        </span>
    );
}
