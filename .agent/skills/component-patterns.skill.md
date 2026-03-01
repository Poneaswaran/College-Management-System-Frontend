---
name: component-patterns
description: Component design patterns, composition rules, and hook conventions used in the College Management System.
---

# Component Patterns Skill

## Purpose

Define how React components are designed, composed, and extended in this project. Covers naming, file structure, prop design, hook extraction, and state management boundaries.

## When to Use

- Creating any new React component
- Refactoring existing components
- Extracting reusable logic into hooks
- Deciding between local state, context, and Redux
- Reviewing component architecture

## Detected Patterns

### Component Categories

| Category         | Location                      | Purpose                                   | Export Style        |
|-----------------|-------------------------------|-------------------------------------------|---------------------|
| UI Primitives    | `src/components/ui/`          | Generic, style-only (Button, Input)       | Named export        |
| Layout           | `src/components/layout/`      | Structural shells (Sidebar, PageLayout)   | Default export      |
| Common           | `src/components/common/`      | Cross-cutting (ErrorBoundary)            | Named export        |
| Feature          | `src/features/*/components/`  | Domain-specific (assignment cards)        | Named export        |
| Notifications    | `src/components/notifications/`| Notification subsystem                    | Default/Named       |
| Pages            | `src/pages/*/`                | Route containers                          | Default export      |

### Naming Conventions

- **Components**: PascalCase. File name matches component name. `StudentDashboard.tsx` exports `StudentDashboard`.
- **Hooks**: camelCase with `use` prefix. `useAuth`, `useStudents`, `useAssignments`.
- **Types**: PascalCase interfaces. `User`, `AuthState`, `Assignment`.
- **Constants**: UPPER_SNAKE_CASE for true constants. `API_URL`, `APP_NAME`.
- **Utilities**: camelCase functions. `formatDate`, `ensureInt`, `getMediaUrl`.

## Rules

### 1. Component File Structure

Every component file follows this internal order:

```tsx
// 1. Imports (React, libraries, local)
import { useState, useEffect } from 'react';
import { SomeIcon } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks';

// 2. Type declarations (interfaces, type aliases)
interface ComponentProps {
    title: string;
    onAction: () => void;
}

// 3. Sub-components or configuration objects (if small, colocated)
const configMap = { ... };

// 4. Main component
export default function ComponentName({ title, onAction }: ComponentProps) {
    // 4a. Hooks (state, context, custom hooks)
    // 4b. Derived values / memos
    // 4c. Effects
    // 4d. Handlers
    // 4e. Render helpers (inline functions for JSX)
    // 4f. Return JSX
}
```

### 2. Page Component Pattern

Pages are route-level orchestrators. They:
- Wrap content in `PageLayout`
- Call feature hooks for data fetching
- Handle loading, error, and empty states
- Delegate rendering to feature components or inline JSX

```tsx
export default function StudentAssignments() {
    const { data, loading, error, actions } = useAssignments();
    
    return (
        <PageLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1>Assignments</h1>
                </div>
                
                {/* Content with state handling */}
                {loading && <SkeletonDashboard />}
                {error && <ErrorDisplay message={error} />}
                {!loading && !error && <AssignmentList data={data} />}
            </div>
        </PageLayout>
    );
}
```

### 3. UI Primitive Pattern

Primitives in `components/ui/` use `forwardRef`, extend native HTML attributes, and accept a `className` prop for composition:

```tsx
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
```

Key rules for primitives:
- Always use `forwardRef` for focusable elements.
- Always set `displayName`.
- Always spread remaining props via `...props`.
- Use CSS classes from `index.css`, not inline styles.
- Accept `className` for external composition.

### 3b. Reusable Form Components

The project provides shared form components in `src/components/ui/` that MUST be used instead of inline `<input>`, `<select>`, or search bars. This preserves visual consistency and reduces code duplication.

#### Available Components

| Component      | File                           | Use For                                      |
|---------------|--------------------------------|----------------------------------------------|
| `SearchInput`  | `components/ui/SearchInput.tsx` | Search bars with icon + clear button         |
| `Select`       | `components/ui/Select.tsx`      | Dropdowns with optional label, error, icon   |
| `FormInput`    | `components/ui/FormInput.tsx`   | Text/number/date inputs with label + error   |
| `FilterBar`    | `components/ui/FilterBar.tsx`   | Search + filter toolbar wrapper              |
| `DataTable`    | `components/ui/DataTable.tsx`   | Tables with pagination, skeletons, empty state |

#### SearchInput Usage

```tsx
import { SearchInput } from '../../components/ui/SearchInput';

<SearchInput
    value={searchTerm}
    onChange={setSearchTerm}
    placeholder="Search students..."
    size="md" // 'sm' | 'md' | 'lg'
    showClear // shows X clear button
    wrapperClassName="w-full md:w-96"
/>
```

#### Select Usage

```tsx
import { Select } from '../../components/ui/Select';

const OPTIONS = [
    { value: 'ALL', label: 'All Departments' },
    { value: 'CS', label: 'Computer Science' },
];

// In filter bars (no label):
<Select value={filter} onChange={setFilter} options={OPTIONS} />

// In forms (with label + error):
<Select
    label="Department"
    required
    value={formData.department}
    onChange={(val) => handleSelectChange('department', val)}
    options={OPTIONS}
    placeholder="Select Department"
    error={errors.department}
/>
```

