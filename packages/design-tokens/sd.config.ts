import StyleDictionary from 'style-dictionary'
import { vanillaExtractContractFormat } from './sd-formats/ve-contract'
import { vanillaExtractThemeFormat } from './sd-formats/ve-theme'

// Register custom formats
StyleDictionary.registerFormat(vanillaExtractContractFormat)
StyleDictionary.registerFormat(vanillaExtractThemeFormat)

const sharedSources = [
	'tokens/primitives/**/*.json',
	'tokens/semantic/colors-base.json',
	'tokens/semantic/spacing.json',
	'tokens/semantic/typography.json',
]

const config = {
	usesDtcg: true,
	source: [...sharedSources, 'tokens/semantic/colors-dark.json'],
	platforms: {
		'css-light': {
			transformGroup: 'css',
			buildPath: 'dist/css/',
			prefix: 'cnx',
			source: [...sharedSources, 'tokens/semantic/colors-light.json'],
			files: [
				{
					destination: 'tokens.css',
					format: 'css/variables',
					options: { outputReferences: true, selector: ':root' },
				},
				{
					destination: 'tokens.light.css',
					format: 'css/variables',
					options: { outputReferences: true, selector: '[data-theme="light"]' },
				},
			],
		},
		'css-dark': {
			transformGroup: 'css',
			buildPath: 'dist/css/',
			prefix: 'cnx',
			source: [...sharedSources, 'tokens/semantic/colors-dark.json'],
			files: [
				{
					destination: 'tokens.dark.css',
					format: 'css/variables',
					options: { outputReferences: true, selector: '[data-theme="dark"]' },
				},
			],
		},
		've-contract': {
			transformGroup: 'js',
			buildPath: 'src/',
			source: [...sharedSources, 'tokens/semantic/colors-dark.json'],
			files: [
				{
					destination: 'contract.css.ts',
					format: 'vanilla-extract/contract',
				},
			],
		},
		've-dark': {
			transformGroup: 'js',
			buildPath: 'src/themes/',
			source: [...sharedSources, 'tokens/semantic/colors-dark.json'],
			files: [
				{
					destination: 'dark.css.ts',
					format: 'vanilla-extract/theme',
					options: { themeName: 'darkTheme' },
				},
			],
		},
		've-light': {
			transformGroup: 'js',
			buildPath: 'src/themes/',
			source: [...sharedSources, 'tokens/semantic/colors-light.json'],
			files: [
				{
					destination: 'light.css.ts',
					format: 'vanilla-extract/theme',
					options: { themeName: 'lightTheme' },
				},
			],
		},
	},
}

// Allow running directly: `bun sd.config.ts`
if (import.meta.main) {
	const sd = new StyleDictionary(config)
	await sd.buildAllPlatforms()
	console.log('✅ Style Dictionary build complete')
}

export default config
