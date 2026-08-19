/**
 * Open Props → DTCG Mapping Script
 *
 * Reads Open Props CSS custom properties from the `open-props` npm package
 * and converts them to DTCG-formatted JSON primitive files.
 *
 * This script is NOT part of the hot regeneration path — it runs once
 * (or on Open Props version update) and the resulting JSON is committed.
 *
 * Output files:
 *   tokens/primitives/spacing.json
 *   tokens/primitives/radii.json
 *   tokens/primitives/easing.json
 *   tokens/primitives/shadows.json
 *
 * Requirements traced: 7.1, 7.2, 7.3
 */

import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

// Open Props JS exports keyed by CSS custom property name
import sizes from 'open-props/src/sizes'
import borders from 'open-props/src/borders'
import easing from 'open-props/src/easing'
import shadows from 'open-props/src/shadows'

const OUTPUT_DIR = resolve(import.meta.dir, '../tokens/primitives')

// ─── Spacing Mapping ────────────────────────────────────────────────────────
// Maps Open Props --size-* variables to primitives.space.*
// Contract expects keys: 1, 2, 3, 4, 5, 6, 8, 10
//
// Open Props sizes go: --size-1: .25rem, --size-2: .5rem, --size-3: 1rem, ...
// The existing contract uses a linear 0.25rem step scale, so we map selectively:
//   space.1 = 0.25rem (--size-1), space.2 = 0.5rem (--size-2)
//   space.3 = 0.75rem (not directly in Open Props — derived from scale)
//   space.4 = 1rem (--size-3), space.5 = 1.25rem (--size-4)
//   space.6 = 1.5rem (--size-5), space.8 = 2rem (--size-7)
//   space.10 = 2.5rem (midpoint between --size-7 and --size-8)

interface SpaceMapping {
  contractKey: string
  source: string | null // null = hardcoded value not from Open Props
  fallback?: string
}

const SPACE_MAPPINGS: SpaceMapping[] = [
  { contractKey: '1', source: '--size-1' },      // .25rem
  { contractKey: '2', source: '--size-2' },      // .5rem
  { contractKey: '3', source: null, fallback: '0.75rem' }, // Not in Open Props scale
  { contractKey: '4', source: '--size-3' },      // 1rem
  { contractKey: '5', source: '--size-4' },      // 1.25rem
  { contractKey: '6', source: '--size-5' },      // 1.5rem
  { contractKey: '8', source: '--size-7' },      // 2rem
  { contractKey: '10', source: null, fallback: '2.5rem' }, // Not exact in Open Props
]

function normalizeRem(value: string): string {
  // Normalize ".25rem" → "0.25rem" for consistency
  const trimmed = value.trim()
  if (trimmed.startsWith('.')) {
    return `0${trimmed}`
  }
  if (trimmed.startsWith('-.')) {
    return `-0${trimmed.slice(1)}`
  }
  return trimmed
}

function buildSpacingTokens(): Record<string, unknown> {
  const space: Record<string, { $value: string; $type: string }> = {}

  for (const mapping of SPACE_MAPPINGS) {
    let value: string
    if (mapping.source && (sizes as Record<string, string>)[mapping.source]) {
      value = normalizeRem((sizes as Record<string, string>)[mapping.source])
    } else if (mapping.fallback) {
      value = mapping.fallback
    } else {
      console.warn(`⚠ No source value for space.${mapping.contractKey}`)
      continue
    }
    space[mapping.contractKey] = { $value: value, $type: 'dimension' }
  }

  return {
    $description: 'Spacing primitives sourced from Open Props',
    primitives: { space },
  }
}

// ─── Radii Mapping ──────────────────────────────────────────────────────────
// Maps Open Props --radius-* variables to primitives.radius.*
// Contract expects keys: sm, md, lg, full
//
// Open Props: --radius-1: 2px, --radius-2: 5px, --radius-3: 1rem, ...
// --radius-round: 1e5px (effectively "full")
//
// The existing theme uses: sm=4px, md=6px, lg=8px, full=9999px
// We map from the closest Open Props values.

interface RadiusMapping {
  contractKey: string
  source: string | null
  fallback?: string
}

const RADIUS_MAPPINGS: RadiusMapping[] = [
  { contractKey: 'sm', source: null, fallback: '4px' },    // Between --radius-1 (2px) and --radius-2 (5px)
  { contractKey: 'md', source: null, fallback: '6px' },    // Between --radius-1 (2px) and --radius-2 (5px)
  { contractKey: 'lg', source: null, fallback: '8px' },    // Close to --radius-2 (5px) but larger
  { contractKey: 'full', source: '--radius-round' },       // 1e5px → maps to "full"
]

function buildRadiiTokens(): Record<string, unknown> {
  const radius: Record<string, { $value: string; $type: string }> = {}

  for (const mapping of RADIUS_MAPPINGS) {
    let value: string
    if (mapping.source && (borders as Record<string, string>)[mapping.source]) {
      value = (borders as Record<string, string>)[mapping.source]
      // Normalize 1e5px to 9999px for compatibility
      if (value === '1e5px') {
        value = '9999px'
      }
    } else if (mapping.fallback) {
      value = mapping.fallback
    } else {
      console.warn(`⚠ No source value for radius.${mapping.contractKey}`)
      continue
    }
    radius[mapping.contractKey] = { $value: value, $type: 'dimension' }
  }

  return {
    $description: 'Border radius primitives sourced from Open Props',
    primitives: { radius },
  }
}

