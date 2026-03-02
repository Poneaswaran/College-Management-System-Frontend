---
name: performance
description: Performance optimization rules covering code splitting, bundle strategy, memoization, lazy loading, and rendering efficiency.
---

# Performance Skill

## Purpose

Define the performance optimization strategies and constraints in the College Management System frontend. Covers bundle optimization, rendering efficiency, network performance, and loading UX.

## When to Use

- Adding new dependencies or large features
- Optimizing page load or interaction speed
- Reviewing build output size
- Deciding on memoization or lazy loading
- Debugging performance regressions

## Detected Optimizations

### Build Configuration

| Setting                 | Value                    |
|-------------------------|--------------------------|
| Build Tool              | Vite (rolldown-vite)     |
| SWC Plugin              | `@vitejs/plugin-react-swc` |
| Chunk Size Warning      | 600 KB limit             |
| Source Maps (prod)      | Disabled                 |
| Manual Chunks           | 8 named chunk groups     |

### Current Chunk Strategy

```typescript
// vite.config.ts → manualChunks
'react-vendor'    → react, react-dom, react-router
'redux-vendor'    → @reduxjs/toolkit, react-redux
'apollo-vendor'   → @apollo/client, graphql
'ui-vendor'       → lucide-react, react-webcam
'auth'            → features/auth + pages/auth
'student'         → features/students + pages/student
'dashboard'       → pages/dashboard
'notifications'   → notification system
'vendor'          → all other node_modules
```

## Rules

### 1. Route-Level Code Splitting

Every page component must be wrapped in `React.lazy()`:

```tsx
const NewPage = lazy(() => import('../pages/<role>/NewPage'));
```

This creates a separate chunk per route that is only loaded when the user navigates to that route. This is mandatory, not optional.

### 2. Manual Chunk Assignment

When adding a new feature module that contains:
- 3+ page components, OR
- 2+ large components (>500 lines), OR
- Feature-specific dependencies

Add a manual chunk in `vite.config.ts`:

```typescript
if (id.includes('features/newFeature') || id.includes('pages/<role>/NewFeature')) {
    return 'new-feature';
}
```

Place the condition in the feature-based chunks section, after the vendor checks.

### 3. Memoization Policy

This project does not aggressively memoize. Follow these rules:

**Use `useCallback`** when:
- A function is passed as a prop to a child component that relies on referential equality.
- A function is a dependency of `useEffect` or `useMemo`.
- A function is used in a `useToast().addToast` or dispatch operation that triggers re-renders.

**Use `useMemo`** when:
- Deriving a value from a large dataset (e.g., filtering/sorting tables).
- Computing expensive transformations on every render.
- The memo'd value is used as a dependency in other hooks.

**Do not use** memoization for:
- Simple boolean/string computations.
- Values that change on every render anyway.
- Components that render infrequently.

Example from Charts.tsx:
```tsx
const computedMax = useMemo(
    () => maxValue ?? Math.max(...data.map(d => d.value)),
    [maxValue, data]
);
```

### 4. Image and Asset Handling

- Static images in `src/assets/` are imported and bundled by Vite.
- Profile photos and dynamic images use `getMediaUrl()` to resolve backend URLs.
- Image compression utility exists at `src/lib/imageCompression.ts` for client-side compression before upload.

Use `<img loading="lazy">` for images below the fold.

### 5. Apollo Client Caching

The `InMemoryCache` is configured with default behavior. `fetchPolicy: 'network-only'` is set globally, meaning:
- Queries always hit the network.
- Cache is populated after each query.
- Mutations do not automatically update queries.

To optimize specific queries that can tolerate stale data:

```typescript
const { data } = useQuery(SOME_QUERY, {
    fetchPolicy: 'cache-and-network', // Show cached data immediately, then update
});
```

Use this only for data that changes infrequently (e.g., department lists, semester options).

### 6. Skeleton Loading Pattern

Instead of showing blank screens during data loading, always use the Skeleton system:

```tsx
if (loading) return <SkeletonDashboard />;
if (error) return <ErrorDisplay />;
return <ActualContent />;
```

This reduces perceived load time and prevents layout shift.

Available skeletons:
- `SkeletonDashboard` — full page with stat cards + table
- `SkeletonProfile` — profile page layout
- `SkeletonTable` — data table with configurable rows/columns
- `SkeletonCard` — individual stat card
- `SkeletonChart` — chart placeholder
- `SkeletonText` — text block with lines
- `SkeletonAvatar` — circular avatar placeholder

### 7. Font Loading

Fonts are loaded from Google Fonts via `<link>` in `index.html`:
- `DM Sans` (400, 500, 600, 700, 900) — primary font
- `Space Mono` (400, 700) — monospace accent

These are loaded with `display=swap` to prevent FOIT (Flash of Invisible Text).

### 8. ScrollBehavior

```css
html { scroll-behavior: smooth; }
body { overflow-x: hidden; }
```

Smooth scrolling is enabled globally. Horizontal overflow is hidden to prevent layout issues.

### 9. Avoid Oversized Components

If a component file exceeds 400-500 lines, evaluate decomposition:
- Extract sub-sections into child components.
- Extract data transformation logic into utility functions.
- Extract hooks into separate files.

Current large files to be aware of:
- `Sidebar.tsx` (310 lines) — acceptable, contains role-specific menu definitions.
- `Charts.tsx` (485 lines) — acceptable, contains 5 distinct chart components.
- `KeyboardShortcuts.tsx` (675+ lines) — large, but self-contained subsystem.
- Assignment `hooks.ts` (563 lines) — large, but covers 6 exported hooks.
- Student dashboard pages — 400+ lines with inline rendering.

### 10. Reducing Re-renders

- Use `useSelector` with specific selectors, not broad state selections.
- The `selectCurrentUser`, `selectIsAuthenticated` selectors are properly scoped.
- Context providers (Theme, Sidebar, Notification) are small and change infrequently.
- Toast state changes are isolated to the ToastProvider and do not cascade.

## Anti-Patterns

- Importing entire icon libraries. Import individual icons: `import { User } from 'lucide-react'`.
- Fetching data in `useEffect` without cleanup or race condition handling.
- Using `any` generics on Apollo queries — always type the response.
- Bundling dev-only tools in production (check `import.meta.env.DEV` guards).
- Adding large dependencies without checking bundle impact.
- Nesting multiple `useEffect` calls that could be consolidated.
- Client-side sorting/filtering of large datasets without `useMemo`.

## Extension Strategy

### Monitoring Build Size

After adding features, check the build output:

```bash
npm run build
```

Review the chunk sizes in the terminal output. If any chunk exceeds 600 KB:
1. Consider splitting the chunk via `manualChunks`.
2. Evaluate if heavy components can be lazy-loaded within the feature.
3. Check for accidental barrel exports pulling in unused code.

### Adding Heavy Dependencies

Before adding a new dependency:
1. Check the bundle size on bundlephobia.com.
2. If >50 KB gzipped, evaluate alternatives or dynamic import.
3. If used on only one route, ensure it's in a lazy-loaded chunk.
4. Add a manual chunk entry if the dependency is shared across routes.
