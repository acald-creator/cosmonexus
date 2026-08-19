# Implementation Plan: Design Token Integration

## Overview

Replace hardcoded OKLCH values in the `@cosmonexus/design-tokens` package with a generated token pipeline using the `design-token-toolkit` CLI and Style Dictionary v4. The pipeline reads a single brand color, generates a full OKLCH palette, combines it with Open Props primitives, and produces both CSS custom properties and vanilla-extract contracts from DTCG JSON source files.

## Tasks

- [x] 1. Set up project structure, dependencies, and brand color configuration
  - [x] 1.1 Create directory structure and add dependencies
    - Create `tokens/primitives/`, `tokens/semantic/`, `tokens/component/`, `scripts/`, and `sd-formats/` directories within `packages/design-tokens/`
    - Add `style-dictionary@4` and `@types/bun` as devDependencies to `packages/design-tokens/package.json`
    - Add `tokens:generate` script to `package.json`
    - _Requirements: 1.1, 1.2, 8.2_

  - [x] 1.2 Create `brand-color.json` configuration file
    - Create `packages/design-tokens/brand-color.json` with the brand hex color (`#8B5CF6`), hue (295), and description
    - _Requirements: 8.4_

- [x] 2. Implement DTCG primitive token files
  - [x] 2.1 Create the color generation script (`scripts/generate-colors.ts`)
    - Implement Bun script that invokes the toolkit CLI at `../../design-token-toolkit` as a subprocess
    - Pass brand color with `--format w3c --namespace primitives.color` flags
    - Write output to `tokens/primitives/colors.json`
    - Log generated primitive count for verification
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

  - [x] 2.2 Create the Open Props mapping script (`scripts/open-props-to-dtcg.ts`)
    - Read Open Props CSS custom properties from the `open-props` npm package
    - Map `--size-*` variables to `primitives.space.*` with `$type: "dimension"`
    - Map `--radius-*` variables to `primitives.radius.*` with `$type: "dimension"`
    - Map `--ease-*` variables to `primitives.easing.*` with `$type: "cubicBezier"`
    - Map `--shadow-*` variables to `primitives.shadow.*` with `$type: "shadow"`
    - Write output files: `tokens/primitives/spacing.json`, `radii.json`, `easing.json`, `shadows.json`
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 2.3 Create typography primitives file (`tokens/primitives/typography.json`)
    - Define font families (IBM Plex Sans, IBM Plex Mono) with `$type: "fontFamily"`
    - Define font size scale (xs through xxl) with `$type: "dimension"`
    - Define font weights (medium, semibold, bold) with `$type: "number"`
    - Define line heights (tight, normal) with `$type: "number"`
    - _Requirements: 7.5, 1.4_

- [x] 3. Implement semantic token layer
  - [x] 3.1 Create semantic color token files
    - Create `tokens/semantic/colors-base.json` with shared semantic color aliases (accent1, accent2, accent3, success, error, warning) referencing primitives via DTCG alias syntax
    - Create `tokens/semantic/colors-dark.json` with dark theme surface/text mappings referencing primitives
    - Create `tokens/semantic/colors-light.json` with light theme surface/text mappings referencing primitives
    - _Requirements: 1.5, 6.5_

  - [x] 3.2 Create semantic spacing and typography token files
    - Create `tokens/semantic/spacing.json` aliasing primitive spacing and radius tokens to the contract shape
    - Create `tokens/semantic/typography.json` aliasing primitive font/fontSize/fontWeight/lineHeight tokens
    - Include shadow, transition, easing, focusRing, and borderSubtle mappings to cover the full existing contract shape
    - _Requirements: 1.5, 7.2_

- [x] 4. Implement Style Dictionary v4 custom formats
  - [x] 4.1 Implement `vanilla-extract/contract` format (`sd-formats/ve-contract.ts`)
    - Create a custom SD format that traverses the resolved token dictionary
    - Build a nested object structure with `null` values for each leaf token
    - Emit valid TypeScript: `import { createThemeContract } from '@vanilla-extract/css'` and `export const tokens = createThemeContract({...})`
    - Ensure the output matches the current `contract.css.ts` shape exactly
    - _Requirements: 5.1, 5.2_

  - [x] 4.2 Implement `vanilla-extract/theme` format (`sd-formats/ve-theme.ts`)
    - Create a custom SD format that traverses the resolved token dictionary
    - Build a nested object structure with resolved OKLCH string values for each leaf token
    - Emit valid TypeScript: `import { createTheme } from '@vanilla-extract/css'` and `export const [themeName] = createTheme(tokens, {...})`
    - Accept `themeName` option to set the export name (darkTheme, lightTheme)
    - _Requirements: 5.3, 3.4_

  - [ ]* 4.3 Write unit tests for custom SD formats
    - Test that `ve-contract` format produces valid TypeScript with correct `null` leaf structure
    - Test that `ve-theme` format produces valid TypeScript with resolved string values
    - Test that format output matches expected contract shape
    - _Requirements: 5.2, 5.4_

