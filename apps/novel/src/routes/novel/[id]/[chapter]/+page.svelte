<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { getNovel } from '$lib/data/novels'
	import { getChapterContent } from '$lib/data/chapters'
	import type { NovelMeta, DocumentJSON } from '@cosmonexus/nova-types'

	const novelId = $derived($page.params.id)
	const chapterOrder = $derived(Number($page.params.chapter))

	let novel = $state<NovelMeta | null>(null)
	let content = $state<DocumentJSON | null>(null)
	let renderedHtml = $state('')

	const chapter = $derived(novel?.chapters.find((ch) => ch.order === chapterOrder) ?? null)
	const totalChapters = $derived(novel?.chapters.length ?? 0)
	const prevOrder = $derived(chapterOrder > 1 ? chapterOrder - 1 : null)
	const nextOrder = $derived(chapterOrder < totalChapters ? chapterOrder + 1 : null)

	onMount(() => {
		novel = getNovel(novelId)
		if (novel && chapter) {
			content = getChapterContent(novelId, chapter.id)
			if (content) {
				renderedHtml = renderContent(content)
			}
		}
	})

	// Simple JSON-to-HTML renderer for the reading view
	function renderContent(doc: DocumentJSON): string {
		if (!doc.content) return ''
		return doc.content.map(renderNode).join('')
	}

	function renderNode(node: any): string {
		switch (node.type) {
			case 'paragraph':
				return `<p>${renderInline(node.content)}</p>`
			case 'heading': {
				const level = node.attrs?.level ?? 1
				return `<h${level}>${renderInline(node.content)}</h${level}>`
			}
			case 'blockquote':
				return `<blockquote>${(node.content ?? []).map(renderNode).join('')}</blockquote>`
			case 'scene_break':
				return '<hr />'
			case 'bullet_list':
				return `<ul>${(node.content ?? []).map(renderNode).join('')}</ul>`
			case 'ordered_list':
				return `<ol>${(node.content ?? []).map(renderNode).join('')}</ol>`
			case 'list_item':
				return `<li>${(node.content ?? []).map(renderNode).join('')}</li>`
			case 'hard_break':
				return '<br />'
			default:
				if (node.content) return (node.content ?? []).map(renderNode).join('')
				return ''
		}
	}

	function renderInline(nodes: any[]): string {
		if (!nodes) return ''
		return nodes.map((node) => {
			if (node.type === 'text') {
				let text = escapeHtml(node.text ?? '')
				if (node.marks) {
					for (const mark of node.marks) {
						switch (mark.type) {
							case 'bold': text = `<strong>${text}</strong>`; break
							case 'italic': text = `<em>${text}</em>`; break
							case 'underline': text = `<u>${text}</u>`; break
							case 'strikethrough': text = `<s>${text}</s>`; break
							case 'code': text = `<code>${text}</code>`; break
							case 'link': text = `<a href="${escapeHtml(mark.attrs?.href ?? '')}">${text}</a>`; break
						}
					}
				}
				return text
			}
			if (node.type === 'hard_break') return '<br />'
			return ''
		}).join('')
	}

	function escapeHtml(str: string): string {
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
	}
</script>

<header class="reader-header">
	<a href="/novel/{novelId}" class="back-link">← {novel?.title ?? 'Back'}</a>
	<span class="novel-title">{novel?.title ?? ''}</span>
	<div class="reader-controls">
		<button class="control-btn" aria-label="Font settings">Aa</button>
		<button class="control-btn" aria-label="Dark mode">🌙</button>
	</div>
</header>

{#if chapter}
	<main class="reader">
		<article class="chapter-content">
			<div class="chapter-heading">
				<span class="chapter-label">Chapter {chapter.order}</span>
				<h1>{chapter.title}</h1>
			</div>

			<div class="prose">
				{@html renderedHtml}
			</div>
		</article>

		<nav class="chapter-nav">
			{#if prevOrder}
				<a href="/novel/{novelId}/{prevOrder}" class="nav-btn prev">← Previous</a>
			{:else}
				<span></span>
			{/if}
			<span class="chapter-progress">{chapterOrder} / {totalChapters}</span>
			{#if nextOrder}
				<a href="/novel/{novelId}/{nextOrder}" class="nav-btn next">Next →</a>
			{:else}
				<span class="nav-btn end">End</span>
			{/if}
		</nav>
	</main>
{:else}
	<main class="reader">
		<p class="not-found">Chapter not found. <a href="/novel/{novelId}">← Back to novel</a></p>
	</main>
{/if}

<style>
	.reader-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-3) var(--spacing-8);
		border-bottom: 1px solid var(--border-light);
		background: var(--background-surface);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.back-link {
		color: var(--color-accent-main);
		text-decoration: none;
		font-size: var(--font-size-sm);
	}

	.novel-title {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}

	.reader-controls {
		display: flex;
		gap: var(--spacing-1);
	}

	.control-btn {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-light);
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-sm);
	}

	.control-btn:hover {
		background: var(--background-muted);
	}

	.reader {
		max-width: 680px;
		margin: 0 auto;
		padding: var(--spacing-12) var(--spacing-8);
	}

	.not-found {
		color: var(--text-muted);
		text-align: center;
		padding: 4rem 0;
	}

	.not-found a {
		color: var(--color-accent-main);
		text-decoration: none;
	}

	.chapter-heading {
		text-align: center;
		margin-block-end: var(--spacing-12);
	}

	.chapter-label {
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.chapter-heading h1 {
		font-size: var(--font-size-4xl);
		font-weight: var(--font-weight-bold);
		font-family: var(--font-family-display);
		margin-block-start: var(--spacing-1);
	}

	.prose {
		font-family: var(--font-family-display);
		font-size: var(--font-size-lg);
		line-height: 1.9;
		color: var(--text-secondary);
	}

	.prose :global(p) {
		margin-bottom: 1.25em;
		text-indent: 1.5em;
	}

	.prose :global(p:first-child) {
		text-indent: 0;
	}

	.prose :global(h1), .prose :global(h2), .prose :global(h3) {
		font-family: var(--font-family-sans);
		color: var(--text-primary);
		margin: 2em 0 0.5em;
		text-indent: 0;
	}

	.prose :global(blockquote) {
		border-left: 3px solid var(--color-accent-pink);
		padding-left: 1em;
		color: var(--text-secondary);
		font-style: italic;
		margin: 1.5em 0;
	}

	.prose :global(hr) {
		border: none;
		border-top: 1px solid var(--border-light);
		margin: 2.5em auto;
		width: 40%;
	}

	.chapter-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-block: var(--spacing-8);
		margin-block-start: var(--spacing-12);
		border-top: 1px solid var(--border-light);
	}

	.nav-btn {
		padding: var(--spacing-2) var(--spacing-4);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-light);
		text-decoration: none;
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		transition: border-color var(--duration-150) ease, color var(--duration-150) ease;
	}

	.nav-btn:hover {
		border-color: var(--color-accent-main);
		color: var(--color-accent-main);
	}

	.nav-btn.end {
		color: var(--text-muted);
		border-color: transparent;
	}

	.chapter-progress {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		font-family: var(--font-family-mono);
	}
</style>