#### FormInput Usage

```tsx
import { FormInput } from '../../components/ui/FormInput';

<FormInput
    id="title"
    name="title"
    label="Assignment Title"
    required
    type="text"
    value={formData.title}
    onChange={handleInputChange}
    placeholder="e.g., Data Structures Assignment 1"
    error={errors.title}
    helperText="Max 200 characters"
/>
```

#### FilterBar Usage (Compound Pattern)

```tsx
import { FilterBar } from '../../components/ui/FilterBar';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';

<FilterBar>
    <SearchInput value={search} onChange={setSearch} wrapperClassName="flex-1" />
    <FilterBar.Actions>
        <Select value={filter} onChange={setFilter} options={OPTIONS} />
    </FilterBar.Actions>
</FilterBar>
```

**Anti-pattern:** Do NOT create inline `<input type="text" />` or `<select>` elements with custom styling. Always use these shared components.

### 4. Custom Hook Pattern

Feature hooks encapsulate domain logic, Redux dispatch, and API calls:

```tsx
export const useFeatureName = () => {
    const dispatch = useDispatch();
    const data = useSelector(selectData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiCall();
            dispatch(setData(result));
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Operation failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    return { data, loading, error, fetchData };
};
```

Rules:
- Return an object with named properties, not positional arrays.
- Always expose `loading` and `error` states.
- Use `useCallback` for functions passed to children.
- Use `unknown` for catch blocks, type-narrow with `instanceof Error`.
- Keep API calls in the `api.ts` layer, not directly in hooks.

### 5. Context Provider Pattern

Contexts follow a three-part pattern: Context + Provider + Hook.

```tsx
// 1. Create context with undefined default
const SomeContext = createContext<SomeContextType | undefined>(undefined);

// 2. Provider component
export function SomeProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState(initialValue);
    return (
        <SomeContext.Provider value={{ state, setState }}>
            {children}
        </SomeContext.Provider>
    );
}

// 3. Consumer hook with guard
export function useSome() {
    const context = useContext(SomeContext);
    if (context === undefined) {
        throw new Error('useSome must be used within a SomeProvider');
    }
    return context;
}
```

Rules:
- Always throw in the hook if context is undefined—never silently return defaults.
- Add `// eslint-disable-next-line react-refresh/only-export-components` above consumer hook exports.
- Register the provider in `app/providers.tsx`.

### 6. Error Boundary Pattern

The project uses a class-based `ErrorBoundary` that:
- Shows a styled error page in production
- Shows technical stack traces in development (`import.meta.env.DEV`)
- Provides "Reload Page" and "Go to Dashboard" recovery actions
- Wraps the entire router in `app/router.tsx`

For new error-prone sections, wrap them in `<ErrorBoundary>` with optional `fallback` prop.

### 7. Loading State Pattern

Loading states use the Skeleton component system:
- `Skeleton` — base shimmer block
- `SkeletonCard` — matches KPI stat card layout
- `SkeletonTable` — matches data table layout
- `SkeletonDashboard` — full dashboard skeleton (4 cards + table)
- `SkeletonProfile` — profile page skeleton
- `SkeletonChart` — chart placeholder

Always use the appropriate Skeleton variant instead of spinners for page-level loading.

### 8. Toast Notification Pattern

Use the `useToast()` hook for user feedback:

```tsx
const { addToast } = useToast();

addToast({
    type: 'success', // 'success' | 'error' | 'warning' | 'info'
    title: 'Assignment submitted',
    message: 'Your work has been saved.',
    duration: 4000,
});
```

### 9. State Management Decision Tree

```
Is the data from a server?
├── Yes → Is it used by multiple features?
│   ├── Yes → Redux slice + Apollo cache
│   └── No  → Apollo cache only (useQuery/useMutation)
└── No  → Is it used across components on different routes?
    ├── Yes → React Context
    └── No  → Component-local useState
```

Currently in Redux:
- `auth` (user session, token, authentication state)
- `assignments` (complex CRUD with filters, pagination, multi-view)

Everything else uses Apollo Client cache or local component state.

## Anti-Patterns

- Props interfaces with more than 8 properties without decomposition.
- Components that both fetch data and render complex UI (split into container + presentational).
- Using `useEffect` for data fetching without corresponding loading/error state.
- `any` type annotations. Use `unknown` and narrow.
- Prop drilling beyond 2 levels. Extract to Context or Redux.
- `useMemo` / `useCallback` without measured performance justification. The project uses them sparingly and intentionally.
- Inline event handlers that contain business logic. Extract to named functions.
- Default-exporting anonymous functions. Always name exports.

## Extension Strategy

### Adding a new UI primitive

1. Create `src/components/ui/NewComponent.tsx`.
2. Use `forwardRef` if the component is interactive.
3. Define CSS classes in `src/styles/index.css` if the component needs custom styles.
4. Export as named export.

### Adding a feature component

1. Create `src/features/<name>/components/ComponentName.tsx`.
2. Import data via the feature's hooks, not directly from the API layer.
3. Accept only the props the component needs for rendering.
4. Keep business logic in hooks, rendering in components.

### Adding a new page

1. Create `src/pages/<role>/PageName.tsx`.
2. Default-export the page component.
3. Wrap content in `<PageLayout>`.
4. Use feature hooks for data.
5. Handle loading → `Skeleton*`, error → inline error, success → render.
6. Add lazy import and route in `router.tsx`.
