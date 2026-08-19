# Requirements Document

## Introduction

This document specifies requirements for integrating the `design-token-toolkit` OKLCH color generation engine into the `@cosmonexus/design-tokens` package using Style Dictionary v4 as the token pipeline. The integration replaces the current hardcoded OKLCH values in vanilla-extract theme files with a generated, accessibility-verified token system that outputs both CSS custom properties (for the novel app and Svelte components) and vanilla-extract contracts (for React/Solid UI libraries). Open Props provides the primitives layer for non-color tokens (spacing, easing, radii, shadows).

## Glossary

- **Token_Pipeline**: The Style Dictionary v4 build process that transforms DTCG source tokens into platform-specific outputs (CSS custom properties and vanilla-extract TypeScript)
- **DTCG**: Design Token Community Group format — the W3C standard JSON schema using `$value`, `$type`, and `$description` properties for token definitions
- **Brand_Color**: The single OKLCH hex color input that seeds the entire palette generation via the design-token-toolkit CLI
- **Primitives_Layer**: The lowest token tier containing raw values (Open Props for non-color; toolkit-generated palettes for color) with no semantic meaning
- **Semantic_Layer**: The middle token tier that assigns purpose-based names (e.g., `color.surface.0`, `color.accent.1`) referencing primitive tokens
- **Component_Layer**: The highest token tier mapping semantic tokens to specific component slots (e.g., `button.background`, `input.border`)
- **Toolkit_CLI**: The `design-tokens` command-line interface from the `design-token-toolkit` package that generates OKLCH color palettes with accessibility validation
- **CSS_Output**: The generated `tokens.css` file containing CSS custom properties consumable without a build plugin
- **VE_Output**: The generated `contract.css.ts` and theme files for vanilla-extract consumption by React/Solid libraries
- **Novel_App**: The SvelteKit application at `apps/novel` that consumes tokens via CSS custom properties without vanilla-extract plugin dependency
- **Theme_Contract**: The vanilla-extract `createThemeContract` defining all available token slots as typed CSS variables
- **Open_Props**: The open-source CSS custom property library providing battle-tested primitive values for spacing, easing, radii, shadows, and typography

## Requirements

### Requirement 1: DTCG Token Source Structure

**User Story:** As a design system maintainer, I want all tokens defined in DTCG JSON format organized in a 3-layer hierarchy, so that I have a single source of truth that Style Dictionary can transform into any output format.

#### Acceptance Criteria

1. THE Token_Pipeline SHALL use DTCG-formatted JSON files as the sole source of truth for all design tokens
2. THE Token_Pipeline SHALL organize token source files into three layers: primitives, semantic, and component
3. WHEN the Toolkit_CLI generates color tokens, THE Token_Pipeline SHALL store the output as primitives-layer DTCG files with `$value` and `$type` properties
4. THE Token_Pipeline SHALL store Open_Props values as primitives-layer DTCG files for spacing, easing, radii, shadow, and typography tokens
5. THE Semantic_Layer SHALL reference Primitives_Layer tokens using DTCG alias syntax (`{primitives.color.primary.500}`)
6. FOR ALL token files, parsing then serializing then parsing SHALL produce equivalent token objects (round-trip property)

### Requirement 2: Brand Color Palette Generation

**User Story:** As a design system maintainer, I want to generate a complete OKLCH color palette from a single brand color, so that I can derive an entire color system that is perceptually uniform and accessibility-verified.

#### Acceptance Criteria

1. WHEN a Brand_Color is provided to the Toolkit_CLI, THE Toolkit_CLI SHALL generate a primary palette with shades 50 through 900 in OKLCH color space
2. WHEN a Brand_Color is provided, THE Toolkit_CLI SHALL generate complementary secondary and neutral palettes derived from the primary color's hue
3. WHEN a Brand_Color is provided, THE Toolkit_CLI SHALL generate semantic status colors (success, warning, error, info) with hues distinct from the primary
4. THE Toolkit_CLI SHALL output generated palettes in DTCG format compatible with the Token_Pipeline primitives layer
5. WHEN the Toolkit_CLI generates a palette, THE Toolkit_CLI SHALL validate that all generated colors have a minimum WCAG 2.1 AA contrast ratio of 4.5:1 against their intended background usage
6. FOR ALL generated palettes, regeneration from the same Brand_Color SHALL produce identical output (deterministic generation)

