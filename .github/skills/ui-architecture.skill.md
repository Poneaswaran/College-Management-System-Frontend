---
name: ui-architecture
description: Project-wide UI architecture rules for the College Management System React + Vite frontend.
---

# UI Architecture Skill

## Purpose

Define the structural blueprint of the College Management System frontend. This skill enforces how the application is organized, how modules are wired together, and how new feature areas must be scaffolded.

## When to Use

- Creating a new feature module (e.g., fees, library, placement)
- Adding new pages to existing modules
- Restructuring existing code
- Onboarding to the project
- Reviewing architectural decisions in PRs

## Detected Architecture

### Stack

| Layer              | Technology                                            |
|--------------------|-------------------------------------------------------|
| Framework          | React 19 + TypeScript ~5.9                           |
| Build              | Vite (rolldown-vite 7.2.5) with SWC plugin           |
| Styling            | Tailwind CSS v4 + CSS custom properties              |
| State (Global)     | Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)   |
| State (Local/UI)   | React Context API (Theme, Sidebar, Notifications)    |
| Data Fetching      | Apollo Client v4 (GraphQL primary), Axios (REST secondary) |
| Routing            | React Router DOM v7 (HashRouter, manual routes)       |
| Forms              | React Hook Form + Zod validation                     |
| Tables             | TanStack React Table v8                               |
| Icons              | Lucide React                                          |
| Code Generation    | GraphQL Codegen (TypeScript + React Apollo hooks)     |

### Directory Map

```
src/
├── app/                  # Application shell
│   ├── main.tsx          # Entry point (StrictMode + App)
│   ├── App.tsx           # Root composition (Providers + Router)
│   ├── providers.tsx     # Provider composition tree
│   └── router.tsx        # All route definitions
├── assets/               # Static files (images, fonts)
├── components/           # Shared, reusable components
│   ├── auth/             # Auth-specific components (AuthInitializer)
│   ├── common/           # Cross-cutting (ErrorBoundary)
│   ├── layout/           # Structural (Sidebar, PageLayout, Navbar)
│   ├── notifications/    # Notification panel, bell, items
│   └── ui/               # Primitive UI (Button, Input, Toast, Skeleton, Charts)
├── config/               # Static configuration (API URLs)
├── contexts/             # React Context providers
├── features/             # Feature modules (domain-driven)
│   ├── auth/             # Login, logout, user state
│   ├── assignments/      # Full CRUD, Redux slice, hooks
│   ├── attendance/       # Attendance tracking
│   ├── exams/            # Exam management
│   ├── faculty/          # Faculty dashboard data
│   └── students/         # Student profile, courses, grades
├── generated/            # GraphQL Codegen output
├── graphql/              # Shared GraphQL documents
├── hooks/                # Shared custom hooks
├── lib/                  # Shared utilities and clients
├── pages/                # Route-level page components
│   ├── auth/             # Login, Register
│   ├── dashboard/        # Generic dashboard
│   ├── faculty/          # Faculty role pages
│   ├── hod/              # HOD role pages
│   ├── not-found/        # 404
│   ├── settings/         # Settings pages
│   └── student/          # Student role pages
├── services/             # API service singletons (Axios)
├── store/                # Redux store + selectors
├── styles/               # Global CSS (index.css)
├── types/                # Shared TypeScript types
├── utils/                # Shared utility functions
├── theme.tsx             # ThemeProvider + useTheme hook
└── theme.constants.ts    # Design tokens, color palette, tw utility classes
```

## Rules

### 1. Provider Composition Order

Providers are nested in `app/providers.tsx`. The order matters:

```
ThemeProvider
  └── Redux Provider
      └── ApolloProvider
          └── ToastProvider
              └── NotificationProvider
                  └── SidebarProvider
                      └── HashRouter
                          └── KeyboardShortcutsProvider
                              └── {children}
```

When adding a new provider, insert it at the correct level based on its dependencies. A provider that depends on Redux must be nested inside the Redux Provider. A provider that depends on routing must be inside HashRouter.

