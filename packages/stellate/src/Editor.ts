import type { EditorState } from '@cosmonexus/cm/state'
import type { EditorView } from '@cosmonexus/cm/view'
import { EventEmitter } from './EventEmitter'
import type { EditorConfig, EditorEvents, EditorOptions } from './types'

/**
 * Core editor class wrapping a CodeMirror EditorView.
 * Provides a high-level API for content manipulation and event handling.
 */
export class Editor extends EventEmitter<EditorEvents> {
	public extensionStorage: Record<string, string> = {}
	public view: EditorView | undefined = undefined
	public options: EditorOptions = {}

	private readonly config: EditorConfig

	constructor(config: EditorConfig, options: Partial<EditorOptions> = {}) {
		super()
		this.config = config
		this.setOptions(options)
	}

	public get state(): EditorState {
		if (!this.view) {
			throw new Error('View not initialized')
		}
		return this.view.state
	}

	public get storage(): Record<string, string> {
		return this.extensionStorage
	}

	public get isDestroyed(): boolean {
		return this.view === undefined
	}

	public destroy(): void {
		this.view?.destroy()
		this.view = undefined
	}

	public getContent(): string {
		return this.view?.state.doc?.toString() ?? ''
	}

	public setContent(content: string): void {
		if (!this.view) return
		const transaction = this.view.state.update({
			changes: {
				from: 0,
				to: this.view.state.doc.length,
				insert: content,
			},
		})
		this.view.dispatch(transaction)
	}

	public setOptions(options: Partial<EditorOptions> = {}): void {
		this.options = { ...this.options, ...options }
	}
}
