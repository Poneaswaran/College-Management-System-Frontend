---
name: styling
description: Styling system rules, Tailwind CSS usage, CSS custom properties, and theme integration conventions for the College Management System.
---

# Styling Skill

## Purpose

Define how all visual styling is authored, how the theme system works, and how design tokens flow from `theme.constants.ts` through CSS custom properties into Tailwind utility classes and component styles.

## When to Use

- Styling any component
- Adding new colors, shadows, or spacing values
- Creating new CSS component classes
- Working with dark/light mode
- Ensuring visual consistency

## Detected Setup

### Styling Stack

| Layer                | Technology                                    |
|----------------------|-----------------------------------------------|
| CSS Framework        | Tailwind CSS v4                               |
| CSS Variables        | Defined in `src/styles/index.css` (`:root`)   |
| Theme Constants      | `src/theme.constants.ts` (JS token objects)   |
| Theme Provider       | `src/theme.tsx` (React Context + CSS var sync) |
| Utility Classes      | `tw` object in `theme.constants.ts`           |
| Component Classes    | Custom classes in `src/styles/index.css`      |
| Font Loading         | Google Fonts via `index.html` (`DM Sans`, `Space Mono`) |

### Color System

The project uses a **three-tier color architecture**:

1. **Brand Colors** — Constant across themes
   - Primary: Electric Cyan (`#06b6d4`)
   - Secondary: Hot Pink (`#ec4899`)
   - Accent: Amber (`#fbbf24`)

2. **UI Colors** — Change between dark and light mode
   - Background, foreground, card, border variants
   - Dark mode is default

3. **Status Colors** — Constant across themes
   - Success: Emerald (`#10b981`)
   - Warning: Amber (`#fbbf24`)
   - Error: Red (`#ef4444`)
   - Info: Cyan (`#06b6d4`)

### Token → CSS Variable → Tailwind Flow

```
theme.constants.ts (JS objects)
        ↓
theme.tsx (ThemeProvider sets CSS variables on document.documentElement)
        ↓
:root { --color-primary: #06b6d4; ... } (index.css as fallback defaults)
        ↓
Tailwind classes: bg-[var(--color-primary)]
        or
Custom CSS classes: .btn-primary { background: var(--color-primary); }
```

## Rules

### 1. Always Use CSS Variables for Colors

Never hardcode color values in component JSX. Always reference CSS custom properties:

```tsx
// Correct
className="bg-[var(--color-primary)] text-[var(--color-foreground)]"

// Correct (using theme.constants.ts tw utilities)
className={tw.btn.primary}

// Correct (using CSS classes from index.css)
className="btn btn-primary"

// Incorrect — hardcoded color
className="bg-blue-500 text-white"
style={{ backgroundColor: '#06b6d4' }}
```

Exception: Tailwind semantic classes like `text-white`, `bg-black`, `bg-transparent` are acceptable when the color is truly absolute and not theme-dependent.

### 2. Theme-Aware Color Usage

When referencing theme colors in Tailwind:

```tsx
// Backgrounds
bg-[var(--color-background)]
bg-[var(--color-background-secondary)]
bg-[var(--color-background-tertiary)]
bg-[var(--color-card)]

// Text
text-[var(--color-foreground)]
text-[var(--color-foreground-secondary)]
text-[var(--color-foreground-muted)]

// Borders
border-[var(--color-border)]
hover:border-[var(--color-border-hover)]

// Brand
bg-[var(--color-primary)]
text-[var(--color-primary)]
bg-[var(--color-secondary)]
```

### 3. CSS Component Classes

The project defines reusable component classes in `src/styles/index.css`:

| Class          | Purpose                                |
|----------------|----------------------------------------|
| `.btn`         | Base button styles                     |
| `.btn-primary` | Primary button variant                 |
| `.btn-secondary` | Secondary button variant             |
| `.btn-outline` | Outline button variant                |
| `.btn-ghost`   | Ghost button variant                   |
| `.btn-sm/md/lg`| Button size modifiers                  |
| `.input`       | Base input field styles                |
| `.card`        | Base card container                    |
| `.card-hover`  | Card with hover effects                |
| `.badge`       | Base badge                             |
| `.badge-success/warning/error/info` | Status badges     |
| `.alert`       | Base alert container                   |
| `.alert-success/warning/error/info` | Status alerts     |
| `.skeleton-shimmer` | Loading shimmer animation         |
| `.kbd-key`     | Keyboard shortcut key cap              |

When adding new component classes, follow the existing pattern in `index.css`: base class + variant modifiers using CSS custom properties.

### 4. Typography

```
Font Family:
- Sans:    'DM Sans', system-ui, -apple-system, sans-serif  → var(--font-sans)
- Display: 'DM Sans', system-ui, -apple-system, sans-serif  → var(--font-display)  
- Mono:    'Space Mono', 'Courier New', monospace            → var(--font-mono)

Heading Defaults (from index.css):
- font-weight: 700
- letter-spacing: -0.02em
- line-height: 1.15
- color: var(--color-foreground)

Body Text:
- color: var(--color-foreground-secondary)
- line-height: 1.6
```

Use `font-mono` for labels, codes, identifiers. Use default sans for body and headings.

### 5. Shadows

