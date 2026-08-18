import { EditorState, type Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMSerializer, type Node as ProsemirrorNode } from 'prosemirror-model'
import { toggleMark } from 'prosemirror-commands'
import { novelSchema, type NovelSchema } from './schema'
import { createNovelPlugins, wordCountPluginKey, type NovelPluginOptions, type WordCount } from './plugins'

export type NovelEditorOptions = NovelPluginOptions & {
	/** Initial document content as JSON. */
	content?: Record<string, unknown>
	/** Callback fired on every document change. */
	onUpdate?: (editor: NovelEditor) => void
	/** Callback fired on focus. */
	onFocus?: (editor: NovelEditor) => void
	/** Callback fired on blur. */
	onBlur?: (editor: NovelEditor) => void
}

/**
 * High-level novel editor wrapping ProseMirror.
 * Provides a clean API for content manipulation, formatting commands,
 * and document serialization.
 */
export class NovelEditor {
	public view: EditorView | null = null
	public schema: NovelSchema = novelSchema

	private options: NovelEditorOptions

	constructor(options: NovelEditorOptions = {}) {
		this.options = options
	}

	/**
	 * Mount the editor to a DOM element.
	 */
	mount(element: HTMLElement): void {
		const doc = this.options.content
			? this.schema.nodeFromJSON(this.options.content)
			: undefined

		const state = EditorState.create({
			schema: this.schema,
			doc,
			plugins: createNovelPlugins(this.options),
		})

		this.view = new EditorView(element, {
			state,
			dispatchTransaction: (tr: Transaction) => {
				if (!this.view) return
				const newState = this.view.state.apply(tr)
				this.view.updateState(newState)

				if (tr.docChanged && this.options.onUpdate) {
					this.options.onUpdate(this)
				}
			},
			handleDOMEvents: {
				focus: () => {
					this.options.onFocus?.(this)
					return false
				},
				blur: () => {
					this.options.onBlur?.(this)
					return false
				},
			},
		})
	}

	/**
	 * Destroy the editor and clean up.
	 */
	destroy(): void {
		this.view?.destroy()
		this.view = null
	}

	/**
	 * Returns whether the editor has been destroyed.
	 */
	get isDestroyed(): boolean {
		return this.view === null
	}

	/**
	 * Returns the current document as a JSON-serializable object.
	 */
	getJSON(): Record<string, unknown> {
		if (!this.view) return {}
		return this.view.state.doc.toJSON() as Record<string, unknown>
	}

	/**
	 * Returns the document content as plain text.
	 */
	getText(): string {
		if (!this.view) return ''
		return this.view.state.doc.textContent
	}

	/**
	 * Returns the document as HTML string.
	 */
	getHTML(): string {
		if (!this.view) return ''
		const fragment = document.createElement('div')
		const serializer = DOMSerializer.fromSchema(this.schema)
		const dom = serializer.serializeFragment(this.view.state.doc.content)
		fragment.appendChild(dom)
		return fragment.innerHTML
	}

	/**
	 * Replace the entire document content from JSON.
	 */
	setContent(content: Record<string, unknown>): void {
		if (!this.view) return
		const doc = this.schema.nodeFromJSON(content)
		const tr = this.view.state.tr.replaceWith(0, this.view.state.doc.content.size, doc.content)
		this.view.dispatch(tr)
	}

	/**
	 * Clear all content, resetting to an empty paragraph.
	 */
	clear(): void {
		if (!this.view) return
		const emptyDoc = this.schema.node('doc', null, [this.schema.node('paragraph')])
		const tr = this.view.state.tr.replaceWith(0, this.view.state.doc.content.size, emptyDoc.content)
		this.view.dispatch(tr)
	}

	/**
	 * Get current word and character count.
	 */
	getWordCount(): WordCount {
		if (!this.view) return { words: 0, characters: 0 }
		return wordCountPluginKey.getState(this.view.state) ?? { words: 0, characters: 0 }
	}

	/**
	 * Focus the editor.
	 */
	focus(): void {
		this.view?.focus()
	}

	/**
	 * Blur the editor.
	 */
	blur(): void {
		if (this.view?.dom) {
			;(this.view.dom as HTMLElement).blur()
		}
	}

	// === Formatting Commands ===

	toggleBold(): boolean {
		if (!this.view) return false
		return toggleMark(this.schema.marks.bold)(this.view.state, this.view.dispatch)
	}

	toggleItalic(): boolean {
		if (!this.view) return false
		return toggleMark(this.schema.marks.italic)(this.view.state, this.view.dispatch)
	}

	toggleUnderline(): boolean {
		if (!this.view) return false
		return toggleMark(this.schema.marks.underline)(this.view.state, this.view.dispatch)
	}

	toggleStrikethrough(): boolean {
		if (!this.view) return false
		return toggleMark(this.schema.marks.strikethrough)(this.view.state, this.view.dispatch)
	}

	toggleCode(): boolean {
		if (!this.view) return false
		return toggleMark(this.schema.marks.code)(this.view.state, this.view.dispatch)
	}

	/**
	 * Check if a mark is active at the current selection.
	 */
	isMarkActive(markName: string): boolean {
		if (!this.view) return false
		const mark = this.schema.marks[markName]
		if (!mark) return false
		const { state } = this.view
		const { from, $from, to, empty } = state.selection
		if (empty) {
			return !!mark.isInSet(state.storedMarks || $from.marks())
		}
		return state.doc.rangeHasMark(from, to, mark)
	}

	/**
	 * Insert a scene break (horizontal rule) at the current cursor position.
	 */
	insertSceneBreak(): boolean {
		if (!this.view) return false
		const { state, dispatch } = this.view
		const { scene_break, paragraph } = this.schema.nodes
		const tr = state.tr.replaceSelectionWith(scene_break.create())
		// Add an empty paragraph after the break for continued writing
		tr.insert(tr.selection.from, paragraph.create())
		dispatch(tr)
		return true
	}
}
