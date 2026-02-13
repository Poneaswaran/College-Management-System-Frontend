# GitHub Copilot Instructions - College Management System Frontend

## Architecture Overview

This is a React 19.2 + TypeScript SPA using a **feature-based architecture**. Key architectural decisions:

- **Hash-based routing** (`HashRouter`) for GitHub Pages compatibility - URLs use `#/path` format
- **GraphQL + REST hybrid**: Apollo Client for queries, Axios for REST endpoints (see `src/features/auth/api.ts`)
- **Provider hierarchy**: ThemeProvider → Redux Provider → ApolloProvider → HashRouter (see `src/app/providers.tsx`)
- **Lazy-loaded routes** with Suspense for code splitting (all page components in `src/app/router.tsx`)

## Critical Build Requirements

**ALWAYS run after code changes:**
```bash
npm run build  # Runs lint + TypeScript check + Vite build
```

Build will **fail on lint errors** by design. The build uses rolldown-vite (Vite 7.2) with custom chunking strategy:
- Base path: `/College-Management-System-Frontend/` (required for GitHub Pages)
- Manual chunks: `react-vendor`, `redux-vendor`, `apollo-vendor`, `auth`, `student`, `dashboard`
- Target: Keep chunks under 600KB (configured in `vite.config.ts`)

## Styling & Theming System

**CRITICAL**: Always use the centralized theme system, never hardcode colors.

1. **Theme constants** live in `src/theme.constants.ts` (colors, typography, spacing, etc.)
2. **Theme components** in `src/theme.tsx` (ThemeProvider, useTheme hook)
3. **Access colors via CSS variables**:
   ```tsx
   // ✅ Correct
   className="bg-[var(--color-primary)] text-[var(--color-foreground)]"
   
   // ❌ Wrong
   className="bg-blue-500 text-gray-900"
   ```
4. **Use Tailwind CSS** exclusively for styling - already configured with custom theme integration

Theme structure: `themeConfig.brand`, `.ui`, `.status`, `.typography`, `.gradients`

## Feature Module Pattern

Features follow a strict modular structure (see `src/features/`):

```
features/
  ├── auth/
  │   ├── api.ts          # GraphQL mutations/queries or REST calls
  │   ├── hooks.ts        # Feature-specific hooks (e.g., useAuth)
  │   ├── types.ts        # TypeScript interfaces
  │   ├── slice.ts        # Redux Toolkit slice
  │   └── components/     # Feature-specific components (optional)
```

**Key pattern**: Each feature exports a custom hook that encapsulates logic:
```typescript
// Example from src/features/auth/hooks.ts
export const useAuth = () => {
  const dispatch = useDispatch();
  const login = async (credentials: LoginCredentials): Promise<User> => {
    dispatch(loginStart());
    const response = await loginApi(credentials);
    dispatch(loginSuccess(response.data));
    return response.data.user;
  };
  return { user, isAuthenticated, login };
};
```

## TypeScript Standards

**NEVER use `any` type** - will fail linting. Patterns used:

```typescript
// ✅ Use unknown for caught errors
catch (error: unknown) {
  const errorMessage = error instanceof Error && 'response' in error 
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'
    : 'Login failed';
}

// ✅ Define explicit interfaces for API responses
interface LoginResponse {
  login: {
    accessToken: string;
    user: User;
  };
}
```

## GraphQL Integration

Apollo Client setup in `src/lib/graphql.ts`. Use `gql` tag for queries/mutations:

```typescript
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(data: { username: $username, password: $password }) {
      accessToken
      user { id email role { code } }
    }
  }
`;

const { data } = await client.mutate<LoginResponse>({
  mutation: LOGIN_MUTATION,
  variables: credentials,
});
```

Check for null data: `if (!data) throw new Error('No data returned')`

## Media & Asset Handling

**CRITICAL**: Always use the centralized `getMediaUrl()` utility for backend media paths.

Backend returns relative paths (e.g., `/media/student_profiles/photo.jpg`), which must be combined with `SERVER_URL`.

```typescript
// ✅ Correct - Use getMediaUrl utility
import { getMediaUrl } from '../../lib/constants';

const profilePhotoUrl = getMediaUrl(profile.profilePhotoUrl);
// Returns: 'http://192.168.2.232:8000/media/student_profiles/photo.jpg'

<img src={profilePhotoUrl} alt="Profile" />

// ❌ Wrong - Direct usage of backend path
<img src={profile.profilePhotoUrl} alt="Profile" />
```

**Key points:**
- Import from `src/lib/constants.ts`
- Handles null/undefined paths automatically
- Works with already-complete URLs (http/https)
- Removes duplicate slashes
- Configure backend URL in `src/config/constant.ts`

## React Patterns

1. **Lazy loading pages**: Always use `lazy()` + `Suspense` for route components
2. **Effect cleanup**: Avoid synchronous `setState` in effects - use `setTimeout(..., 0)` if needed
3. **Component exports**: Files exporting hooks/constants must not export components (lint rule `react-refresh/only-export-components`)

## State Management

- **Redux Toolkit** for global state (auth, user session)
- **Apollo cache** for GraphQL data
- **Local state** for UI-only concerns
- Selectors in store files (e.g., `selectCurrentUser` in `src/store/auth.store.ts`)

## Deployment & CI/CD

Auto-deploys to GitHub Pages on push to `main`. The workflow:
1. Lints code (fails on errors)
2. Type checks with `tsc -b`
3. Builds with Vite
4. Deploys `dist/` to GitHub Pages

**404 handling**: `public/404.html` redirects to index.html with sessionStorage for SPA routing

## Common Commands

```bash
npm run dev      # Dev server on localhost:3000
npm run lint     # ESLint check (must pass before commit)
npm run build    # Lint + TypeScript + Production build
npm run preview  # Preview production build locally
```

## File Naming & Organization

- Pages: `src/pages/{feature}/{PageName}.tsx` (PascalCase)
- Components: `src/components/{ui|layout}/{ComponentName}.tsx`
- Features: `src/features/{feature}/{api|hooks|slice|types}.ts`
- Routes use hash format: `/auth/login` becomes `/#/auth/login` in production

## ESLint Configuration

Uses flat config (`eslint.config.js`) with:
- TypeScript ESLint recommended rules
- React Hooks rules (enforced)
- React Refresh plugin (no non-component exports from component files)

Ignore patterns: `dist/`, node_modules (auto-ignored)
