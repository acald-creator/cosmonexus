/**
 * Color Generation Script
 *
 * Generates OKLCH color primitives from the brand color configuration.
 * Attempts to invoke the design-token-toolkit CLI first; falls back to
 * inline OKLCH palette generation if the toolkit is unavailable or
 * produces incompatible output.
 *
 * Output: tokens/primitives/colors.json (DTCG format)
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.6
 */

import { $ } from 'bun'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

const TOOLKIT_PATH = resolve(import.meta.dir, '../../../../design-token-toolkit')
const OUTPUT_PATH = resolve(import.meta.dir, '../tokens/primitives/colors.json')
const BRAND_COLOR_PATH = resolve(import.meta.dir, '../brand-color.json')

interface BrandColorConfig {
  brandColor: string
  hue: number
  description?: string
}

interface DtcgToken {
  $value: string
  $type: string
}

interface DtcgColorPrimitives {
  $description: string
  primitives: {
    color: Record<string, Record<string, DtcgToken> | DtcgToken>
  }
}

/**
 * Convert a hex color string to sRGB components [0-1].
 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return [r, g, b]
}

/**
 * Convert linear RGB to OKLCH via OKLab.
 * Returns [L, C, H] where L is in [0,1], C >= 0, H in [0,360).
 */
function srgbToOklch(r: number, g: number, b: number): [number, number, number] {
  // sRGB to linear
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)

  // Linear RGB to LMS (using OKLab matrix)
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s_ = 0.0883024619 * lr + 0.2220049484 * lg + 0.6896926097 * lb

  // Cube root
  const l = Math.cbrt(l_)
  const m = Math.cbrt(m_)
  const s = Math.cbrt(s_)

  // LMS to OKLab
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const bLab = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s

  // OKLab to OKLCH
  const C = Math.sqrt(a * a + bLab * bLab)
  let H = Math.atan2(bLab, a) * (180 / Math.PI)
  if (H < 0) H += 360

  return [L, C, H]
}

/**
 * Format an OKLCH color value for CSS.
 */
function formatOklch(l: number, c: number, h: number, alpha?: number): string {
  const lRound = Math.round(l * 100) / 100
  const cRound = Math.round(c * 1000) / 1000
  const hRound = Math.round(h)
  if (alpha !== undefined && alpha < 1) {
    return `oklch(${lRound} ${cRound} ${hRound} / ${alpha})`
  }
  return `oklch(${lRound} ${cRound} ${hRound})`
}

/**
 * Generate a shade scale (50-900) for a given hue with specified chroma range.
 * Shades go from lightest (50) to darkest (900).
 */
function generateShadeScale(
  hue: number,
  chromaMin: number,
  chromaMax: number,
  lightnessRange: [number, number] = [0.97, 0.25]
): Record<string, DtcgToken> {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  const [lMax, lMin] = lightnessRange
  const result: Record<string, DtcgToken> = {}

  for (const shade of shades) {
    // Normalize shade to 0-1 range (50→0, 900→1)
    const t = (shade - 50) / 850

    // Lightness decreases from lMax to lMin
    const lightness = lMax - t * (lMax - lMin)

    // Chroma peaks around shade 500-600, lower at extremes
    const chromaT = 1 - Math.abs(t - 0.55) * 1.6
    const chroma = chromaMin + Math.max(0, chromaT) * (chromaMax - chromaMin)

    result[String(shade)] = {
      $value: formatOklch(lightness, chroma, hue),
      $type: 'color',
    }
  }

  return result
}

/**
 * Generate neutral scale with very low chroma (subtle tint from brand hue).
 * Includes intermediate shades (150, 250, 750, 850) for fine surface control.
 */
function generateNeutralScale(hue: number): Record<string, DtcgToken> {
  const shades = [50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 750, 800, 850, 900]
  const result: Record<string, DtcgToken> = {}
  // Neutrals: shifted hue toward cool side (260 blended with brand)
  const neutralHue = Math.round((hue + 260) / 2)

  for (const shade of shades) {
    const t = (shade - 50) / 850
    // Lightness from 0.97 (shade 50) to 0.13 (shade 900)
    const lightness = 0.97 - t * 0.84
    // Very low chroma for neutral (0.005 to 0.02)
    const chroma = 0.005 + t * 0.01

    result[String(shade)] = {
      $value: formatOklch(lightness, chroma, neutralHue),
      $type: 'color',
    }
  }

  return result
}

