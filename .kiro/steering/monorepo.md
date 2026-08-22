---
inclusion: auto
---

# Monorepo Steering

## Tooling

- **Runtime/Package Manager:** Bun (workspaces)
- **Task Runner:** Moon 2 (`moon run :build`, `moon run :test`, etc.). Config is `.moon/toolchains.yml` and `layer` in each `moon.yml`. Workspace edges must be listed in `dependsOn` because the bun toolchain is not enabled (needs proto >= 0.60).
- **Bundler:** tsup (ESM + CJS + DTS per package)
- **Linting/Formatting:** Biome (single config at root `biome.json`)
- **Type Checking:** TypeScript strict mode (shared configs in `packages/tsconfig/`)
- **Testing:** Vitest (`vitest.workspace.ts` at root)

## Package Structure

Every library package follows this structure:
```
packages/<name>/
├── src/index.ts          # barrel export
├── package.json          # scoped @cosmonexus/<name>, type: module, exports map
├── tsconfig.json         # extends @cosmonexus/tsconfig/library.json
├── tsup.config.ts        # ESM + CJS + DTS, externalize peers
├── moon.yml              # build/test/lint/typecheck tasks
└── vitest.config.ts      # per-package test config
```

## Key Rules

1. **Workspace protocol** — use `"workspace:*"` for inter-package deps
2. **Peer dependencies** — framework deps (react, solid-js, rxjs, @vanilla-extract/css) are peer deps
3. **External in tsup** — always externalize peer deps in tsup.config.ts
4. **No circular deps** — the dependency graph is strictly layered (nova-types → nova-store → nova-react → nova-ui)
5. **Biome formatting** — tabs, single quotes, trailing commas, no semicolons, 100 char width
6. **Strict TypeScript** — no `any`, strict: true, verbatimModuleSyntax: true
7. **Named exports only** — no default exports (better tree-shaking and refactoring)

## Dependency Graph

```
nova-types (leaf)
    ↓
nova-store (depends on nova-types)
    ↓
nova-react (depends on nova-store + nova-types)
    ↓
nova-ui (depends on design-tokens + nova-react)

design-tokens (leaf)
    ↓
nova-ui-solid (depends on design-tokens)

cm (leaf) → stellate (depends on cm)
```

## Commands

```bash
bun install          # install all workspace deps
bun run build        # build all packages (topological via Moon)
bun run lint         # biome check .
bun run format       # biome format --write .
bun run typecheck    # tsc --noEmit per package via Moon
bun run test         # vitest via Moon
```

## Adding a New Package

1. Create `packages/<name>/` with the standard structure above
2. Add `moon.yml` with build/test/lint/typecheck tasks
3. Add `@cosmonexus/tsconfig: workspace:*` as devDependency
4. Run `bun install` to register in workspace
5. Verify with `bun run build` and `bun run lint`
