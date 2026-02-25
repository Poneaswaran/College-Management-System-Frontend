/**
 * Skeleton Loading Components
 * Animated placeholder components shown while content is loading.
 * Uses theme colors from theme.constants.ts via CSS variables.
 */

interface SkeletonProps {
    className?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
}

/** Base skeleton block with shimmer animation */
export function Skeleton({ className = '', width, height, borderRadius }: SkeletonProps) {
    return (
        <div
            className={`skeleton-shimmer ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
}

/** Skeleton avatar circle */
export function SkeletonAvatar({ size = 48 }: { size?: number }) {
    return (
        <Skeleton
            width={`${size}px`}
            height={`${size}px`}
            borderRadius="var(--radius-full)"
        />
    );
}

/** Skeleton text line */
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height="14px"
                    width={i === lines - 1 ? '60%' : '100%'}
                    borderRadius="var(--radius-sm)"
                />
            ))}
        </div>
    );
}

/** Skeleton stat card — matches dashboard KPI cards */
export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <Skeleton width="40px" height="40px" borderRadius="var(--radius-lg)" />
                <Skeleton width="80px" height="14px" borderRadius="var(--radius-sm)" />
            </div>
            <Skeleton width="50%" height="28px" borderRadius="var(--radius-sm)" className="mb-2" />
            <Skeleton width="70%" height="14px" borderRadius="var(--radius-sm)" />
        </div>
    );
}

/** Skeleton table rows */
export function SkeletonTable({ rows = 5, columns = 4, className = '' }: { rows?: number; columns?: number; className?: string }) {
    return (
        <div className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex gap-4 p-4 border-b border-[var(--color-border)]">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton
                        key={`header-${i}`}
                        height="16px"
                        className="flex-1"
                        borderRadius="var(--radius-sm)"
                    />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div
                    key={`row-${rowIdx}`}
                    className="flex gap-4 p-4 border-b border-[var(--color-border)] last:border-b-0"
                    style={{ animationDelay: `${rowIdx * 80}ms` }}
                >
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <Skeleton
                            key={`cell-${rowIdx}-${colIdx}`}
                            height="14px"
                            className="flex-1"
                            borderRadius="var(--radius-sm)"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

/** Full dashboard skeleton — 4 stat cards + table */
export function SkeletonDashboard() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton width="200px" height="28px" borderRadius="var(--radius-sm)" />
                    <Skeleton width="300px" height="16px" borderRadius="var(--radius-sm)" />
                </div>
                <Skeleton width="120px" height="40px" borderRadius="var(--radius-lg)" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Table */}
            <SkeletonTable rows={6} columns={5} />
        </div>
    );
}

/** Skeleton profile page */
export function SkeletonProfile() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Profile header */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-8">
                <div className="flex items-center gap-6">
                    <SkeletonAvatar size={96} />
                    <div className="space-y-3 flex-1">
                        <Skeleton width="200px" height="24px" borderRadius="var(--radius-sm)" />
                        <Skeleton width="160px" height="14px" borderRadius="var(--radius-sm)" />
                        <Skeleton width="120px" height="14px" borderRadius="var(--radius-sm)" />
                    </div>
                </div>
            </div>

            {/* Form fields */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton width="100px" height="14px" borderRadius="var(--radius-sm)" />
                            <Skeleton height="42px" borderRadius="var(--radius-lg)" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Skeleton chart placeholder */
export function SkeletonChart({ height = '300px', className = '' }: { height?: string; className?: string }) {
    return (
        <div className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <Skeleton width="160px" height="20px" borderRadius="var(--radius-sm)" />
                <div className="flex gap-2">
                    <Skeleton width="60px" height="28px" borderRadius="var(--radius-full)" />
                    <Skeleton width="60px" height="28px" borderRadius="var(--radius-full)" />
                </div>
            </div>
            <div className="flex items-end gap-2 justify-center" style={{ height }}>
                {[45, 72, 58, 85, 40, 68, 55, 78].map((barHeight, i) => (
                    <Skeleton
                        key={i}
                        width="10%"
                        height={`${barHeight}%`}
                        borderRadius="var(--radius-sm) var(--radius-sm) 0 0"
                    />
                ))}
            </div>
        </div>
    );
}
