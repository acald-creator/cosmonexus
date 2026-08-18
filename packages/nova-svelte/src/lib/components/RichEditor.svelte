<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte'
	import { NovelEditor, type NovelEditorOptions, type WordCount } from '@cosmonexus/prose'

	/** Initial document content as JSON (ProseMirror doc format). */
	export let content: Record<string, unknown> | undefined = undefined

	/** Placeholder text shown in empty editor. */
	export let placeholder: string = 'Start writing...'

	/** Whether to enable smart typography (curly quotes, em dash, ellipsis). */
	export let smartTypography: boolean = true

	/** CSS class to apply to the wrapper element. */
	let className: string = ''
	export { className as class }

	const dispatch = createEventDispatcher<{
		update: { editor: NovelEditor; wordCount: WordCount }
		focus: { editor: NovelEditor }
		blur: { editor: NovelEditor }
		ready: { editor: NovelEditor }
	}>()

	let container: HTMLDivElement
	let editor: NovelEditor | undefined

	/** Get the NovelEditor instance for imperative access. */
	export function getEditor(): NovelEditor | undefined {
		return editor
	}

	/** Get document as JSON. */
	export function getJSON(): Record<string, unknown> {
		return editor?.getJSON() ?? {}
	}

	/** Get document as plain text. */
	export function getText(): string {
		return editor?.getText() ?? ''
	}

	/** Get current word count. */
	export function getWordCount(): WordCount {
		return editor?.getWordCount() ?? { words: 0, characters: 0 }
	}

	/** Replace document content from JSON. */
	export function setContent(newContent: Record<string, unknown>): void {
		editor?.setContent(newContent)
	}

	/** Clear all content. */
	export function clear(): void {
		editor?.clear()
	}

	/** Focus the editor. */
	export function focus(): void {
		editor?.focus()
	}

	onMount(() => {
		const options: NovelEditorOptions = {
			content,
			placeholder,
			smartTypography,
			onUpdate: (ed) => {
				dispatch('update', { editor: ed, wordCount: ed.getWordCount() })
			},
			onFocus: (ed) => {
				dispatch('focus', { editor: ed })
			},
			onBlur: (ed) => {
				dispatch('blur', { editor: ed })
			},
		}

		editor = new NovelEditor(options)
		editor.mount(container)
		dispatch('ready', { editor })
	})

	onDestroy(() => {
		if (editor) {
			editor.destroy()
			editor = undefined
		}
	})
</script>

<div bind:this={container} class="nova-rich-editor {className}" role="textbox" aria-multiline="true"></div>

<style>
	.nova-rich-editor {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.nova-rich-editor :global(.ProseMirror) {
		height: 100%;
		outline: none;
		padding: 1rem;
		line-height: 1.75;
		font-size: 1rem;
	}

	.nova-rich-editor :global(.ProseMirror p) {
		margin-bottom: 0.75em;
	}

	.nova-rich-editor :global(.ProseMirror h1) {
		font-size: 2em;
		font-weight: 700;
		margin: 1.5em 0 0.5em;
	}

	.nova-rich-editor :global(.ProseMirror h2) {
		font-size: 1.5em;
		font-weight: 600;
		margin: 1.25em 0 0.4em;
	}

	.nova-rich-editor :global(.ProseMirror h3) {
		font-size: 1.25em;
		font-weight: 600;
		margin: 1em 0 0.3em;
	}

	.nova-rich-editor :global(.ProseMirror blockquote) {
		border-left: 3px solid currentColor;
		opacity: 0.8;
		padding-left: 1em;
		margin: 1em 0;
		font-style: italic;
	}

	.nova-rich-editor :global(.ProseMirror hr) {
		border: none;
		border-top: 1px solid currentColor;
		opacity: 0.3;
		margin: 2em auto;
		width: 40%;
	}

	.nova-rich-editor :global(.ProseMirror ul),
	.nova-rich-editor :global(.ProseMirror ol) {
		padding-left: 1.5em;
		margin: 0.75em 0;
	}

	.nova-rich-editor :global(.ProseMirror code) {
		background: rgba(128, 128, 128, 0.15);
		border-radius: 3px;
		padding: 0.1em 0.3em;
		font-family: monospace;
		font-size: 0.9em;
	}

	.nova-rich-editor :global(.novel-comment) {
		background: rgba(255, 200, 50, 0.2);
		border-bottom: 2px dashed rgba(255, 200, 50, 0.6);
		cursor: help;
	}

	.nova-rich-editor :global(.novel-placeholder) {
		position: relative;
	}

	.nova-rich-editor :global(.novel-placeholder::before) {
		content: attr(data-placeholder);
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0.4;
		pointer-events: none;
	}
</style>