### 2. Feature Module Structure

Every feature module in `src/features/<name>/` must contain:

```
features/<name>/
├── types.ts           # TypeScript interfaces and type aliases
├── api.ts             # API layer (GraphQL mutations/queries via Apollo client)
├── hooks.ts           # Custom React hooks encapsulating business logic
├── slice.ts           # Redux slice (only if global state needed)
├── graphql/           # GraphQL query/mutation documents (gql tagged templates)
│   └── queries.ts
├── components/        # Feature-specific presentational components (optional)
└── types/             # Additional domain type files (optional, for complex features)
```

If a feature does not need Redux, omit `slice.ts`. Not every feature requires a Redux slice; Apollo cache and local state are preferred for server data.

### 3. Page vs Feature Separation

- **Pages** (`src/pages/`) are route-level containers. They compose layout, fetch data, and delegate rendering to feature components.
- **Features** (`src/features/`) own the domain logic, API calls, and state. Pages import from features, never the reverse.
- Pages use `PageLayout` for consistent sidebar + content structure.

### 4. Routing

- All routes are manually defined in `src/app/router.tsx`.
- Routes are lazy-loaded via `React.lazy()` with `Suspense` fallback.
- Route structure follows role-based namespacing: `/student/*`, `/faculty/*`, `/hod/*`, `/auth/*`.
- The root path `/` redirects to `/auth/login`.
- `*` catch-all renders `NotFound`.

When adding a new route:
1. Create the lazy import at the top of `router.tsx`.
2. Add the `<Route>` element in the correct role section.
3. Add corresponding sidebar entry in `Sidebar.tsx` for the applicable role.

### 5. Role-Based Architecture

Three primary user roles drive the UI:
- **STUDENT** — routes under `/student/*`
- **FACULTY** — routes under `/faculty/*`
- **HOD** — routes under `/hod/*`

Each role has:
- Dedicated sidebar items in `Sidebar.tsx`
- Dedicated pages under `src/pages/<role>/`
- Post-login redirect based on `user.role.code`

### 6. Code Splitting Strategy

Vite config enforces manual chunks:

| Chunk               | Contents                                     |
|----------------------|----------------------------------------------|
| `react-vendor`       | react, react-dom, react-router               |
| `redux-vendor`       | @reduxjs/toolkit, react-redux                |
| `apollo-vendor`      | @apollo/client, graphql                      |
| `ui-vendor`          | lucide-react, react-webcam                   |
| `auth`               | features/auth + pages/auth                   |
| `student`            | features/students + pages/student            |
| `dashboard`          | pages/dashboard                              |
| `notifications`      | notification components, contexts, hooks, gql|
| `vendor`             | all other node_modules                       |

When adding a new feature, consider adding a manual chunk entry in `vite.config.ts` if the feature is large enough to warrant its own bundle.

## Anti-Patterns

- Placing domain logic directly in page components.
- Creating a new provider without adding it to `providers.tsx`.
- Using `window.location.href` for in-app navigation instead of `useNavigate()` (except for forced reloads after auth changes).
- Importing from `pages/` inside `features/`.
- Mixing REST (Axios) and GraphQL (Apollo) calls for the same domain without clear rationale.
- Adding routes without lazy loading.
- Adding sidebar items without corresponding routes.

## Extension Strategy

To add a new module (e.g., "fees"):

1. Create `src/features/fees/` with `types.ts`, `api.ts`, `hooks.ts`, and `graphql/queries.ts`.
2. Create pages under `src/pages/<role>/Fees*.tsx` (one per role that accesses it).
3. Add lazy imports and route entries in `router.tsx`.
4. Add sidebar items in `Sidebar.tsx` for each applicable role.
5. If global state is needed, create `slice.ts` and register the reducer in `store/index.ts`.
6. Add a manual chunk in `vite.config.ts` if the module is large.
7. Run `npm run build` to verify no lint or type errors.
