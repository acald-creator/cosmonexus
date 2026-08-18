export type CommandProps = Record<string, unknown>

export type EditorEvents = Record<string, (...args: unknown[]) => void>

export type EditorConfig = Record<string, unknown>

export type EditorOptions = Record<string, unknown>

export type ExtensionType = 'language' | 'theme' | 'keymap' | 'plugin'

export type ExtensionConfig<Options = unknown> = {
	name: string
	defaultOptions?: Options
}
