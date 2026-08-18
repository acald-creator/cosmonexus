import type { Extension as CodeMirrorExtension } from '@cosmonexus/cm/state'
import type { ExtensionConfig, ExtensionType } from './types'

/**
 * Base class for editor extensions.
 * Subclass and override `extension()` to provide CodeMirror extension(s).
 */
export class Extension<Options = unknown> {
	type: ExtensionType = 'plugin'
	name: string
	options: Options

	constructor(config: Partial<ExtensionConfig<Options>> = {}) {
		this.name = config.name ?? 'extension'
		this.options = (config.defaultOptions ?? {}) as Options
	}

	/** Returns the CodeMirror extension(s) for this plugin. Override in subclasses. */
	extension(): CodeMirrorExtension {
		return []
	}
}