/**
 * Generate semantic status colors with fixed hues distinct from the primary.
 */
function generateSemanticColors(): Record<string, Record<string, DtcgToken>> {
  return {
    success: {
      base: { $value: formatOklch(0.75, 0.17, 145), $type: 'color' },
    },
    error: {
      base: { $value: formatOklch(0.68, 0.2, 18), $type: 'color' },
    },
    warning: {
      base: { $value: formatOklch(0.80, 0.16, 75), $type: 'color' },
    },
    info: {
      base: { $value: formatOklch(0.70, 0.15, 250), $type: 'color' },
    },
  }
}

/**
 * Generate the full DTCG color primitives file from a brand color configuration.
 * This is deterministic: same input always produces the same output.
 */
export function generateColorPrimitives(config: BrandColorConfig): DtcgColorPrimitives {
  const { hue } = config

  // Secondary hue is complementary-adjacent (120° offset)
  const secondaryHue = (hue + 120) % 360

  return {
    $description: `Generated OKLCH color primitives from brand color ${config.brandColor}`,
    primitives: {
      color: {
        primary: generateShadeScale(hue, 0.02, 0.22),
        secondary: generateShadeScale(secondaryHue, 0.02, 0.18),
        neutral: generateNeutralScale(hue),
        ...generateSemanticColors(),
      },
    },
  }
}

/**
 * Attempt to invoke the design-token-toolkit CLI.
 * Returns true if successful and output is usable, false otherwise.
 */
async function tryToolkitCli(brandColor: string): Promise<boolean> {
  const cliPath = resolve(TOOLKIT_PATH, 'dist/src/cli.js')

  if (!existsSync(cliPath)) {
    console.log('⚠️  Toolkit CLI not found at', cliPath)
    return false
  }

  try {
    const result = await $`bun ${cliPath} palette ${brandColor} --format w3c --namespace primitives.color --output ${OUTPUT_PATH}`.quiet()

    if (result.exitCode !== 0) {
      console.log('⚠️  Toolkit CLI exited with code', result.exitCode)
      return false
    }

    // Verify the output is in the expected DTCG format with OKLCH values
    const output = await Bun.file(OUTPUT_PATH).json()

    // Check if it has proper nested structure with OKLCH values
    if (output?.primitives?.color?.primary?.['500']?.$value?.startsWith('oklch(')) {
      console.log('✅ Toolkit CLI produced valid OKLCH DTCG output')
      return true
    }

    console.log('⚠️  Toolkit CLI output not in expected OKLCH DTCG format, using inline generation')
    return false
  } catch (error) {
    console.log('⚠️  Toolkit CLI invocation failed:', (error as Error).message)
    return false
  }
}

/**
 * Count leaf tokens in the generated primitives.
 */
function countPrimitives(obj: Record<string, unknown>, count = 0): number {
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object' && '$value' in (value as object)) {
      count++
    } else if (value && typeof value === 'object') {
      count = countPrimitives(value as Record<string, unknown>, count)
    }
  }
  return count
}

/**
 * Main execution: generate color primitives.
 */
async function main() {
  console.log('🎨 Generating color primitives...')

  // Read brand color configuration
  const brandConfig: BrandColorConfig = await Bun.file(BRAND_COLOR_PATH).json()
  console.log(`   Brand color: ${brandConfig.brandColor} (hue: ${brandConfig.hue})`)

  // Ensure output directory exists
  const outputDir = dirname(OUTPUT_PATH)
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Try toolkit CLI first
  const toolkitSuccess = await tryToolkitCli(brandConfig.brandColor)

  if (!toolkitSuccess) {
    // Fallback: generate inline OKLCH palette
    console.log('   Using inline OKLCH palette generation...')
    const primitives = generateColorPrimitives(brandConfig)

    await Bun.write(OUTPUT_PATH, JSON.stringify(primitives, null, 2))
    console.log('✅ Inline generation complete')
  }

  // Log primitive count
  const generated = await Bun.file(OUTPUT_PATH).json()
  const count = countPrimitives(generated)
  console.log(`📊 Generated ${count} color primitives`)
}

// Only run when invoked directly, not when imported as a module
if (import.meta.main) {
  main().catch((error) => {
    console.error('❌ Color generation failed:', error)
    process.exit(1)
  })
}
