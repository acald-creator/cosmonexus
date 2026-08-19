<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { RichEditor } from '@cosmonexus/nova-svelte'
	import { getNovel } from '$lib/data/novels'
	import { getChapterMeta, getChapterContent, saveChapterContent } from '$lib/data/chapters'
	import type { ChapterMeta, DocumentJSON } from '@cosmonexus/nova-types'

	const bookId = $derived($page.params.bookId)
	const chapterId = $derived($page.params.chapterId)

	let chapterMeta = $state<ChapterMeta | null>(null)
	let initialContent = $state<DocumentJSON | undefined>(undefined)
	let wordCount = $state({ words: 0, characters: 0 })
	let lastSaved = $state('')
	let isFocused = $state(false)
	let editorRef = $state<any>(undefined)
	let novelTitle = $state('')

	let percentage = $derived(
		chapterMeta?.targetWordCount
			? Math.min(100, Math.round((wordCount.words / chapterMeta.targetWordCount) * 100))
			: 0
	)

	onMount(() => {
		const novel = getNovel(bookId)
		if (novel) novelTitle = novel.title

		chapterMeta = getChapterMeta(bookId, chapterId)
		const content = getChapterContent(bookId, chapterId)
		if (content) {
			initialContent = content
		}
	})

	function handleUpdate(event: any) {
		wordCount = event.detail.wordCount
	}

	function handleReady(event: any) {
		editorRef = event.detail.editor
	}

	function save() {
		if (!editorRef) return
		const json = editorRef.getJSON()
		saveChapterContent(bookId, chapterId, json, wordCount.words)
		lastSaved = new Date().toLocaleTimeString()
	}

	function toggleBold() { editorRef?.toggleBold(); editorRef?.focus() }
	function toggleItalic() { editorRef?.toggleItalic(); editorRef?.focus() }
	function toggleUnderline() { editorRef?.toggleUnderline(); editorRef?.focus() }
	function insertSceneBreak() { editorRef?.insertSceneBreak(); editorRef?.focus() }
</script>

<header class="editor-header">
	<div class="header-left">
		<a href="/author/{bookId}" class="back-link">← Back</a>
		{#if chapterMeta}
			<span class="chapter-info">Ch {chapterMeta.order}: {chapterMeta.title}</span>
			<span class="status-badge {chapterMeta.status}">{chapterMeta.status}</span>
		{/if}
	</div>
	<div class="header-right">
		<button onclick={save} class="save-btn">Save</button>
	</div>
</header>

<div class="toolbar">
	<div class="format-group">
		<button onclick={toggleBold} class="tb" title="Bold (Cmd+B)"><strong>B</strong></button>
		<button onclick={toggleItalic} class="tb" title="Italic (Cmd+I)"><em>I</em></button>
		<button onclick={toggleUnderline} class="tb" title="Underline (Cmd+U)"><u>U</u></button>
		<span class="tb-divider"></span>
		<button onclick={insertSceneBreak} class="tb" title="Scene Break">—</button>
	</div>
</div>

<main class="editor-area" class:focused={isFocused}>
	{#if initialContent !== undefined || chapterMeta}
		<RichEditor
			content={initialContent}
			placeholder="Begin writing..."
			on:update={handleUpdate}
			on:focus={() => isFocused = true}
			on:blur={() => isFocused = false}
			on:ready={handleReady}
		/>
	{/if}
</main>

<footer class="editor-footer">
	<div class="footer-left">
		<span>{wordCount.words.toLocaleString()}{chapterMeta?.targetWordCount ? ` / ${chapterMeta.targetWordCount.toLocaleString()}` : ''} words</span>
		{#if chapterMeta?.targetWordCount}
			<div class="mini-progress">
				<div class="mini-fill" style:width="{percentage}%"></div>
			</div>
			<span class="percent">{percentage}%</span>
		{/if}
	</div>
	<div class="footer-right">
		{#if lastSaved}
			<span class="saved">Saved {lastSaved}</span>
		{:else}
			<span class="unsaved">Unsaved</span>
		{/if}
	</div>
</footer>

<style>
	.editor-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 1.5rem;
		border-bottom: 1px solid var(--border);
		background: var(--surface);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.back-link {
		color: var(--primary);
		text-decoration: none;
		font-size: 0.85rem;
	}

	.chapter-info {
		font-size: 0.9rem;
		font-weight: 600;
	}

	.status-badge {
		font-size: 0.65rem;
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
		text-transform: capitalize;
	}

	.status-badge.draft { background: rgba(224, 175, 104, 0.15); color: var(--warning); }
	.status-badge.revision { background: rgba(187, 154, 247, 0.15); color: var(--secondary); }
	.status-badge.editing { background: rgba(122, 162, 247, 0.15); color: var(--primary); }
	.status-badge.final { background: rgba(158, 206, 106, 0.15); color: var(--success); }

	.header-right {
		display: flex;
		gap: 0.5rem;
	}

	.save-btn {
		padding: 0.4rem 0.9rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-dim);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.save-btn:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.toolbar {
		padding: 0.4rem 1.5rem;
		border-bottom: 1px solid var(--border);
		background: var(--surface);
	}

	.format-group {
		display: flex;
		gap: 0.2rem;
		align-items: center;
	}

	.tb {
		width: 30px;
		height: 30px;
		border-radius: 5px;
		border: none;
		background: transparent;
		color: var(--text-dim);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		transition: background 0.15s;
	}

	.tb:hover {
		background: var(--surface-raised);
	}

	.tb-divider {
		width: 1px;
		height: 18px;
		background: var(--border);
		margin: 0 0.3rem;
	}

	.editor-area {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		border-left: 3px solid transparent;
		transition: border-color 0.2s;
	}

	.editor-area.focused {
		border-left-color: var(--primary);
	}

	.editor-area :global(.nova-rich-editor) {
		max-width: 680px;
		margin: 0 auto;
		min-height: calc(100vh - 180px);
	}

	.editor-area :global(.ProseMirror) {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		line-height: 1.9;
		color: var(--text-dim);
		padding: 3rem 2rem;
		min-height: calc(100vh - 180px);
	}

	.editor-area :global(.ProseMirror:focus) {
		outline: none;
	}

	.editor-area :global(.ProseMirror h1),
	.editor-area :global(.ProseMirror h2),
	.editor-area :global(.ProseMirror h3) {
		font-family: var(--font-sans);
		color: var(--text);
	}

	.editor-area :global(.ProseMirror blockquote) {
		border-left-color: var(--secondary);
		color: var(--text-dim);
	}

	.editor-area :global(.novel-placeholder::before) {
		color: var(--muted);
	}

	.editor-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1.5rem;
		border-top: 1px solid var(--border);
		background: var(--surface);
		font-size: 0.8rem;
		color: var(--muted);
	}

	.footer-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-mono);
	}

	.mini-progress {
		width: 80px;
		height: 4px;
		background: var(--bg);
		border-radius: 2px;
		overflow: hidden;
	}

	.mini-fill {
		height: 100%;
		background: var(--primary);
		border-radius: 2px;
		transition: width 0.3s;
	}

	.percent {
		font-size: 0.75rem;
	}

	.saved {
		color: var(--success);
	}

	.unsaved {
		color: var(--muted);
	}
</style>
