/**
 * FilterBar — A themed filter/search toolbar that wraps search + dropdowns in a card.
 *
 * Usage:
 *   <FilterBar>
 *     <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
 *     <FilterBar.Actions>
 *       <Select value={filter} onChange={setFilter} options={options} />
 *     </FilterBar.Actions>
 *   </FilterBar>
 *
 * Colors come from CSS variables (theme.tsx / theme.constants.ts).
 */

import type { ReactNode } from 'react';

interface FilterBarProps {
    children: ReactNode;
    className?: string;
}

interface FilterBarActionsProps {
    children: ReactNode;
    className?: string;
}

function FilterBarActions({ children, className = '' }: FilterBarActionsProps) {
    return (
        <div className={`flex items-center gap-3 w-full md:w-auto ${className}`}>
            {children}
        </div>
    );
}
FilterBarActions.displayName = 'FilterBar.Actions';

export function FilterBar({ children, className = '' }: FilterBarProps) {
    return (
        <div
            className={`flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-[var(--color-card)] p-4 rounded-xl shadow-sm border border-[var(--color-border)] ${className}`}
        >
            {children}
        </div>
    );
}
FilterBar.displayName = 'FilterBar';
FilterBar.Actions = FilterBarActions;

export default FilterBar;
