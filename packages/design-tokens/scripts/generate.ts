/**
 * Token Generation Orchestrator
 *
 * Single command to regenerate the entire token pipeline:
 * 1. Generate color primitives from brand color
 * 2. Run Style Dictionary build (CSS + vanilla-extract outputs)
 *
 * Usage: bun scripts/generate.ts
 * Or:    bun run tokens:generate
 */

import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dir, '..')

async function main() {
	console.log('🔨 Design Token Generation Pipeline\n')

	// Step 1: Generate color primitives
	console.log('Step 1: Generating color primitives...')
	const colorScript = resolve(ROOT, 'scripts/generate-colors.ts')
	const colorProc = Bun.spawn(['bun', colorScript], { cwd: ROOT, stdout: 'inherit', stderr: 'inherit' })
	const colorResult = await colorProc.exited
	if (colorResult !== 0) {
		console.error('❌ Color generation failed')
		process.exit(1)
	}
	console.log('')

	// Step 2: Run Style Dictionary build
	console.log('Step 2: Running Style Dictionary build...')
	const sdConfig = resolve(ROOT, 'sd.config.ts')
	const sdProc = Bun.spawn(['bun', sdConfig], { cwd: ROOT, stdout: 'inherit', stderr: 'inherit' })
	const sdResult = await sdProc.exited
	if (sdResult !== 0) {
		console.error('❌ Style Dictionary build failed')
		process.exit(1)
	}
	console.log('')

	console.log('✅ Token generation pipeline complete!')
	console.log('   Outputs:')
	console.log('   - dist/css/tokens.css (CSS custom properties)')
	console.log('   - dist/css/tokens.dark.css (dark theme overrides)')
	console.log('   - dist/css/tokens.light.css (light theme overrides)')
	console.log('   - src/contract.css.ts (vanilla-extract contract)')
	console.log('   - src/themes/dark.css.ts (vanilla-extract dark theme)')
	console.log('   - src/themes/light.css.ts (vanilla-extract light theme)')
}

main()