- [ ] 5. Implement Style Dictionary v4 configuration
  - [~] 5.1 Create `sd.config.ts` with multi-platform configuration
    - Configure `usesDtcg: true` for DTCG format parsing
    - Define shared sources pointing to `tokens/primitives/**/*.json`, `tokens/semantic/`, and `tokens/component/`
    - Configure `css-light` platform: transformGroup `css`, prefix `cnx`, output `tokens.css` and `tokens.light.css` with selectors
    - Configure `css-dark` platform: same as css-light but sources `colors-dark.json`, outputs `tokens.dark.css` with `[data-theme="dark"]` selector
    - Configure `ve-contract` platform: transformGroup `js`, output `src/contract.css.ts`
    - Configure `ve-dark` and `ve-light` platforms: output to `src/themes/dark.css.ts` and `src/themes/light.css.ts`
    - Register custom formats from `sd-formats/`
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 4.1, 4.2, 4.3_

- [~] 6. Checkpoint — Verify token generation pipeline
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement post-build validator and regeneration orchestrator
  - [~] 7.1 Implement post-build validator (`scripts/validate-outputs.ts`)
    - Parse generated CSS file to extract custom property values
    - Parse generated VE theme file to extract string literal values
    - Compare token values for each path between CSS and VE outputs
    - Exit with non-zero code and report divergent tokens on any mismatch
    - _Requirements: 10.1, 10.3, 10.4_

  - [~] 7.2 Implement regeneration orchestrator (`scripts/generate.ts`)
    - Call `generate-colors.ts` to invoke toolkit CLI
    - Call Style Dictionary build programmatically
    - Call `validate-outputs.ts` for consistency verification
    - Run `tsup` for final package build
    - Expose as `bun run tokens:generate` in package.json
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 7.3 Write unit tests for the validator
    - Test that matching CSS and VE values pass validation
    - Test that mismatched values produce non-zero exit and identify divergent tokens
    - _Requirements: 10.3, 10.4_

- [ ] 8. Update package exports and build configuration
  - [~] 8.1 Update `package.json` with new export paths and scripts
    - Add `./css`, `./css/dark`, `./css/light` export paths pointing to `dist/css/` files
    - Ensure existing exports (`.`, `./contract`, `./themes/dark`, `./themes/light`, `./global`) remain unchanged
    - Add `tokens:generate` script calling `bun scripts/generate.ts`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [~] 8.2 Update `tsup.config.ts` to include generated source files
    - Ensure tsup entry points include `src/contract.css.ts`, `src/themes/dark.css.ts`, `src/themes/light.css.ts`
    - Configure output to copy CSS files from `dist/css/` for the CSS export paths
    - _Requirements: 3.6, 9.5_

- [ ] 9. Integrate with Novel app
  - [~] 9.1 Update Novel app to consume CSS tokens instead of vanilla-extract
    - Replace vanilla-extract imports with `@cosmonexus/design-tokens/css` and `@cosmonexus/design-tokens/css/dark` imports in `+layout.svelte`
    - Implement theme switching via `document.documentElement.setAttribute('data-theme', ...)`
    - _Requirements: 4.4_

  - [~] 9.2 Remove vanilla-extract Vite plugin from Novel app
    - Remove `@vanilla-extract/vite-plugin` from the Novel app's `vite.config.ts`
    - Remove `@vanilla-extract/vite-plugin` from the Novel app's devDependencies
    - _Requirements: 4.4_

