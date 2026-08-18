---
name: Cosmonexus Design System
description: Design token architecture, component patterns, and styling conventions for @cosmonexus/design-tokens and nova-ui packages
tags: [design-system, vanilla-extract, tokens, components, oklch]
inclusion: manual
---

## When to Apply

- Creating or modifying components in nova-ui or nova-ui-solid
- Extending or modifying the design-tokens package
- Adding new themes
- Reviewing component accessibility
- Building new UI patterns in the playground

## Token Contract Reference

Source: `packages/design-tokens/src/contract.css.ts`

### Colors
| Slot | Purpose |
|------|---------|
| `tokens.color.surface0–4` | Background layers (dark → light) |
| `tokens.color.text1–3` | Text hierarchy (high → low contrast) |
| `tokens.color.accent1–3` | Interactive accent (primary/hover/active) |
| `tokens.color.accentBg` | Subtle accent background (8% opacity) |
| `tokens.color.success/Bg` | Positive status |
| `tokens.color.error/Bg/Border` | Error status |
| `tokens.color.warning/Bg/Border` | Warning status |

### Typography
| Slot | Values |
|------|--------|
| `tokens.font.sans` | IBM Plex Sans stack |
| `tokens.font.mono` | IBM Plex Mono stack |
| `tokens.fontSize.xs–xxl` | 0.75rem–1.75rem |
| `tokens.fontWeight.medium/semibold/bold` | 500/600/700 |
| `tokens.lineHeight.tight/normal` | 1.25/1.5 |

### Spacing
`tokens.space[1]` (0.25rem) through `tokens.space[10]` (2.5rem), plus `space[8]` (2rem)

### Radius
`tokens.radius.sm` (4px), `.md` (6px), `.lg` (8px), `.full` (9999px)

### Effects
| Slot | Value |
|------|-------|
| `tokens.shadow.md` | 0 4px 12px oklch(0 0 0 / 0.4) |
| `tokens.shadow.glow` | 0 0 20px oklch(0.78 0.15 175 / 0.15) |
| `tokens.focusRing` | 2px surface1 ring + 4px accent1 ring |
| `tokens.borderSubtle` | 1px solid surface4 |

### Motion
| Slot | Value |
|------|-------|
| `tokens.transition.fast/normal/slow` | 120ms/200ms/350ms |
| `tokens.easing.out` | cubic-bezier(0.16, 1, 0.3, 1) |
| `tokens.easing.inOut` | cubic-bezier(0.45, 0, 0.55, 1) |

## Dark Theme Values

Source: `packages/design-tokens/src/themes/dark.css.ts`

- Surfaces: OKLCH hue 240, lightness 0.13→0.33, chroma 0.02
- Text: OKLCH hue 240, lightness 0.96→0.55
- Accent: OKLCH hue 175, lightness 0.70→0.85, chroma 0.13→0.16
- Semantic hues: success=160, error=18, warning=75

## Component Inventory

Both nova-ui (React) and nova-ui-solid (Solid) provide:

| Component | Styling | Variants |
|-----------|---------|----------|
| Button | recipe | primary/secondary × default/small + loading + fullWidth |
| Input | style | label + error state |
| Alert | recipe | success/error/warning |
| StatusChip | recipe | created/accessed/modified/deleted |
| Pagination | style | interactive page numbers + ellipsis |
| Card | style | container with optional title |
| DataTable | style + keyframes | loading/empty/populated + row click |
| Skeleton | style + keyframes | text/row variants |

## Patterns

### Recipe Pattern (variants)
```typescript
import { tokens } from '@cosmonexus/design-tokens/contract'
import { recipe } from '@vanilla-extract/recipes'

export const buttonRecipe = recipe({
  base: { /* shared styles using tokens.* */ },
  variants: {
    variant: { primary: { ... }, secondary: { ... } },
    size: { default: { ... }, small: { ... } },
  },
  defaultVariants: { variant: 'primary', size: 'default' },
})
```

### Style Pattern (no variants)
```typescript
import { tokens } from '@cosmonexus/design-tokens/contract'
import { style } from '@vanilla-extract/css'

export const card = style({
  background: tokens.color.surface2,
  border: tokens.borderSubtle,
  borderRadius: tokens.radius.lg,
  padding: tokens.space[6],
})
```

## Pitfalls

- Never import from `@cosmonexus/design-tokens` in .css.ts files — use `/contract` sub-path
- Theme class must be on `<html>` (not `#root`) for global body styles to inherit
- `tsup` needs peer deps externalized or DTS generation fails
- Vite playground needs resolve aliases pointing to source `.css.ts` files for vanilla-extract to process them
- Don't use `style={{ }}` for things that should be in .css.ts — inline styles bypass the design system

## References

- `packages/design-tokens/src/contract.css.ts` — token contract (source of truth)
- `packages/design-tokens/src/themes/dark.css.ts` — dark theme values
- `packages/nova-ui/src/Button/Button.css.ts` — recipe pattern example
- `packages/nova-ui/src/Card/Card.css.ts` — style pattern example
- `apps/playground/src/App.tsx` — all components rendered
- `~/skills/design-system/SKILL.md` — general design system theory
- `~/skills/design-system/references/color-theory.md` — OKLCH deep dive
- `~/skills/design-system/references/accessibility.md` — WCAG contracts
