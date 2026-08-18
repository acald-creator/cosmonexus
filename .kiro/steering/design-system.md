---
inclusion: fileMatch
fileMatchPattern: "packages/design-tokens/**,packages/nova-ui/**,packages/nova-ui-solid/**,apps/playground/**"
---

# Design System Steering

When working on design token, UI component, or playground files, follow these conventions.

## Token Architecture

Three-layer system:
1. **Open Props** — raw primitive CSS custom properties (imported globally)
2. **Theme Contract** (`tokens`) — semantic slots via `createThemeContract` in `packages/design-tokens/src/contract.css.ts`
3. **Theme Implementation** (e.g. `darkTheme`) — maps contract slots to concrete OKLCH values

Components ONLY reference the contract, never raw values or theme implementations directly.

## Import Patterns

```typescript
// In .css.ts files (vanilla-extract styles):
import { tokens } from '@cosmonexus/design-tokens/contract'

// In app entry points:
import { darkTheme } from '@cosmonexus/design-tokens/themes/dark'
import '@cosmonexus/design-tokens/global'
```

## Component Conventions

1. **One component per directory** — `ComponentName/ComponentName.tsx` + `ComponentName.css.ts`
2. **Recipes for variants** — use `recipe()` from `@vanilla-extract/recipes` for multi-variant components (Button, Alert, StatusChip)
3. **Styles for single-variant** — use `style()` from `@vanilla-extract/css` for simple components (Card, Skeleton)
4. **Export props type** — every component exports both the component and its props interface
5. **Token-only values** — never use raw px/rem/colors in `.css.ts` files, always reference `tokens.*`
6. **Focus visible** — all interactive elements get `boxShadow: tokens.focusRing` on `:focus-visible`
7. **Transitions** — use `tokens.transition.fast` + `tokens.easing.out` for micro-interactions

## React Components (nova-ui)

- Use `React.forwardRef` for components that wrap native elements
- Use `useId()` for generated IDs (label/input association)
- Props extend native HTML attributes where appropriate
- Discriminated props for variants (not string unions where avoidable)

## Solid Components (nova-ui-solid)

- Use `splitProps` to separate custom props from native HTML attributes
- Use `Accessor<T>` for reactive props (currentPage, totalPages, loading, data)
- Use `Show` and `For` from solid-js for conditional/list rendering
- Use `createUniqueId()` for generated IDs

## Accessibility Requirements

- WCAG 2.2 AA contrast (4.5:1 text, 3:1 UI)
- ARIA roles on dynamic widgets (Alert: role="alert"/"status", DataTable rows: role="button")
- Keyboard operable: Enter/Space on clickable rows, focus management
- `aria-invalid` + `aria-describedby` on error inputs
- `aria-current="page"` on active pagination buttons

## Adding a New Component

1. Create `packages/nova-ui/src/<Name>/<Name>.tsx` + `<Name>.css.ts`
2. Create matching `packages/nova-ui-solid/src/<Name>/<Name>.tsx` + `<Name>.css.ts`
3. Export from both packages' `index.ts`
4. Add to playground `apps/playground/src/App.tsx`
5. Ensure TypeScript passes: `tsc --noEmit` in both packages

## Color System

- All colors use OKLCH for perceptual uniformity
- Surfaces: hue 240 (cool blue-gray), lightness 0.13–0.33
- Accent: hue 175 (teal/cyan), lightness 0.70–0.85
- Semantic: success (hue 160), error (hue 18), warning (hue 75)
- Background opacity variants: 8% for subtle bg, 10% for status bg, 30% for borders

## Deep Reference

For broader design system theory, color science, and accessibility contracts:
- `~/skills/design-system/SKILL.md` — comprehensive design system skill
- `~/skills/design-system/references/` — topic-specific deep dives
