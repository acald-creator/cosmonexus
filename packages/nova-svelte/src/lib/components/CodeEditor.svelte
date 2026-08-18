<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte'
	import { Editor } from '@cosmonexus/stellate'
	import type { EditorConfig, EditorOptions } from '@cosmonexus/stellate'
	import { EditorView } from '@cosmonexus/cm/view'
	import { EditorState } from '@cosmonexus/cm/state'
	import type { Extension } from '@cosmonexus/cm/state'

	/** Initial document content. */
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

	function buildExtensions(): Extension[] {
		const allExtensions: Extension[] = [...extensions]

		// Read-only state
		if (readonly) {
			allExtensions.push(EditorState.readOnly.of(true))
		}

		// Update listener for content change events
		allExtensions.push(
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					const newContent = update.state.doc.toString()
					dispatch('change', { content: newContent })
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

		return allExtensions
	}

	onMount(() => {
		editor = new Editor(config, options)

		const state = EditorState.create({
			doc: content,
			extensions: buildExtensions(),
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

	// Reactively update extensions when props change
	$: if (view) {
		view.dispatch({
			effects: EditorView.reconfigure(buildExtensions()),
		})
	}

	// Reactively sync content from parent (only if it differs from current doc)
	$: if (view && content !== view.state.doc.toString()) {
		view.dispatch({
			changes: {
				from: 0,
				to: view.state.doc.length,
				insert: content,
			},
		})
	}
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
