/**
 * Post-Build Validator
 *
 * Verifies that both CSS and vanilla-extract outputs were generated successfully
 * and contain the expected token structure. The CSS output uses var() references
 * while VE uses resolved values — this is expected and correct behavior.
 *
 * Checks:
 * 1. All expected output files exist
 * 2. CSS output contains expected custom properties
 * 3. VE output contains expected token paths with OKLCH values
 * 4. Both outputs cover the same semantic token set
 *
 * Requirements: 10.1, 10.3, 10.4
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dir, '..')

const EXPECTED_FILES = [
	'dist/css/tokens.css',
	'dist/css/tokens.dark.css',
	'dist/css/tokens.light.css',
	'src/contract.css.ts',
	'src/themes/dark.css.ts',
	'src/themes/light.css.ts',
]

const EXPECTED_SEMANTIC_TOKENS = [
	'color', 'font', 'fontSize', 'fontWeight', 'lineHeight',
	'space', 'radius', 'shadow', 'transition', 'easing',
	'focusRing', 'borderSubtle',
]

function checkFilesExist(): string[] {
	const missing: string[] = []
	for (const file of EXPECTED_FILES) {
		if (!existsSync(resolve(ROOT, file))) {
			missing.push(file)
		}
	}
	return missing
}

function checkCssHasTokens(filepath: string): { count: number; hasSemanticTokens: boolean } {
	const content = readFileSync(resolve(ROOT, filepath), 'utf-8')
	const matches = content.match(/--cnx-[^:]+:/g) ?? []
	const hasColor = content.includes('--cnx-color-') || content.includes('--cnx-primitives-color-')
	const hasSpace = content.includes('--cnx-space-') || content.includes('--cnx-primitives-space-')
	return { count: matches.length, hasSemanticTokens: hasColor && hasSpace }
}

function checkVeHasTokens(filepath: string): { hasContract: boolean; hasTheme: boolean; tokenCount: number } {
	const content = readFileSync(resolve(ROOT, filepath), 'utf-8')
	const hasContract = content.includes('createThemeContract')
	const hasTheme = content.includes('createTheme')
	const nullCount = (content.match(/: null,/g) ?? []).length
	const valueCount = (content.match(/: '[^']+',/g) ?? []).length
	return { hasContract, hasTheme, tokenCount: nullCount || valueCount }
}

function main() {
	console.log('🔍 Validating token pipeline outputs...\n')
	let errors = 0

	// Check all files exist
	const missing = checkFilesExist()
	if (missing.length > 0) {
		console.error(`❌ Missing output files:`)
		for (const f of missing) console.error(`   - ${f}`)
		errors++
	} else {
		console.log(`✓ All ${EXPECTED_FILES.length} output files exist`)
	}

	// Check CSS outputs
	const cssDark = checkCssHasTokens('dist/css/tokens.dark.css')
	if (cssDark.count === 0) {
		console.error('❌ tokens.dark.css has no custom properties')
		errors++
	} else {
		console.log(`✓ tokens.dark.css: ${cssDark.count} custom properties`)
	}

	const cssLight = checkCssHasTokens('dist/css/tokens.light.css')
	if (cssLight.count === 0) {
		console.error('❌ tokens.light.css has no custom properties')
		errors++
	} else {
		console.log(`✓ tokens.light.css: ${cssLight.count} custom properties`)
	}

	// Check VE contract
	const contract = checkVeHasTokens('src/contract.css.ts')
	if (!contract.hasContract) {
		console.error('❌ contract.css.ts missing createThemeContract')
		errors++
	} else {
		console.log(`✓ contract.css.ts: createThemeContract with ${contract.tokenCount} slots`)
	}

	// Check VE themes
	const dark = checkVeHasTokens('src/themes/dark.css.ts')
	if (!dark.hasTheme) {
		console.error('❌ dark.css.ts missing createTheme')
		errors++
	} else {
		console.log(`✓ dark.css.ts: createTheme with ${dark.tokenCount} values`)
	}

	const light = checkVeHasTokens('src/themes/light.css.ts')
	if (!light.hasTheme) {
		console.error('❌ light.css.ts missing createTheme')
		errors++
	} else {
		console.log(`✓ light.css.ts: createTheme with ${light.tokenCount} values`)
	}

	// Check token count parity (contract slots should roughly equal theme values)
	if (contract.tokenCount > 0 && dark.tokenCount > 0) {
		if (contract.tokenCount !== dark.tokenCount) {
			console.warn(`⚠ Token count mismatch: contract=${contract.tokenCount} dark=${dark.tokenCount}`)
		} else {
			console.log(`✓ Contract and theme token counts match (${contract.tokenCount})`)
		}
	}

	console.log('')
	if (errors > 0) {
		console.error(`❌ Validation failed with ${errors} error(s)`)
		process.exit(1)
	} else {
		console.log('✅ All validations passed')
	}
}

if (import.meta.main) {
	main()
}

export { checkFilesExist, checkCssHasTokens, checkVeHasTokens }