- [~] 10. Checkpoint — Full pipeline end-to-end validation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Property-based tests for correctness properties
  - [ ]* 11.1 Property test: DTCG round-trip consistency (Property 1)
    - Use fast-check to generate arbitrary DTCG-shaped JSON objects
    - Verify parse → serialize → parse produces equivalent objects
    - Tag: `Feature: design-token-integration, Property 1: DTCG Round-Trip Consistency`
    - **Validates: Requirements 1.6**

  - [ ]* 11.2 Property test: Deterministic palette generation (Property 2)
    - Use fast-check to generate arbitrary valid hex colors
    - Run palette generation twice with same input, assert deep equality
    - Tag: `Feature: design-token-integration, Property 2: Deterministic Palette Generation`
    - **Validates: Requirements 2.6**

  - [ ]* 11.3 Property test: DTCG alias resolution completeness (Property 3)
    - Use fast-check to generate token dictionaries with alias references
    - Verify all aliases resolve to existing tokens with non-empty values
    - Tag: `Feature: design-token-integration, Property 3: DTCG Alias Resolution Completeness`
    - **Validates: Requirements 3.5, 3.7**

  - [ ]* 11.4 Property test: CSS-VE value equivalence (Property 4)
    - After build, parse both CSS and VE outputs
    - Compare every token path's value across outputs
    - Tag: `Feature: design-token-integration, Property 4: CSS-VE Value Equivalence`
    - **Validates: Requirements 10.1, 10.5**

  - [ ]* 11.5 Property test: CSS naming convention compliance (Property 5)
    - Generate arbitrary token names, verify CSS output naming matches `--cnx-{category}-{name}` pattern
    - Tag: `Feature: design-token-integration, Property 5: CSS Naming Convention Compliance`
    - **Validates: Requirements 4.3**

  - [ ]* 11.6 Property test: Contract shape backward compatibility (Property 6)
    - Compare generated contract paths against snapshot of current contract shape
    - Verify all existing paths (`color`, `font`, `fontSize`, `fontWeight`, `lineHeight`, `space`, `radius`, `shadow`, `transition`, `easing`, `focusRing`, `borderSubtle`) are preserved
    - Tag: `Feature: design-token-integration, Property 6: Contract Shape Backward Compatibility`
    - **Validates: Requirements 5.2, 5.4, 9.5**

  - [ ]* 11.7 Property test: Theme satisfies contract (Property 7)
    - Verify every key path in the contract has a corresponding non-null string value in both dark and light theme implementations
    - Tag: `Feature: design-token-integration, Property 7: Theme Satisfies Contract`
    - **Validates: Requirements 3.4, 5.3**

  - [ ]* 11.8 Property test: Accessibility contrast compliance (Property 8)
    - Generate color pairs (text on surface), compute OKLCH contrast ratio
    - Verify all text/surface pairs achieve ≥ 4.5:1 WCAG AA ratio
    - Tag: `Feature: design-token-integration, Property 8: Accessibility Contrast Compliance`
    - **Validates: Requirements 2.5, 6.2**

  - [ ]* 11.9 Property test: Open Props value type preservation (Property 9)
    - Generate Open Props dimension values, verify unit preservation after pipeline (rem for spacing, px for radii, cubic-bezier for easing)
    - Tag: `Feature: design-token-integration, Property 9: Open Props Value Type Preservation`
    - **Validates: Requirements 7.3**

  - [ ]* 11.10 Property test: OKLCH color format consistency (Property 10)
    - Verify all color tokens in both CSS and VE output use `oklch(...)` notation
    - Tag: `Feature: design-token-integration, Property 10: OKLCH Color Format Consistency`
    - **Validates: Requirements 10.2**

- [~] 12. Final checkpoint — All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The toolkit CLI lives at `../../design-token-toolkit` relative to the design-tokens package
- Style Dictionary v4 handles DTCG format natively — no plugins needed for JSON parsing
- The existing `contract.css.ts` and theme files will be overwritten by the generated output
- `fast-check` 3.23.2 and `vitest` 2.1.8 are available at the workspace root

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["4.1", "4.2"] },
    { "id": 4, "tasks": ["4.3", "5.1"] },
    { "id": 5, "tasks": ["7.1", "7.2"] },
    { "id": 6, "tasks": ["7.3", "8.1", "8.2"] },
    { "id": 7, "tasks": ["9.1", "9.2"] },
    { "id": 8, "tasks": ["11.1", "11.2", "11.3", "11.5", "11.6", "11.9"] },
    { "id": 9, "tasks": ["11.4", "11.7", "11.8", "11.10"] }
  ]
}
```
