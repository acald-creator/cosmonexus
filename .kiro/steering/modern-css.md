---
inclusion: fileMatch
fileMatchPattern: "**/*.css.ts,**/*.css"
---

# Modern CSS Steering

When writing styles (vanilla-extract `.css.ts` files or any CSS), follow current CSS best practices. Avoid legacy patterns.

## Modern Patterns (Use These)

### Colors
- **OKLCH** for all color values — perceptually uniform, wide gamut
- **CSS relative colors** for derived values: `oklch(from var(--base) calc(l + 0.1) c h)`
- **Alpha via OKLCH syntax**: `oklch(0.78 0.15 175 / 0.08)` not `rgba()` or `hsla()`

### Layout
- **Container queries** (`container-type: inline-size` + `@container`) for component-level responsiveness
- **CSS Grid** with `subgrid` for aligned nested grids
- **Logical properties**: `margin-inline`, `padding-block`, `inset-inline-start` instead of physical directions
- **`dvh`/`svh`/`lvh`** for viewport height (not plain `vh` which fails on mobile)
- **`gap`** on flex/grid instead of margin hacks

### Typography
- **`clamp()`** for fluid type: `font-size: clamp(1rem, 0.5rem + 1.5vw, 1.5rem)`
- **`text-wrap: balance`** for headings
- **`text-wrap: pretty`** for body text (prevents orphans)

### Spacing & Sizing
- **`round()`**, **`mod()`** for calculated spacing alignment
- **Fluid spacing** via `clamp()` rather than fixed breakpoint jumps
- **`min()`/`max()`/`clamp()`** for intrinsic sizing

### Selectors & State
- **`:focus-visible`** (not `:focus`) for keyboard-only focus rings
- **`:has()`** for parent-based conditional styling
- **`@starting-style`** for entry animations
- **`prefers-reduced-motion`** and `prefers-color-scheme` media queries

### Transitions & Animation
- **`transition-behavior: allow-discrete`** for animating `display` changes
- **View Transitions API** for page/route transitions
- **`@starting-style`** for element entry animations without JS

### Layers
- **`@layer`** for managing specificity: `@layer reset, tokens, components, utilities`

## Legacy Patterns (Avoid)

| Legacy | Modern Replacement |
|--------|-------------------|
| `rgba(r, g, b, a)` | `oklch(L C H / alpha)` |
| `hsl(h, s%, l%)` | `oklch(L C H)` |
| `margin-left/right` | `margin-inline-start/end` |
| `padding-top/bottom` | `padding-block-start/end` |
| `width/height: 100vh` | `min-height: 100dvh` |
| `:focus { outline }` | `:focus-visible { outline }` |
| `@media (max-width)` | `@container (min-width)` for components |
| `calc(100% - 2rem)` | `calc()` is fine, but prefer `clamp()` for responsiveness |
| `-webkit-*` prefixes | Drop unless targeting Safari <16 |
| `float` for layout | CSS Grid / Flexbox |
| `z-index` wars | `@layer` or `isolation: isolate` for stacking contexts |

## In vanilla-extract Context

vanilla-extract supports all modern CSS via its style objects. Key patterns:

```typescript
import { style, globalStyle } from '@vanilla-extract/css'

// Container queries
const wrapper = style({
  containerType: 'inline-size',
})

// @container in vanilla-extract uses string selectors:
globalStyle(`${wrapper} > .child`, {
  '@container': {
    '(min-width: 400px)': { flexDirection: 'row' },
  },
})

// Logical properties
const box = style({
  paddingInline: tokens.space[4],
  paddingBlock: tokens.space[2],
  marginInlineStart: 'auto',
})

// Focus-visible (already enforced)
const interactive = style({
  ':focus-visible': {
    outline: 'none',
    boxShadow: tokens.focusRing,
  },
})
```

## When Reviewing Existing Code

If you see any legacy patterns in `.css.ts` files, flag them and suggest the modern replacement. The cosmonexus design system should be forward-looking — no HSL fallbacks needed since we target modern browsers only (ES2022+ target matches this).

## Deep References

For detailed guidance on specific topics:
- `~/skills/design-system/references/color-theory.md` — OKLCH science, harmony models, palette engineering
- `~/skills/design-system/references/responsive-layout.md` — container queries, fluid spacing, grid
- `~/skills/design-system/references/typography.md` — fluid type, clamp(), vertical rhythm
- `~/skills/design-system/references/styling-engines.md` — vanilla-extract patterns, recipes, sprinkles
- `~/skills/design-system/references/accessibility.md` — focus management, contrast, ARIA
