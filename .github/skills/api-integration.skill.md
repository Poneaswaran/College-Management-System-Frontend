---
name: api-integration
description: API integration patterns for GraphQL (Apollo Client) and REST (Axios), including error handling, authentication, and code generation conventions.
---

# API Integration Skill

## Purpose

Define how the College Management System frontend communicates with the backend. Covers GraphQL as the primary data layer, Axios as the secondary REST layer, error handling, authentication flow, and code generation.

## When to Use

- Adding new queries or mutations
- Creating a new feature API layer
- Debugging API errors
- Modifying authentication flow
- Running or configuring GraphQL Codegen
- Handling error states in UI

## Detected Setup

### API Architecture

| Layer                | Technology           | Purpose                           |
|----------------------|----------------------|-----------------------------------|
| Primary Data         | Apollo Client v4     | GraphQL queries and mutations     |
| Secondary Data       | Axios                | REST endpoints (register, media)  |
| Schema               | `schema.graphql`     | Backend schema (local copy)       |
| Code Generation      | GraphQL Codegen      | TypeScript types + Apollo hooks   |
| Authentication       | Bearer token (JWT)   | Attached via Apollo link + Axios interceptor |

### Backend Configuration

```typescript
// src/config/constant.ts
export const SERVER_URL = 'http://127.0.0.1:8000';
export const API_PREFIX = '/graphql/';
export const API_URL = `${SERVER_URL}${API_PREFIX}`;
```

Environment variable override: `VITE_API_URL` and `VITE_SERVER_URL`.

## Rules

### 1. Apollo Client Setup

The Apollo Client is configured in `src/lib/graphql.ts` with:

```
Link Chain: errorLink → authLink → httpLink
```

- **httpLink**: Points to `API_URL` (Django GraphQL endpoint).
- **authLink**: Attaches `Authorization: Bearer <token>` from `localStorage`.
- **errorLink**: Handles GraphQL errors (UNAUTHENTICATED → redirect to login) and network errors (401 → clear token + redirect).

Default fetch policies:
```typescript
watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' }
query:      { fetchPolicy: 'network-only', errorPolicy: 'all' }
mutate:     { errorPolicy: 'all' }
```

`network-only` is intentional — the application always fetches fresh data from the server. Do not change this to `cache-first` without explicit reason.

### 2. GraphQL Query/Mutation File Pattern

GraphQL documents live inside feature modules:

```
src/features/<name>/graphql/
└── queries.ts    # Contains gql tagged template literals
```

Or directly in a feature file:
```
src/features/<name>/graphql.ts
```

Pattern:
```typescript
import { gql } from '@apollo/client';

export const GET_SOMETHING = gql`
    query GetSomething($id: ID!) {
        something(id: $id) {
            id
            name
            relatedObject {
                id
                name
            }
        }
    }
`;

export const CREATE_SOMETHING = gql`
    mutation CreateSomething($input: SomethingInput!) {
        createSomething(input: $input) {
            id
            name
        }
    }
`;
```

Naming conventions:
- Query constants: `GET_<ENTITY>`, `GET_<ENTITY>_LIST`, `GET_MY_<ENTITY>`
- Mutation constants: `CREATE_<ENTITY>`, `UPDATE_<ENTITY>`, `DELETE_<ENTITY>`
- Operation names in GraphQL must match the constant intent: `query GetSomething`, `mutation CreateSomething`
- Operation names must be globally unique across the codebase (GraphQL Codegen requirement).

### 3. Feature API Layer Pattern

Each feature has an `api.ts` that wraps Apollo Client calls:

```typescript
// src/features/<name>/api.ts
import { client } from '../../lib/graphql';
import { GET_SOMETHING, CREATE_SOMETHING } from './graphql/queries';
import type { Something, CreateSomethingInput } from './types';

export const fetchSomething = async (id: number): Promise<Something> => {
    const { data } = await client.query<{ something: Something }>({
        query: GET_SOMETHING,
        variables: { id },
    });
    
    if (!data) throw new Error('No data returned');
    return data.something;
};

export const createSomething = async (input: CreateSomethingInput): Promise<Something> => {
    const { data } = await client.mutate<{ createSomething: Something }>({
        mutation: CREATE_SOMETHING,
        variables: { input },
    });
    
    if (!data) throw new Error('No data returned');
    return data.createSomething;
};
```

Key rules:
- Use `client.query()` and `client.mutate()` directly (imperative style), not Apollo hooks. Hooks are used in generated code.
- Always specify the return type generic on `query<T>` / `mutate<T>`.
- Always check for `!data` and throw.
- Keep the API layer free of React dependencies.

### 4. Variable Type Safety

The Django/Python backend uses `Int` for ID fields in many places, while GraphQL schema often specifies `ID`. Use the `ensureInt` helper:

```typescript
import { ensureInt } from '../../utils/graphql-helpers';

// When passing variables that may be string IDs to Int-typed parameters
variables: {
    examId: ensureInt(examId),
    sectionId: ensureInt(sectionId),
}
```

This is critical for preventing type mismatch errors between the frontend (where IDs are often strings) and the backend (where many foreign keys are integers).

### 5. Auth API Pattern

Login and logout use GraphQL mutations in `features/auth/api.ts`:

```typescript
// Login: Returns { user, token }
const response = await client.mutate<LoginResponse>({
    mutation: LOGIN_MUTATION,
    variables: { username, password },
});

// Logout: Invalidates the access token
await client.mutate<LogoutResponse>({
    mutation: LOGOUT_MUTATION,
    variables: { accessToken },
});
```

Token lifecycle:
1. Login → Store `accessToken` in `localStorage` under key `token`.
2. All subsequent requests → `authLink` reads `localStorage.getItem('token')`.
3. Logout → Remove `token` from `localStorage`.
4. Auth error → `errorLink` clears token and redirects.

### 6. REST API Layer (Axios)

Axios is configured in both `src/lib/axios.ts` and `src/services/api.ts` (prefer `services/api.ts` for new code):

```typescript
import api from '../../services/api';

// POST request
const response = await api.post<{ user: User; token: string }>('/auth/register', data);

// GET request
const response = await api.get<Student[]>('/students');
```

Axios is used for:
- User registration (REST endpoint)
- File uploads (multipart/form-data)
- Media URL resolution

Axios interceptors handle:
- Request: Attach Bearer token
- Response: Redirect to login on 401

### 7. Error Handling

Three-tier error handling:

**Tier 1: Apollo Link Level** (`lib/graphql.ts`)
- Catches all GraphQL and network errors globally.
- Redirects to login on UNAUTHENTICATED/401.
- Logs errors to console.

**Tier 2: API Layer** (`features/*/api.ts`)
- Checks for `!data` responses.
- Throws typed errors.

**Tier 3: Hook/Component Level** (`features/*/hooks.ts`, pages)
- Catches errors from API layer.
- Sets `error` state for UI rendering.
- Uses `parseGraphQLError` from `lib/errorHandling.ts` for user-friendly messages.

```typescript
import { parseGraphQLError, getErrorMessage } from '../../lib/errorHandling';

try {
    await someApiCall();
} catch (err: unknown) {
    const details = parseGraphQLError(err);
    if (details.isAuthError) {
        // Redirect to login
    } else {
        setError(details.message);
    }
}
```

### 8. GraphQL Codegen

Configuration in `codegen.ts`:

```typescript
const config: CodegenConfig = {
    schema: './schema.graphql',
    documents: ['src/**/*.{ts,tsx}', '!excluded/paths'],
    generates: {
        'src/generated/graphql.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                withHooks: true,
                skipTypename: false,
                enumsAsTypes: true,
                scalars: {
                    DateTime: 'string',
                    Date: 'string',
                    Decimal: 'string',
                    JSON: 'Record<string, unknown>',
                    Time: 'string',
                    Upload: 'File',
                },
            },
        },
    },
};
```

To run codegen:
```bash
npm run codegen
```

Generated output: `src/generated/graphql.ts` — contains TypeScript types and React Apollo hooks.

Important: Operation names must be unique across all documents. Duplicate names cause codegen failure.

### 9. Media URL Resolution

Backend media paths are relative. Use the `getMediaUrl` helper:

```typescript
import { getMediaUrl } from '../lib/constants';

const imageUrl = getMediaUrl(profile.profilePhotoUrl);
// '/media/student_profiles/photo.jpg' → 'http://127.0.0.1:8000/media/student_profiles/photo.jpg'
```

### 10. Query Return Shape

When querying nested objects from the Django Graphene backend, always query the full nested object rather than flat foreign key IDs:

```graphql
# Correct — query nested objects
query GetExamSchedules($examId: Int!) {
    examSchedules(examId: $examId) {
        id
        exam { id }
        section { id name }
        subject { id name code }
        room { id roomNumber }
    }
}

# Incorrect — flat foreign key IDs (not available in schema)
query GetExamSchedules($examId: Int!) {
    examSchedules(examId: $examId) {
        id
        examId
        sectionId
        subjectId
        roomId
    }
}
```

## Anti-Patterns

- Using `useQuery` or `useMutation` hooks directly in page components. Wrap in feature hooks.
- Changing `fetchPolicy` to `cache-first` without measuring the impact on data freshness.
- Using string template interpolation for GraphQL variables (SQL injection equivalent).
- Catching errors in the API layer and returning `null` silently. Always throw or propagate.
- Hardcoding `http://127.0.0.1:8000` in feature code. Use `API_URL` or `SERVER_URL` from config.
- Creating duplicate GraphQL operation names across files.
- Using `fetch()` directly instead of the configured Apollo Client or Axios instance.

## Extension Strategy

### Adding a new GraphQL feature

1. Create `src/features/<name>/graphql/queries.ts` with `gql` tagged template literals.
2. Create `src/features/<name>/types.ts` with response interfaces.
3. Create `src/features/<name>/api.ts` wrapping `client.query()` / `client.mutate()`.
4. Create `src/features/<name>/hooks.ts` exposing data + loading + error + actions.
5. Run `npm run codegen` if you want generated types/hooks.
6. Update `codegen.ts` exclusion list if the feature's GraphQL doesn't match the schema yet.

### Updating the backend schema

1. Copy the latest schema to `schema.graphql` at project root.
2. Run `npm run codegen` to regenerate types.
3. Fix any type mismatches surfaced by TypeScript.
4. Update affected API layers and hooks.
