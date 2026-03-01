---
name: non-generic-design
description: Strict design quality enforcement rules to prevent generic, template-like, AI-generated UI output. Enforces intentional, production-grade, information-dense design.
---

# Non-Generic Design Skill

## Purpose

Prevent all generated UI from looking like generic dashboard templates, AI-generated starter kits, or Dribbble concept art. Enforce design decisions that are intentional, information-dense, and specific to the College Management System domain.

## When to Use

- Building any new page or component
- Reviewing visual output of generated code
- Designing layouts, cards, forms, or data displays
- Choosing colors, spacing, or typography
- Creating empty, loading, or error states

## Project Design Identity

### Neo-Academic Brutalism

This project uses a design language called "Neo-Academic Brutalism" — a dark, high-contrast system with:

- Deep charcoal backgrounds (`#0a0a0a`, `#141414`, `#1a1a1a`)
- Electric Cyan primary (`#06b6d4`) — used for interactive elements, links, focus states
- Hot Pink secondary (`#ec4899`) — used for accent highlights, secondary CTAs
- Amber accent (`#fbbf24`) — used for warnings, badges, highlight callouts
- Zinc neutrals for text hierarchy (`#ffffff` → `#a1a1aa` → `#71717a`)
- DM Sans typeface — geometric, modern, slightly condensed
- Space Mono for codes, identifiers, labels
- Bold typographic weight (700 default for headings)
- Tight letter spacing on headings (`-0.02em`)
- High-contrast borders (`#27272a` on `#0a0a0a` backgrounds)

This is not a generic dark theme. It is a deliberate aesthetic choice. Respect it.

## Rules

### 1. Prohibited Patterns

Do not generate any of the following:

| Pattern                          | Why It Fails                                      |
|----------------------------------|---------------------------------------------------|
| Hero section + 3 feature cards + CTA | Generic landing page template                 |
| Pastel gradient backgrounds      | Conflicts with the dark brutalist identity        |
| Card grids with identical structure | Lazy layout, no information hierarchy          |
| Generic placeholder text         | "Lorem ipsum" or "Your description here"          |
| Decorative illustrations without function | Visual noise that adds no information    |
| Oversized rounded corners (>1.5rem on small elements) | Conflicts with the angular identity |
| Random drop shadows on all elements | Shadows are used deliberately in this project  |
| Glassmorphism everywhere         | One neon glow effect is enough per page           |
| Motivational microcopy           | "Welcome to the future of education" — meaningless |
| Fake statistics                  | "10K+" students is acceptable on login only       |
| Empty dashboard cards            | Cards must contain real or realistic data          |

### 2. Information Hierarchy

Every page must have a clear visual hierarchy:

```
Level 1: Page title — text-3xl or text-4xl, font-black, var(--color-foreground)
Level 2: Section headings — text-xl or text-2xl, font-bold
Level 3: Card titles — text-lg, font-semibold
Level 4: Labels — text-sm, font-medium, uppercase, tracking-wide
Level 5: Body text — text-base, var(--color-foreground-secondary)
Level 6: Captions — text-xs, var(--color-foreground-muted)
```

Do not use the same text size for elements at different hierarchy levels.

### 3. Spacing System

Spacing is not random. Follow the established rhythm:

```
Page padding:       p-6 (24px)
Section gap:        space-y-6 (24px)
Card padding:       p-6 (24px)
Card internal gap:  space-y-4 (16px) or space-y-3 (12px)
Grid gap:           gap-4 (16px) or gap-6 (24px)
Form field gap:     space-y-5 (20px)
Label to input:     mb-2 (8px)
Button padding:     py-3 px-6 (12px × 24px)
```

Do not use arbitrary padding values like `p-7` or `p-11`. Stick to the scale.

### 4. Color Usage Rules

| Element Type          | Color Source                      |
|-----------------------|-----------------------------------|
| Primary actions       | `var(--color-primary)` (cyan)     |
| Destructive actions   | `var(--color-error)` (red)        |
| Secondary actions     | `var(--color-secondary)` (pink) or outline variant |
| Success feedback      | `var(--color-success)` (emerald)  |
| Warning feedback      | `var(--color-warning)` (amber)    |
| Page backgrounds      | `var(--color-background)` family  |
| Card backgrounds      | `var(--color-card)`               |
| Text                  | `var(--color-foreground)` family  |
| Borders               | `var(--color-border)` family      |
| Interactive affordance| Cyan for links, focus rings       |

Do not introduce new brand colors. The palette is fixed.

### 5. State Design (Mandatory)

Every data-fetching component must handle exactly four states:

**Loading State**
- Use the appropriate `Skeleton*` component.
- Skeleton should match the layout of the loaded state.
- Entrance animation: `.animate-fade-in`.

