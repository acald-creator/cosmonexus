<script>
	import { onMount } from 'svelte'
	import { RichEditor } from '@cosmonexus/nova-svelte'

	let wordCount = $state({ words: 0, characters: 0 })
	let isFocused = $state(false)
	let lastSaved = $state('')
	let editorRef = $state(undefined)

	function handleUpdate(event) {
		const { editor, wordCount: wc } = event.detail
		wordCount = wc
	}

	function handleFocus() {
		isFocused = true
	}

	function handleBlur() {
		isFocused = false
	}

	function handleReady(event) {
		editorRef = event.detail.editor
	}

	function saveChapter() {
		if (!editorRef) return
		const json = editorRef.getJSON()
		localStorage.setItem('novel-draft', JSON.stringify(json))
		lastSaved = new Date().toLocaleTimeString()
	}

	function loadDraft() {
		if (!editorRef) return
		const saved = localStorage.getItem('novel-draft')
		if (saved) {
			editorRef.setContent(JSON.parse(saved))
		}
	}

	function insertBreak() {
		editorRef?.insertSceneBreak()
	}

	function toggleBold() {
		editorRef?.toggleBold()
		editorRef?.focus()
	}

	function toggleItalic() {
		editorRef?.toggleItalic()
		editorRef?.focus()
	}

	function toggleUnderline() {
		editorRef?.toggleUnderline()
		editorRef?.focus()
	}

	onMount(() => {
		const saved = localStorage.getItem('novel-draft')
		if (saved && editorRef) {
			editorRef.setContent(JSON.parse(saved))
		}
	})
</script>

<main>
	<header>
		<div class="title-row">
			<h1>Novel Editor</h1>
			<a href="/" class="back-link">← Back to playground</a>
		</div>
		<p class="subtitle">
			Rich-text editor powered by <code>@cosmonexus/prose</code> + ProseMirror — designed for writing fiction.
		</p>
	</header>

	<div class="toolbar">
		<div class="format-group">
			<button onclick={toggleBold} title="Bold (Cmd+B)" class="toolbar-btn">
				<strong>B</strong>
			</button>
			<button onclick={toggleItalic} title="Italic (Cmd+I)" class="toolbar-btn">
				<em>I</em>
			</button>
			<button onclick={toggleUnderline} title="Underline (Cmd+U)" class="toolbar-btn">
				<u>U</u>
			</button>
			<button onclick={insertBreak} title="Scene Break" class="toolbar-btn">
				—
			</button>
		</div>

		<div class="actions">
			<button onclick={saveChapter} class="save-btn">Save Draft</button>
			<button onclick={loadDraft} class="load-btn">Load Draft</button>
		</div>
	</div>

	<div class="editor-container" class:focused={isFocused}>
		<RichEditor
			placeholder="Begin your chapter..."
			on:update={handleUpdate}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:ready={handleReady}
		/>
	</div>

	<footer>
		<div class="stats">
			<span>{wordCount.words} words</span>
			<span class="divider">·</span>
			<span>{wordCount.characters} characters</span>
		</div>
		<div class="status">
			{#if lastSaved}
				<span class="saved">Saved at {lastSaved}</span>
			{:else}
				<span class="unsaved">Unsaved</span>
			{/if}
		</div>
	</footer>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		margin-bottom: 1.5rem;
	}

	.title-row {
		display: flex;
		align-items: baseline;
		gap: 1.5rem;
	}

	h1 {
		font-size: 1.75rem;
		font-weight: 700;
	}

	.back-link {
		font-size: 0.85rem;
		color: #7aa2f7;
		text-decoration: none;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.subtitle {
		color: #565f89;
		font-size: 0.9rem;
		margin-top: 0.4rem;
	}

	code {
		background: #24283b;
		padding: 0.15em 0.4em;
		border-radius: 4px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.85em;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.75rem;
		background: #24283b;
		border: 1px solid #414868;
		border-bottom: none;
		border-radius: 12px 12px 0 0;
	}

	.format-group {
		display: flex;
		gap: 0.25rem;
	}

	.toolbar-btn {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		border: 1px solid transparent;
		background: transparent;
		color: #c0caf5;
		font-size: 0.9rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s;
	}

	.toolbar-btn:hover {
		background: #414868;
		border-color: #565f89;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.save-btn,
	.load-btn {
		padding: 0.35rem 0.75rem;
		border-radius: 6px;
		border: 1px solid #414868;
		background: transparent;
		color: #c0caf5;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.save-btn:hover {
		border-color: #7aa2f7;
		color: #7aa2f7;
	}

	.load-btn:hover {
		border-color: #bb9af7;
		color: #bb9af7;
	}

	.editor-container {
		flex: 1;
		min-height: 500px;
		background: #1a1b26;
		border: 1px solid #414868;
		border-radius: 0 0 12px 12px;
		overflow: hidden;
		transition: border-color 0.2s;
	}

	.editor-container.focused {
		border-color: #7aa2f7;
	}

	.editor-container :global(.nova-rich-editor) {
		height: 100%;
		min-height: 500px;
	}

	.editor-container :global(.ProseMirror) {
		color: #c0caf5;
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.1rem;
		line-height: 1.9;
		padding: 2rem;
		min-height: 500px;
	}

	.editor-container :global(.ProseMirror:focus) {
		outline: none;
	}

	.editor-container :global(.ProseMirror h1) {
		color: #c0caf5;
		font-family: 'Inter', sans-serif;
	}

	.editor-container :global(.ProseMirror h2),
	.editor-container :global(.ProseMirror h3) {
		color: #a9b1d6;
		font-family: 'Inter', sans-serif;
	}

	.editor-container :global(.ProseMirror blockquote) {
		border-left-color: #bb9af7;
		color: #a9b1d6;
	}

	.editor-container :global(.ProseMirror hr) {
		border-top-color: #414868;
	}

	.editor-container :global(.novel-placeholder::before) {
		color: #565f89;
	}

	.editor-container :global(.novel-comment) {
		background: rgba(187, 154, 247, 0.15);
		border-bottom-color: rgba(187, 154, 247, 0.5);
	}

	footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		margin-top: 0.75rem;
		font-size: 0.8rem;
		color: #565f89;
	}

	.stats {
		display: flex;
		gap: 0.5rem;
	}

	.divider {
		opacity: 0.5;
	}

	.saved {
		color: #9ece6a;
	}

	.unsaved {
		color: #565f89;
	}
</style>
