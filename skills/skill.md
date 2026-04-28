# Skills & Learned Patterns

## HOD Module Patterns
- **Grievances**: Uses a `DataTable` with custom renderers for status and priority. Resolution modal handles both `IN_PROGRESS` and `RESOLVED` states.
- **Arrears**: Tracks students with backlogs using `hodArrears.service`.
- **Student Performance**: Aggregates CGPA and attendance metrics.

## Frontend Development Best Practices
- **Dynamic Imports**: When using `lazy()`, ensure the module has a valid default export and no syntax errors.
- **TypeScript & Linting**: Always use specific interfaces instead of `any`. Common fixes include:
    - Replacing `any` with `unknown` or custom interfaces.
    - Cleaning up unused imports (though be careful with JSX usage).
    - Fixing missing dependencies in `useEffect` and `useCallback`.
- **Testing**: Added `data-testid` to all interactive elements for automation testing.
- **Styling**: Always use Tailwind CSS and variables from `theme.tsx`.

## Error Resolution
- **Failed to fetch dynamically imported module**: Often caused by syntax errors in the lazily loaded component. Check for unclosed tags or incorrect imports.