### Requirement 3: Style Dictionary v4 Build Pipeline

**User Story:** As a design system maintainer, I want Style Dictionary v4 to transform my DTCG source tokens into platform outputs, so that a single build step produces all the artifacts my consumers need.

#### Acceptance Criteria

1. THE Token_Pipeline SHALL use Style Dictionary v4 with DTCG format parsing enabled
2. WHEN the Token_Pipeline runs, THE Token_Pipeline SHALL produce a CSS_Output file containing all semantic and component tokens as CSS custom properties
3. WHEN the Token_Pipeline runs, THE Token_Pipeline SHALL produce a VE_Output file containing a vanilla-extract `createThemeContract` matching the current `tokens` export shape from `contract.css.ts`
4. WHEN the Token_Pipeline runs, THE Token_Pipeline SHALL produce vanilla-extract theme files (`dark.css.ts`, `light.css.ts`) that satisfy the generated contract
5. THE Token_Pipeline SHALL resolve DTCG alias references (`{path.to.token}`) during transformation
6. THE Token_Pipeline SHALL preserve the existing `@cosmonexus/design-tokens` package export paths (`"."`, `"./contract"`, `"./themes/dark"`, `"./themes/light"`, `"./global"`)
7. IF the Token_Pipeline encounters an invalid token reference, THEN THE Token_Pipeline SHALL report the broken reference path and exit with a non-zero status code

### Requirement 4: Dual Output — CSS Custom Properties

**User Story:** As the novel app developer, I want to consume design tokens as plain CSS custom properties, so that I do not need a vanilla-extract Vite plugin in my SvelteKit build.

#### Acceptance Criteria

1. THE Token_Pipeline SHALL generate a `tokens.css` file containing all semantic tokens as CSS custom properties scoped to `:root`
2. THE Token_Pipeline SHALL generate theme-specific CSS files (`tokens.dark.css`, `tokens.light.css`) that override color custom properties under a `[data-theme="dark"]` or `[data-theme="light"]` selector
3. THE CSS_Output SHALL use a consistent naming convention of `--cnx-{category}-{name}` for all custom properties
4. WHEN the Novel_App imports the CSS_Output, THE Novel_App SHALL have access to all semantic tokens without requiring a vanilla-extract build plugin
5. THE CSS_Output SHALL include non-color tokens (spacing, radii, easing, shadows, typography) sourced from Open_Props primitives

### Requirement 5: Dual Output — Vanilla-Extract Contract

**User Story:** As a React/Solid UI library author, I want to continue using typed vanilla-extract token references, so that I get compile-time safety and IDE autocomplete for token usage.

#### Acceptance Criteria

1. THE Token_Pipeline SHALL generate a `contract.css.ts` file exporting a `tokens` object created with `createThemeContract` from `@vanilla-extract/css`
2. THE VE_Output contract shape SHALL be backward-compatible with the current `tokens` export (matching all existing property paths in `color`, `font`, `fontSize`, `fontWeight`, `lineHeight`, `space`, `radius`, `shadow`, `transition`, `easing`, `focusRing`, `borderSubtle`)
3. THE Token_Pipeline SHALL generate theme implementation files that call `createTheme(tokens, {...})` with resolved OKLCH values
4. WHEN the VE_Output is consumed by `@cosmonexus/nova-ui` or `@cosmonexus/nova-ui-solid`, THE VE_Output SHALL provide the same TypeScript type as the current `tokens` contract
5. IF a new token slot is added to the DTCG source, THEN THE Token_Pipeline SHALL add the slot to both the CSS_Output and the VE_Output contract

### Requirement 6: Dark and Light Theme Generation

**User Story:** As a design system maintainer, I want both dark and light themes automatically generated from the same brand color with verified accessibility, so that I maintain consistent identity across appearances without manual color picking.

#### Acceptance Criteria

1. WHEN a Brand_Color is provided, THE Toolkit_CLI SHALL generate both a dark theme and a light theme surface scale derived from the brand hue
2. THE Toolkit_CLI SHALL verify that text colors achieve a minimum 4.5:1 contrast ratio against their corresponding surface colors in each theme
3. THE Toolkit_CLI SHALL verify that accent colors achieve a minimum 3:1 contrast ratio against surface colors for non-text interactive elements
4. WHEN accessibility verification fails for a generated color, THE Toolkit_CLI SHALL adjust the color's OKLCH lightness to meet the minimum contrast requirement
5. THE Token_Pipeline SHALL output dark and light themes as separate DTCG files in the semantic layer, each referencing the same primitives
6. THE Token_Pipeline SHALL generate corresponding CSS theme files and vanilla-extract theme files for both dark and light modes

