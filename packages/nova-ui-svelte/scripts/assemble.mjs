/**
 * Assemble Script
 * 
 * 1. Moves component files from dist/components/ to dist/
 * 2. Rewrites .css.ts imports in .svelte files to use the pre-compiled styles-runtime.js
 * 3. Removes the raw .css.ts files (consumers don't need them)
 */

import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync, rmSync, unlinkSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const DIST = resolve(ROOT, 'dist')
const COMPONENTS = resolve(DIST, 'components')

// Step 1: Move component files from dist/components/ up to dist/
if (existsSync(COMPONENTS)) {
	const entries = readdirSync(COMPONENTS, { recursive: true, withFileTypes: true })
	for (const entry of entries) {
		if (entry.isFile()) {
			const parentPath = entry.parentPath ?? entry.path
			const src = resolve(parentPath, entry.name)
			const rel = relative(COMPONENTS, src)
			const dest = resolve(DIST, rel)
			const destDir = dirname(dest)
			cpSync(src, dest, { force: true })
		}
	}
	rmSync(COMPONENTS, { recursive: true })
	console.log('✓ Moved components to dist/')
}

// Step 2: Rewrite .css imports in .svelte files to use styles-runtime
// The svelte files have: import { buttonRecipe } from './Button.css'
// We need: import { buttonRecipe } from '../styles-runtime.js'
const svelteFiles = []
function findSvelteFiles(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = resolve(dir, entry.name)
		if (entry.isDirectory()) findSvelteFiles(full)
		else if (entry.name.endsWith('.svelte')) svelteFiles.push(full)
	}
}
findSvelteFiles(DIST)

for (const file of svelteFiles) {
	let content = readFileSync(file, 'utf-8')
	const fileDir = dirname(file)
	const runtimePath = relative(fileDir, resolve(DIST, 'styles-runtime.js'))
	const runtimeImport = runtimePath.startsWith('.') ? runtimePath : './' + runtimePath

	// Replace: import { X } from './ComponentName.css'
	// With:    import { X } from '../styles-runtime.js'
	content = content.replace(
		/from\s+['"]\.\/[^'"]+\.css['"]/g,
		`from '${runtimeImport}'`
	)

	// Replace: import * as X from './ComponentName.css'
	content = content.replace(
		/from\s+['"]\.\/[^'"]+\.css['"]/g,
		`from '${runtimeImport}'`
	)

	writeFileSync(file, content)
}
console.log(`✓ Rewrote imports in ${svelteFiles.length} .svelte files`)

// Step 3: Remove raw .css.ts/.css.js/.css.d.ts files (not needed by consumers)
function removeVeFiles(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = resolve(dir, entry.name)
		if (entry.isDirectory()) removeVeFiles(full)
		else if (entry.name.match(/\.css\.(js|ts|d\.ts|d\.ts\.map)$/) && !entry.name.startsWith('styles')) {
			unlinkSync(full)
		}
	}
}
removeVeFiles(DIST)
console.log('✓ Removed raw .css.ts files from dist/')

// Verify
const required = ['styles.css', 'styles-runtime.js', 'index.js', 'index.d.ts']
for (const file of required) {
	if (!existsSync(resolve(DIST, file))) {
		console.warn(`⚠ Missing: dist/${file}`)
	} else {
		console.log(`  ✓ dist/${file}`)
	}
}

console.log('\n✓ Assembly complete — consumers import components + styles.css')
