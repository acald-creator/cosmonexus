import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		'core/index': 'src/core/index.ts',
		'langpack/index': 'src/langpack/index.ts',
		'language/index': 'src/language/index.ts',
		'lint/index': 'src/lint/index.ts',
		'state/index': 'src/state/index.ts',
		'view/index': 'src/view/index.ts',
	},
	format: ['esm', 'cjs'],
	dts: true,
	target: 'es2022',
	sourcemap: true,
	clean: true,
})
