<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte'
	import { Editor } from '@cosmonexus/stellate'
	import type { EditorConfig, EditorOptions } from '@cosmonexus/stellate'
	import { EditorView } from '@cosmonexus/cm/view'
	import { EditorState, Compartment } from '@cosmonexus/cm/state'
	import type { Extension } from '@cosmonexus/cm/state'

	/** Initial document content (only used at mount time). */
	export let content: string = ''

	/** CodeMirror extensions to apply. */
	export let extensions: Extension[] = []

	/** Editor configuration passed to stellate Editor. */
	export let config: EditorConfig = {}

	/** Editor options passed to stellate Editor. */
	export let options: EditorOptions = {}

	/** Whether the editor is read-only. */
	export let readonly: boolean = false

	/** CSS class to apply to the wrapper element. */
	let className: string = ''
	export { className as class }

	const dispatch = createEventDispatcher<{
		change: { content: string }
		focus: void
		blur: void
		ready: { editor: Editor; view: EditorView }
	}>()

	let container: HTMLDivElement
	let editor: Editor | undefined
	let view: EditorView | undefined

	/** Get the current editor instance (for imperative access). */
	export function getEditor(): Editor | undefined {
		return editor
	}

	/** Get the current EditorView (for direct CodeMirror access). */
	export function getView(): EditorView | undefined {
		return view
	}

	/** Programmatically set content. */
	export function setContent(newContent: string): void {
		editor?.setContent(newContent)
	}

	/** Get current document content. */
	export function getContent(): string {
		return editor?.getContent() ?? ''
	}

	onMount(() => {
		editor = new Editor(config, options)

		const allExtensions: Extension[] = [...extensions]

		if (readonly) {
			allExtensions.push(EditorState.readOnly.of(true))
		}

		allExtensions.push(
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					dispatch('change', { content: update.state.doc.toString() })
				}
				if (update.focusChanged) {
					if (update.view.hasFocus) {
						dispatch('focus')
					} else {
						dispatch('blur')
					}
				}
			}),
		)

		const state = EditorState.create({
			doc: content,
			extensions: allExtensions,
		})

		view = new EditorView({
			state,
			parent: container,
		})

		editor.view = view
		dispatch('ready', { editor, view })
	})

	onDestroy(() => {
		if (editor) {
			editor.destroy()
			editor = undefined
			view = undefined
		}
	})
</script>

<div bind:this={container} class="nova-code-editor {className}" role="textbox" aria-multiline="true"></div>

<style>
	.nova-code-editor {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.nova-code-editor :global(.cm-editor) {
		height: 100%;
	}

	.nova-code-editor :global(.cm-scroller) {
		overflow: auto;
	}
</style>