// ─── Easing Mapping ─────────────────────────────────────────────────────────
// Maps Open Props --ease-* variables to primitives.easing.*
// Contract expects keys: out, inOut
//
// Design doc references: --ease-out-3, --ease-in-out-3
// Existing theme: out = cubic-bezier(0.16, 1, 0.3, 1), inOut = cubic-bezier(0.45, 0, 0.55, 1)
// Open Props: --ease-out-3 = cubic-bezier(0, 0, .3, 1), --ease-in-out-3 = cubic-bezier(.5, 0, .5, 1)

interface EasingMapping {
  contractKey: string
  source: string
}

const EASING_MAPPINGS: EasingMapping[] = [
  { contractKey: 'out', source: '--ease-out-3' },
  { contractKey: 'inOut', source: '--ease-in-out-3' },
]

function normalizeCubicBezier(value: string): string {
  // Normalize shorthand decimals in cubic-bezier: ".3" → "0.3"
  return value.replace(/(\(|,\s*)(\.)(\d)/g, '$10.$3')
    .replace(/(\(|,\s*)(-)(\.)(\d)/g, '$1-0.$4')
}

function buildEasingTokens(): Record<string, unknown> {
  const easingTokens: Record<string, { $value: string; $type: string }> = {}

  for (const mapping of EASING_MAPPINGS) {
    const raw = (easing as Record<string, string>)[mapping.source]
    if (!raw) {
      console.warn(`⚠ No source value for easing.${mapping.contractKey} (${mapping.source})`)
      continue
    }
    easingTokens[mapping.contractKey] = {
      $value: normalizeCubicBezier(raw),
      $type: 'cubicBezier',
    }
  }

  return {
    $description: 'Easing primitives sourced from Open Props',
    primitives: { easing: easingTokens },
  }
}

// ─── Shadow Mapping ─────────────────────────────────────────────────────────
// Maps Open Props --shadow-* variables to primitives.shadow.*
// Contract expects keys: md, glow
//
// Open Props shadows use CSS variable references (var(--shadow-color), etc.)
// which makes them unsuitable for direct DTCG token values.
// We instead use resolved static values matching the existing theme.
//
// --shadow-3 is the "medium elevation" shadow in Open Props scale.
// "glow" is a custom effect not from Open Props, so we keep the existing value.

interface ShadowMapping {
  contractKey: string
  source: string | null
  fallback?: string
}

const SHADOW_MAPPINGS: ShadowMapping[] = [
  { contractKey: 'md', source: null, fallback: '0 4px 12px oklch(0 0 0 / 0.4)' },
  { contractKey: 'glow', source: null, fallback: '0 0 20px oklch(0.72 0.18 295 / 0.2)' },
]

function buildShadowTokens(): Record<string, unknown> {
  const shadow: Record<string, { $value: string; $type: string }> = {}

  for (const mapping of SHADOW_MAPPINGS) {
    let value: string
    if (mapping.source && (shadows as Record<string, string>)[mapping.source]) {
      value = (shadows as Record<string, string>)[mapping.source]
    } else if (mapping.fallback) {
      value = mapping.fallback
    } else {
      console.warn(`⚠ No source value for shadow.${mapping.contractKey}`)
      continue
    }
    shadow[mapping.contractKey] = { $value: value, $type: 'shadow' }
  }

  return {
    $description: 'Shadow primitives inspired by Open Props',
    primitives: { shadow },
  }
}

// ─── Output ─────────────────────────────────────────────────────────────────

async function writeTokenFile(filename: string, data: Record<string, unknown>): Promise<void> {
  const filepath = resolve(OUTPUT_DIR, filename)
  await mkdir(dirname(filepath), { recursive: true })
  await Bun.write(filepath, JSON.stringify(data, null, 2) + '\n')
  console.log(`✓ Written: ${filepath}`)
}

async function main(): Promise<void> {
  console.log('Open Props → DTCG conversion starting...\n')

  const spacingTokens = buildSpacingTokens()
  const radiiTokens = buildRadiiTokens()
  const easingTokens = buildEasingTokens()
  const shadowTokens = buildShadowTokens()

  await writeTokenFile('spacing.json', spacingTokens)
  await writeTokenFile('radii.json', radiiTokens)
  await writeTokenFile('easing.json', easingTokens)
  await writeTokenFile('shadows.json', shadowTokens)

  console.log('\n✓ Open Props → DTCG conversion complete')
  console.log(`  Spacing: ${Object.keys((spacingTokens as any).primitives.space).length} tokens`)
  console.log(`  Radii: ${Object.keys((radiiTokens as any).primitives.radius).length} tokens`)
  console.log(`  Easing: ${Object.keys((easingTokens as any).primitives.easing).length} tokens`)
  console.log(`  Shadows: ${Object.keys((shadowTokens as any).primitives.shadow).length} tokens`)
}

main().catch((err) => {
  console.error('✗ Open Props → DTCG conversion failed:', err)
  process.exit(1)
})
