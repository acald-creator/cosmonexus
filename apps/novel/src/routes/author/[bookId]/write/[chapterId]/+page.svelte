<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { RichEditor } from '@cosmonexus/nova-svelte'
	import { getNovel } from '$lib/data/novels'
	import { getChapterMeta, getChapterContent, saveChapterContent } from '$lib/data/chapters'
	import { transitionChapter, getNextStatuses, STATUS_META } from '$lib/data/publishing'
	import type { ChapterMeta, ChapterStatus, DocumentJSON } from '@cosmonexus/nova-types'

	const bookId = $derived($page.params.bookId)
	const chapterId = $derived($page.params.chapterId)

	let chapterMeta = $state<ChapterMeta | null>(null)
	let initialContent = $state<DocumentJSON | undefined>(undefined)
	let wordCount = $state({ words: 0, characters: 0 })
	let lastSaved = $state('')
	let isFocused = $state(false)
	let editorRef = $state<any>(undefined)
	let novelTitle = $state('')
	let showStatusMenu = $state(false)

	let percentage = $derived(
		chapterMeta?.targetWordCount
			? Math.min(100, Math.round((wordCount.words / chapterMeta.targetWordCount) * 100))
			: 0
	)

	let nextStatuses = $derived(
		chapterMeta ? getNextStatuses(chapterMeta.status) : []
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

	function changeStatus(newStatus: ChapterStatus) {
		const result = transitionChapter(bookId, chapterId, newStatus)
		if (result) {
			chapterMeta = getChapterMeta(bookId, chapterId)
		}
		showStatusMenu = false
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
			<div class="status-wrapper">
				<button
					class="status-badge {chapterMeta.status}"
					onclick={() => showStatusMenu = !showStatusMenu}
				>
					{STATUS_META[chapterMeta.status].icon} {STATUS_META[chapterMeta.status].label}
				</button>
				{#if showStatusMenu && nextStatuses.length > 0}
					<div class="status-menu">
						{#each nextStatuses as status}
							<button class="status-option" onclick={() => changeStatus(status)}>
								{STATUS_META[status].icon} Move to {STATUS_META[status].label}
							</button>
						{/each}
					</div>
				{/if}
			</div>
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
		border-bottom: 1px solid var(--border-light);
		background: var(--background-surface);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
	}

	.back-link {
		color: var(--color-accent-main);
		text-decoration: none;
		font-size: var(--font-size-sm);
	}

	.chapter-info {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
	}

	.status-wrapper {
		position: relative;
	}

	.status-badge {
		font-size: var(--font-size-xs);
		padding: var(--spacing-0-5) var(--spacing-2);
		border-radius: var(--radius-md);
		border: 1px solid transparent;
		cursor: pointer;
		text-transform: capitalize;
		transition: border-color var(--duration-150) ease, color var(--duration-150) ease;
	}

	.status-badge.draft { background: rgba(224, 175, 104, 0.15); color: var(--color-warning-text); }
	.status-badge.revision { background: rgba(187, 154, 247, 0.15); color: var(--color-accent-pink); }
	.status-badge.editing { background: rgba(122, 162, 247, 0.15); color: var(--color-accent-main); }
	.status-badge.final { background: rgba(158, 206, 106, 0.15); color: var(--color-success-text); }

	.status-badge:hover {
		border-color: currentColor;
	}

	.status-menu {
		position: absolute;
		top: 100%;
		left: 0;
		margin-block-start: var(--spacing-1);
		background: var(--background-muted);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-md);
		padding: 0.25rem;
		z-index: 50;
		min-width: 160px;
	}

	.status-option {
		display: block;
		width: 100%;
		text-align: left;
		padding: 0.4rem 0.6rem;
		border: none;
		background: transparent;
		color: var(--text-primary);
		font-size: var(--font-size-sm);
		border-radius: var(--radius-md);
		cursor: pointer;
	}

	.status-option:hover {
		background: var(--background-surface);
	}

	.header-right {
		display: flex;
		gap: var(--spacing-2);
	}

	.save-btn {
		padding: var(--spacing-1-5) var(--spacing-4);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-light);
		background: transparent;
		color: var(--text-secondary);
		font-size: var(--font-size-sm);
		cursor: pointer;
		transition: border-color var(--duration-150) ease, color var(--duration-150) ease;
	}

	.save-btn:hover {
		border-color: var(--color-accent-main);
		color: var(--color-accent-main);
	}

	.toolbar {
		padding: 0.4rem 1.5rem;
		border-bottom: 1px solid var(--border-light);
		background: var(--background-surface);
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
		color: var(--text-secondary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-sm);
		transition: background 0.15s;
	}

	.tb:hover {
		background: var(--background-muted);
	}

	.tb-divider {
		width: 1px;
		height: 18px;
		background: var(--border-light);
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
		border-left-color: var(--color-accent-main);
	}

	.editor-area :global(.nova-rich-editor) {
		max-width: 680px;
		margin: 0 auto;
		min-height: calc(100vh - 180px);
	}

	.editor-area :global(.ProseMirror) {
		font-family: var(--font-family-display);
		font-size: var(--font-size-lg);
		line-height: 1.9;
		color: var(--text-secondary);
		padding: var(--spacing-12) var(--spacing-8);
		min-height: calc(100vh - 180px);
	}

	.editor-area :global(.ProseMirror:focus) {
		outline: none;
	}

	.editor-area :global(.ProseMirror h1),
	.editor-area :global(.ProseMirror h2),
	.editor-area :global(.ProseMirror h3) {
		font-family: var(--font-family-sans);
		color: var(--text-primary);
	}

	.editor-area :global(.ProseMirror blockquote) {
		border-left-color: var(--color-accent-pink);
		color: var(--text-secondary);
	}

	.editor-area :global(.novel-placeholder::before) {
		color: var(--text-muted);
	}

	.editor-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1.5rem;
		border-top: 1px solid var(--border-light);
		background: var(--background-surface);
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}

	.footer-left {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		font-family: var(--font-family-mono);
	}

	.mini-progress {
		width: 80px;
		height: 4px;
		background: var(--background-body);
		border-radius: 2px;
		overflow: hidden;
	}

	.mini-fill {
		height: 100%;
		background: var(--color-accent-main);
		border-radius: 2px;
		transition: width 0.3s;
	}

	.percent {
		font-size: var(--font-size-xs);
	}

	.saved {
		color: var(--color-success-text);
	}

	.unsaved {
		color: var(--text-muted);
	}
</style>
