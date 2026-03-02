---
name: routing
description: Routing conventions, lazy loading, role-based navigation, and sidebar integration rules for the College Management System.
---

# Routing Skill

## Purpose

Define how routes are declared, how navigation works, how code splitting is enforced, and how new routes integrate with the sidebar and role-based access control.

## When to Use

- Adding a new page or route
- Modifying navigation structure
- Adding sidebar menu items
- Implementing role-based access guards
- Debugging route resolution issues

## Detected Setup

### Router Configuration

| Setting          | Value                                      |
|------------------|--------------------------------------------|
| Router           | `HashRouter` from `react-router-dom` v7    |
| Route Style      | Manual `<Routes>` / `<Route>` definitions  |
| Code Splitting   | `React.lazy()` with `Suspense`             |
| Error Handling   | `ErrorBoundary` wraps entire router        |
| Base Path (prod) | `/College-Management-System-Frontend/`     |
| Base Path (dev)  | `/`                                        |

HashRouter is used because the application is deployed to GitHub Pages, which does not support server-side routing. All routes use hash-based URLs (e.g., `/#/student/dashboard`).

### Route Namespace Convention

```
/auth/*       → Authentication (login, register)
/dashboard    → Generic/admin dashboard
/student/*    → Student role pages
/faculty/*    → Faculty role pages
/hod/*        → HOD role pages
/settings/*   → Cross-role settings
/             → Redirects to /auth/login
*             → 404 NotFound
```

### Current Route Map

```
AUTH:
  /auth/login                → Login
  /auth/register             → Register

STUDENT:
  /student/dashboard         → StudentDashboard
  /student/attendance        → StudentAttendance
  /student/mark-attendance   → MarkAttendance
  /student/attendance-history → AttendanceHistory
  /student/profile           → StudentProfile
  /student/timetable         → Timetable
  /student/courses           → StudentCourses
  /student/grades            → Grades
  /student/assignments       → StudentAssignments
  /student/submissions       → MySubmissions
  /student/exams             → StudentExams

FACULTY:
  /faculty/dashboard         → FacultyDashboard
  /faculty/courses           → FacultyCourses
  /faculty/students          → StudentList
  /faculty/assignments       → FacultyAssignments
  /faculty/assignments/create → CreateAssignment
  /faculty/materials         → StudyMaterials
  /faculty/attendance        → AttendanceManagement
  /faculty/exams             → FacultyExams

HOD:
  /hod/dashboard             → HODDashboard
  /hod/assignments           → HODAssignments
  /hod/exams                 → HODExams

SETTINGS:
  /settings/notifications    → NotificationSettingsPage

SYSTEM:
  /                          → Navigate to /auth/login
  *                          → NotFound
```

## Rules

### 1. Adding a New Route

Step-by-step process:

```tsx
// 1. Add lazy import at the top of router.tsx
const NewPage = lazy(() => import('../pages/<role>/NewPage'));

// 2. Add Route element in the correct position (grouped by role)
<Route path="/<role>/new-page" element={<NewPage />} />

// 3. The page component must be default-exported
// src/pages/<role>/NewPage.tsx
export default function NewPage() { ... }
```

### 2. Lazy Loading

Every route component must be lazy-loaded. No direct imports of page components.

```tsx
// Correct
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));

// Incorrect — defeats code splitting
import Dashboard from '../pages/dashboard/Dashboard';
```

### 3. Loading Fallback

The `PageLoader` component is used as the Suspense fallback for all routes:

```tsx
const PageLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#2563eb'
    }}>
        Loading...
    </div>
);
```

This is intentionally unstyled (inline styles) to avoid CSS load dependency during chunk loading.

### 4. Post-Login Redirect

Login redirect is role-based, handled in `Login.tsx`:

```tsx
if (user?.role?.code === 'STUDENT') {
    navigate('/student/dashboard');
} else if (user?.role?.code === 'FACULTY') {
    navigate('/faculty/dashboard');
} else if (user?.role?.code === 'HOD') {
    navigate('/hod/dashboard');
} else {
    navigate('/dashboard');
}
```

When adding a new role, add a corresponding condition here and ensure a dashboard page exists.

### 5. Sidebar Integration

The sidebar in `components/layout/Sidebar.tsx` has separate item arrays per role:

- `studentSidebarItems: MenuItem[]`
- `facultySidebarItems: MenuItem[]`
- `hodSidebarItems: SidebarItem[]` (supports dropdown sub-menus)

MenuItem shape:
```tsx
interface MenuItem {
    icon: LucideIcon;
    label: string;
    path: string;
}
```

DropdownMenuItem shape (HOD only so far):
```tsx
interface DropdownMenuItem {
    icon: LucideIcon;
    label: string;
    isDropdown: true;
    children: MenuItem[];
}
```

When adding a new route:
1. Add the route in `router.tsx`.
2. Add a sidebar item in the appropriate role array in `Sidebar.tsx`.
3. Use an appropriate Lucide icon.
4. Maintain alphabetical or logical grouping.

### 6. Route Guards

The project currently uses `AuthInitializer` to fetch the current user on mount, but does not implement explicit route guards. Authentication is enforced at the API level (GraphQL error handling in `lib/graphql.ts` redirects to login on 401/UNAUTHENTICATED).

If explicit client-side guards are needed:

```tsx
// Pattern (not yet implemented, but follow this if needed)
function ProtectedRoute({ children, roles }: { children: ReactNode; roles: string[] }) {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
    if (roles.length > 0 && !roles.includes(user?.role?.code ?? '')) {
        return <Navigate to="/not-found" replace />;
    }
    return children;
}
```

### 7. Navigation

Use `useNavigate()` from `react-router-dom` for all in-app navigation:

```tsx
const navigate = useNavigate();
navigate('/student/dashboard');
```

Exception: Auth error handlers in `lib/graphql.ts` use `window.location.href = '/#/auth/login'` for hard redirects that clear Apollo cache state.

## Anti-Patterns

- Using `<Link>` for programmatic navigation triggered by user actions. Use `useNavigate()`.
- Directly importing page components without `lazy()`.
- Adding a route without updating the sidebar for the applicable role.
- Using BrowserRouter instead of HashRouter (breaks GitHub Pages deployment).
- Nesting routes without a clear parent layout component.
- Route paths that do not follow the `/<role>/<feature>` convention.

## Extension Strategy

To add a new feature with routes:

1. Create the page file: `src/pages/<role>/FeatureName.tsx` with default export.
2. Add lazy import in `router.tsx`.
3. Add `<Route>` element under the correct role group in `router.tsx`.
4. Add sidebar item in the correct role array in `Sidebar.tsx`.
5. If the feature serves multiple roles, create a page per role and add routes for each.
6. If the feature is large enough, add a manual chunk entry in `vite.config.ts`:
   ```tsx
   if (id.includes('features/featureName') || id.includes('pages/<role>/FeatureName')) {
       return 'feature-name';
   }
   ```
7. Run `npm run build` to verify route resolution and chunk splitting.
