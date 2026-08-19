/**
 * Assemble Script
 * 
 * 1. Moves component files from dist/components/ to dist/
 * 2. Rewrites .css imports in .svelte files to use pre-compiled styles-runtime.js
 * 3. Removes raw .css.ts files (consumers don't need them)
 */

import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync, rmSync, unlinkSync } from 'node:fs'
import { resolve, relative, dirname, basename } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const DIST = resolve(ROOT, 'dist')
const COMPONENTS = resolve(DIST, 'components')

// Mapping of component directory names to their namespace export in styles-runtime.js
const NAMESPACE_MAP = {
	'Input': 'inputStyles',
	'Card': 'cardStyles',
	'Pagination': 'paginationStyles',
	'DataTable': 'dataTableStyles',
	'Checkbox': 'checkboxStyles',
	'Select': 'selectStyles',
	'Tabs': 'tabsStyles',
	'Textarea': 'textareaStyles',
	'Toast': 'toastStyles',
}

// Step 1: Move component files from dist/components/ up to dist/
if (existsSync(COMPONENTS)) {
	const entries = readdirSync(COMPONENTS, { recursive: true, withFileTypes: true })
	for (const entry of entries) {
		if (entry.isFile()) {
			const parentPath = entry.parentPath ?? entry.path
			const src = resolve(parentPath, entry.name)
			const rel = relative(COMPONENTS, src)
			const dest = resolve(DIST, rel)
			cpSync(src, dest, { force: true })
		}
	}
	rmSync(COMPONENTS, { recursive: true })
	console.log('✓ Moved components to dist/')
}

// Step 2: Rewrite .css imports in .svelte files
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
	const componentDir = basename(fileDir)
	const runtimeRel = relative(fileDir, resolve(DIST, 'styles-runtime.js'))
	const runtimeImport = runtimeRel.startsWith('.') ? runtimeRel : './' + runtimeRel

	// Handle `import * as styles from './X.css'` → remap to namespace
	const nsExport = NAMESPACE_MAP[componentDir]
	if (nsExport) {
		content = content.replace(
			/import\s+\*\s+as\s+styles\s+from\s+['"]\.\/[^'"]+\.css['"]/g,
			`import { ${nsExport} as styles } from '${runtimeImport}'`
		)
	}

	// Handle `import { X } from './Y.css'` → named imports from runtime
	content = content.replace(
		/from\s+['"]\.\/[^'"]+\.css['"]/g,
		`from '${runtimeImport}'`
	)

	writeFileSync(file, content)
}
console.log(`✓ Rewrote imports in ${svelteFiles.length} .svelte files`)

// Step 3: Remove raw .css.ts/.css.js/.css.d.ts files
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

console.log('\n✓ Assembly complete')

// Step 4: Append theme exports to index.js
const indexPath = resolve(DIST, 'index.js')
if (existsSync(indexPath)) {
	const indexContent = readFileSync(indexPath, 'utf-8')
	if (!indexContent.includes('darkTheme')) {
		writeFileSync(indexPath, indexContent + "\nexport { darkTheme, lightTheme } from './styles-runtime.js'\n")
		console.log('✓ Added theme exports to index.js')
	}
}