Use CSS variable shadows, not Tailwind default shadows:

```tsx
// Correct
className="shadow-[var(--shadow-md)]"
// or use utility classes
className="shadow-theme-md"

// Neon effects (for emphasis)
className="shadow-[var(--shadow-neon)]"
```

Available shadow utilities: `.shadow-theme-sm`, `.shadow-theme-md`, `.shadow-theme-lg`, `.shadow-theme-xl`.

### 6. Border Radius

Use CSS variable radii:

```
var(--radius-sm)   → 0.375rem (6px)
var(--radius-md)   → 0.5rem   (8px)
var(--radius-lg)   → 0.75rem  (12px)
var(--radius-xl)   → 1rem     (16px)
var(--radius-2xl)  → 1.5rem   (24px)
var(--radius-full) → 9999px   (pill)
```

In practice, Tailwind `rounded-*` classes are used directly. This is acceptable because Tailwind's rounding values align with the design intent. Prefer `rounded-xl` or `rounded-2xl` for cards, `rounded-lg` for buttons and inputs, `rounded-full` for avatars and badges.

### 7. Spacing Philosophy

The project uses a deliberate spacing scale:

- `p-6` / `space-y-6` for page-level sections
- `p-4` / `gap-4` for card content and grid gaps
- `gap-2` / `space-y-2` for tight element grouping
- `mb-4` / `mt-6` for vertical rhythm between sections

Grid layouts use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for responsive stat cards.

### 8. Animation System

Animations are defined in `index.css` and optionally in `tailwind.config.js`:

| Class                  | Effect                   | Duration |
|------------------------|--------------------------|----------|
| `.animate-fade-in`     | Opacity 0 → 1           | 0.6s     |
| `.animate-slide-up`    | translateY + fade        | 0.6s     |
| `.animate-slide-in-left` | translateX(-30) + fade | 0.6s     |
| `.animate-slide-in-right`| translateX(30) + fade  | 0.6s     |
| `.animate-scale-in`    | scale(0.95) + fade       | 0.6s     |
| `.animate-pulse`       | Opacity pulse            | 2s loop  |
| `.animate-neon`        | Neon box-shadow pulse    | 2s loop  |
| `.animate-spin`        | Rotation                 | 1s loop  |
| `.toast-enter`         | Slide in from right      | 0.3s     |
| `.toast-exit`          | Slide out to right       | 0.3s     |

Stagger delays: `.delay-100` through `.delay-500` (100ms increments).

Use entrance animations on page load elements. Apply stagger delays to lists and grids.

### 9. Dark/Light Mode

- Dark mode is the default theme.
- The `ThemeProvider` manages mode (`'light' | 'dark' | 'system'`).
- Mode is persisted to `localStorage` under key `theme-mode`.
- When mode changes, CSS variables on `:root` are updated and `dark` class is toggled on `<html>`.
- The `.light` class in `index.css` overrides UI color variables.

Access theme state:
```tsx
const { theme, mode, setMode, isDark } = useTheme();
```

### 10. Gradient Usage

Predefined gradients in `theme.constants.ts`:

```
primary:   Cyan → Pink (135deg)
secondary: Pink → Purple (135deg)
accent:    Warm amber (135deg)
hero:      Cyan → Purple (135deg)
dark:      Deep charcoal (135deg)
neon:      Bright cyan → pink (135deg)
```

Use inline styles for gradients since Tailwind arbitrary values for complex gradients are unwieldy:

```tsx
style={{ background: theme.gradients.primary }}
```

Or use Tailwind gradient utilities for simple cases:
```tsx
className="bg-gradient-to-r from-cyan-500 to-pink-500"
```

## Anti-Patterns

- Using Tailwind default color classes (`bg-blue-500`) instead of CSS variable references for theme colors.
- Hardcoding hex colors in `className` or `style` props.
- Adding shadows via Tailwind defaults (`shadow-lg`) instead of theme shadows.
- Creating new CSS variables without adding them to both `index.css` `:root` and `theme.constants.ts`.
- Using `!important` in custom CSS.
- Overriding global element styles outside of `index.css`.
- Creating component-scoped CSS files. All custom CSS goes in `index.css`.
- Using CSS modules or styled-components. This project uses Tailwind + CSS custom properties exclusively.

## Extension Strategy

### Adding a new color token

1. Add the color to `theme.constants.ts` in the appropriate section.
2. Add a corresponding CSS variable in `index.css` `:root`.
3. If the color changes between themes, add overrides in both `darkThemeOverrides` and `lightThemeOverrides` in `theme.constants.ts`, and in the `.light` class in `index.css`.
4. If needed in the `ThemeProvider`, update the CSS variable assignment in `theme.tsx`.

### Adding a new CSS component class

1. Define the base class and variants in `index.css` under the "COMPONENT CLASSES" section.
2. Use CSS custom properties for all colors.
3. Optionally add a corresponding entry in the `tw` utility object in `theme.constants.ts`.
4. Document the class in this skill file.

### Adding a new animation

1. Define the `@keyframes` in `index.css`.
2. Create a utility class (`.animate-<name>`) in `index.css`.
3. Optionally add it to `tailwind.config.js` under `animation` and `keyframes` for Tailwind usage.
