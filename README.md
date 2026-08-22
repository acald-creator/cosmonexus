# cosmonexus

Monorepo for `@cosmonexus` packages — design tokens, reactive primitives, dual-framework UI components (React + Solid), and an editor framework.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@cosmonexus/design-tokens`](./packages/design-tokens) | vanilla-extract theme contract + OKLCH dark theme + CSS reset | 0.0.1 |
| [`@cosmonexus/nova-types`](./packages/nova-types) | TypeScript types for reactive primitives (Signal, Subscriber, Observable) | 0.0.1 |
| [`@cosmonexus/nova-store`](./packages/nova-store) | Fine-grained reactive signals + RxJS-based Store | 0.0.1 |
| [`@cosmonexus/nova-react`](./packages/nova-react) | React hooks and providers for nova-store | 0.0.1 |
| [`@cosmonexus/nova-ui`](./packages/nova-ui) | React component library (Button, Input, DataTable, etc.) | 0.0.1 |
| [`@cosmonexus/nova-ui-solid`](./packages/nova-ui-solid) | Solid.js component library (same API as nova-ui) | 0.0.1 |
| [`@cosmonexus/nova-emotion`](./packages/nova-emotion) | Emotion adapter (`css` / `cx` / `var(--cnx-*)` theme) | 0.1.0 |
| [`@cosmonexus/cm`](./packages/cm) | CodeMirror 6 wrappers with sub-path exports | 0.0.1 |
| [`@cosmonexus/stellate`](./packages/stellate) | Editor extension framework (Editor, Extension, EventEmitter) | 0.0.1 |
| [`@cosmonexus/tsconfig`](./packages/tsconfig) | Shared TypeScript configs (base, library, app) | 0.0.1 |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Apps (docs, playground)                            │
├──────────────────────┬──────────────────────────────┤
│  nova-ui (React)     │  nova-ui-solid (Solid)       │
│                      │  nova-emotion (Emotion)      │
├──────────────────────┴──────────────────────────────┤
│  design-tokens (vanilla-extract + Open Props)       │
├─────────────────────────────────────────────────────┤
│  nova-react          │  cm + stellate (Editor)      │
├──────────────────────┤                              │
│  nova-store          │                              │
├──────────────────────┤                              │
│  nova-types          │                              │
└──────────────────────┴──────────────────────────────┘
```

## Tooling

| Tool | Purpose |
|------|---------|
| [Bun](https://bun.sh) | Runtime + package manager + workspace management |
| [Moon](https://moonrepo.dev) | Task runner with dependency graph, caching, CI optimization |
| [tsup](https://tsup.egoist.dev) | Bundler producing ESM + CJS + DTS |
| [Biome](https://biomejs.dev) | Linting + formatting (replaces ESLint + Prettier) |
| [Vitest](https://vitest.dev) | Test runner |
| [TypeScript](https://www.typescriptlang.org) | Type checking (strict mode) |

## Getting Started

```bash
# Install dependencies
bun install

# Build all packages (topological order)
bun run build

# Lint and format
bun run lint
bun run format

# Type check all packages
bun run typecheck

# Run tests
bun run test
```

## Package Dependency Graph

```
nova-types ─────────────────────────────┐
    │                                   │
nova-store ──────────── nova-react      │
                            │           │
design-tokens ──────── nova-ui ─────────┘
    │                                   
    ├──────────── nova-ui-solid
    └──────────── nova-emotion

cm ────── stellate
```

## Design System

The design token layer (`@cosmonexus/design-tokens`) provides:

- **Theme contract** — semantic token slots for colors, fonts, spacing, radii, shadows, transitions
- **Dark theme** — OKLCH color values with teal/cyan accent (hue 175)
- **Global reset** — CSS reset + base typography referencing the contract

`nova-ui` (React), `nova-ui-solid` (Solid), and `nova-emotion` (Emotion / ReScript) consume the same token contract. Emotion reads the public `--cnx-*` CSS variables; it does not depend on vanilla-extract.

### Token Categories

| Category | Tokens |
|----------|--------|
| Surfaces | surface0–surface4 (dark → light) |
| Text | text1–text3 (high → low contrast) |
| Accent | accent1–accent3, accentBg |
| Semantic | success, error, warning (+Bg, +Border) |
| Typography | font (sans, mono), fontSize (xs–xxl), fontWeight, lineHeight |
| Spacing | space 1–10 (0.25rem–2.5rem) |
| Radius | sm, md, lg, full |
| Shadows | md, glow |
| Motion | transition (fast, normal, slow), easing (out, inOut) |

## UI Components

Both `nova-ui` and `nova-ui-solid` provide these components with identical APIs:

| Component | Description |
|-----------|-------------|
| `Button` | primary/secondary variants, sizes, loading state |
| `Input` | Label, error state, forwarded HTML attributes |
| `Alert` | success/error/warning feedback messages |
| `StatusChip` | Semantic status pills (created, accessed, modified, deleted) |
| `Pagination` | Page navigation with ellipsis |
| `Card` | Surface container with optional title |
| `DataTable` | Typed columns, loading skeleton, empty state, row click |
| `Skeleton` | Shimmer loading placeholder |

## Editor Framework

- **`@cosmonexus/cm`** — Re-exports CodeMirror 6 modules via sub-path imports (`/core`, `/state`, `/view`, `/language`, `/lint`, `/langpack`)
- **`@cosmonexus/stellate`** — Extension framework with `Editor`, `Extension`, `ExtensionManager`, and `EventEmitter` classes

## Contributing

1. Create a branch from `main`
2. Make changes in the relevant package under `packages/`
3. Run `bun run lint` and `bun run typecheck`
4. Open a PR

## License

MIT
