import type { Extension } from './Extension'

/**
 * Manages a collection of editor extensions.
 * Handles registration, resolution, and lifecycle.
 */
export class ExtensionManager {
	private extensions: Extension[] = []

	register(extension: Extension): void {
		this.extensions.push(extension)
	}

	getAll(): Extension[] {
		return this.extensions
	}

	getByName(name: string): Extension | undefined {
		return this.extensions.find((ext) => ext.name === name)
	}
}