### Requirement 7: Open Props Primitives Integration

**User Story:** As a design system maintainer, I want non-color primitives (spacing, easing, radii, shadows) sourced from Open Props, so that I use battle-tested values without reinventing standard scales.

#### Acceptance Criteria

1. THE Token_Pipeline SHALL import Open_Props values for spacing, border-radius, easing, and shadow tokens as DTCG primitives
2. THE Semantic_Layer SHALL map Open_Props primitives to the existing token contract slots (e.g., `space.1` through `space.10`, `radius.sm` through `radius.full`)
3. THE Token_Pipeline SHALL preserve the current token contract's value types (rem for spacing, px for radii, timing strings for transitions, cubic-bezier strings for easing)
4. WHEN Open_Props is updated, THE Token_Pipeline SHALL allow updating the primitives layer independently without regenerating color tokens
5. THE Token_Pipeline SHALL include font family declarations (`IBM Plex Sans`, `IBM Plex Mono`) as typography primitives outside of Open Props

### Requirement 8: Brand Color Regeneration Workflow

**User Story:** As a design system maintainer, I want to change the brand color and have the entire token set regenerate in one command, so that brand updates propagate consistently across all outputs.

#### Acceptance Criteria

1. WHEN the Brand_Color is changed in the configuration, THE Token_Pipeline SHALL regenerate all color primitives, semantic mappings, and theme files in a single build invocation
2. THE Token_Pipeline SHALL expose a single CLI command (e.g., `bun run tokens:generate`) that executes the full pipeline: color generation, DTCG assembly, and Style Dictionary build
3. WHEN the regeneration completes, THE Token_Pipeline SHALL output both the CSS_Output and VE_Output with the updated color values
4. THE Token_Pipeline SHALL store the Brand_Color configuration in a version-controlled file within the `@cosmonexus/design-tokens` package
5. IF the regenerated tokens produce accessibility violations, THEN THE Token_Pipeline SHALL log warnings identifying the specific failing contrast pairs before applying automatic lightness adjustments

### Requirement 9: Package Export Compatibility

**User Story:** As a consumer of `@cosmonexus/design-tokens`, I want the package exports to remain stable after the integration, so that existing imports continue to work without modification.

#### Acceptance Criteria

1. THE `@cosmonexus/design-tokens` package SHALL continue to export `tokens` from the root entry point
2. THE `@cosmonexus/design-tokens` package SHALL continue to export `darkTheme` and `lightTheme` from `./themes/dark` and `./themes/light` respectively
3. THE `@cosmonexus/design-tokens` package SHALL add a new export path `./css` that provides the CSS_Output file for non-vanilla-extract consumers
4. THE `@cosmonexus/design-tokens` package SHALL add a new export path `./css/dark` and `./css/light` for theme-specific CSS files
5. WHEN existing packages (`@cosmonexus/nova-ui`, `@cosmonexus/nova-ui-solid`, `@cosmonexus/novel`) import from `@cosmonexus/design-tokens`, THE imports SHALL resolve without modification

### Requirement 10: Token Value Consistency Across Outputs

**User Story:** As a design system user, I want the same token to resolve to the same computed value whether I consume it via CSS custom property or vanilla-extract, so that my UI renders identically regardless of integration path.

#### Acceptance Criteria

1. FOR ALL tokens in the semantic layer, the CSS_Output value and the VE_Output value SHALL be identical strings
2. FOR ALL color tokens, the CSS_Output and VE_Output SHALL use OKLCH notation (e.g., `oklch(0.72 0.18 295)`)
3. THE Token_Pipeline SHALL run a post-build validation step that compares CSS_Output values against VE_Output values and reports any mismatches
4. IF a mismatch is detected between CSS_Output and VE_Output for the same token, THEN THE Token_Pipeline SHALL exit with a non-zero status code and identify the divergent tokens
5. FOR ALL tokens, building from DTCG source then extracting values from CSS_Output SHALL produce the same values as building from DTCG source then extracting from VE_Output (round-trip consistency)
