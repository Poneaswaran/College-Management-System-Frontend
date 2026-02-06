Folder Structure
src/
│
├── app/                # App-level setup
│   ├── App.tsx
│   ├── main.tsx
│   ├── router.tsx      # React Router config
│   └── providers.tsx   # Context providers (auth, theme, query)
│
├── pages/              # Route-level pages
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   └── not-found/
│       └── NotFound.tsx
│
├── components/         # Reusable UI components
│   ├── ui/              # Buttons, Inputs, Modals
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── layout/          # Navbar, Sidebar, Footer
│       └── Navbar.tsx
│
├── features/           # Feature-based logic (IMPORTANT)
│   ├── auth/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── slice.ts
│   └── students/
│       ├── api.ts
│       ├── hooks.ts
│       ├── types.ts
│       └── components/
│
├── services/           # External services
│   ├── api.ts           # Axios instance
│   └── auth.service.ts
│
├── hooks/              # Global reusable hooks
│   └── useDebounce.ts
│
├── store/              # State management
│   ├── index.ts
│   └── auth.store.ts
│
├── lib/                # Utilities & helpers
│   ├── axios.ts
│   ├── constants.ts
│   └── helpers.ts
│
├── types/              # Global TypeScript types
│   └── index.d.ts
│
├── assets/             # Images, fonts, icons
│
├── styles/             # Global styles
│   └── index.css
│
└── env.d.ts