**Empty State**
- Centered layout with an appropriate Lucide icon (muted, 48-64px).
- Primary heading: "No [entity] found" or similar.
- Secondary text explaining why or suggesting action.
- Optional CTA button if the user can create the missing entity.
- Use `var(--color-foreground-muted)` for the icon and secondary text.

**Error State**
- Left-bordered alert with red accent (matching `.alert-error` pattern).
- Error message from `getErrorMessage()` or `parseGraphQLError()`.
- "Retry" button if the operation is repeatable.
- Do not expose raw error objects to users.

**Success/Loaded State**
- Render data with appropriate layout.
- Entrance animations for first paint.
- Stagger delays for list items.

### 6. Dashboard Design

Dashboards in this project follow a specific structure:

```
┌─────────────────────────────────────────────┐
│ Page Header (title + action buttons)         │
├─────────────────────────────────────────────┤
│ Stat Cards (grid-cols-1 sm:2 lg:4)          │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│ │Icon │ │Icon │ │Icon │ │Icon │           │
│ │Value│ │Value│ │Value│ │Value│           │
│ │Label│ │Label│ │Label│ │Label│           │
│ └─────┘ └─────┘ └─────┘ └─────┘           │
├─────────────────────────────────────────────┤
│ Charts / Activity Feed (2-column grid)       │
├─────────────────────────────────────────────┤
│ Data Table or List                           │
└─────────────────────────────────────────────┘
```

Stat cards must:
- Show a numeric value (not placeholder).
- Include a supporting label that provides context.
- Use a relevant icon from lucide-react.
- Have a subtle color accent matching the metric's domain.
- Use `AnimatedCounter` for numeric values when available.

### 7. Form Design

Forms follow the Login page pattern:

- Labels: `text-sm font-bold uppercase tracking-wide`
- Inputs: `h-14` height, `rounded-xl`, icon on the left (`pl-12`), clear focus states
- Validation: Inline error messages below the field (`text-sm text-[var(--color-error)]`)
- Submit button: Full width, gradient background, uppercase, includes loading spinner state
- Group related fields with grid layouts (`grid-cols-1 md:grid-cols-2 gap-6`)

### 8. Table Design

Data tables use:
- Card container with border (`bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl`)
- Header row with bold text and top border
- Alternating row backgrounds are not used — rely on border separation
- Row hover: `hover:bg-[var(--color-card-hover)]`
- Pagination below the table
- Sort indicators in column headers
- Use `@tanstack/react-table` for complex tables

### 9. Animation Application

Entrance animations are applied intentionally, not everywhere:

| Element          | Animation                | Delay    |
|------------------|--------------------------|----------|
| Page title       | `.animate-slide-in-left` | none     |
| Stat cards       | `.animate-scale-in`      | stagger  |
| Content sections | `.animate-slide-up`      | 100-200ms|
| Data tables      | `.animate-fade-in`       | 200ms    |
| Modals           | `.animate-scale-in`      | none     |
| Toast            | `.toast-enter`           | none     |

Do not animate every element. Reserve animation for initial page load and state transitions. Interactive elements use CSS transitions (`transition-all duration-300`), not keyframe animations.

### 10. Real Content

When building new pages:
- Use domain-appropriate labels. "Section A" not "Item 1".
- Use realistic numeric ranges. Attendance is 0-100%, grades are A-F or 0-100.
- Use academic terminology. "Semester" not "Period", "Register Number" not "User ID".
- Use the university name from theme: `theme.university.name` ("Vels University").
- Date formats: `toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })`.

## Anti-Patterns

- Using Tailwind's default color palette (`blue-500`, `green-400`) for theme elements.
- Creating a "welcome" or "getting started" page that looks like a documentation landing page.
- Centering everything on the page for no structural reason.
- Using `max-w-sm` or `max-w-md` for full-page content (too narrow for data-dense pages).
- Adding decorative borders or dividers that do not separate meaningful sections.
- Using emoji as decorative elements.
- Creating cards with only a title and no content.
- Showing raw JSON/GraphQL errors to users.
- Using `alert()` or `confirm()` for user notifications instead of the Toast system.
- Excessive whitespace between elements that belong together conceptually.
- Icon-only buttons without `aria-label`.

## Extension Strategy

When designing a new page:

1. Define the information the user needs from this page. List it.
2. Rank items by importance. Design the hierarchy around this ranking.
3. Choose layout (single column, two-column, card grid) based on information density.
4. Select the correct Skeleton variant for loading state.
5. Design the empty state with domain-specific language.
6. Design the error state using the project's error handling utilities.
7. Apply entrance animations only to the top-level sections.
8. Verify color usage against the theme palette — no off-palette colors.
9. Check spacing against the established rhythm.
10. Verify all text sizes follow the hierarchy levels defined above.
