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
		padding: 0.75rem 2rem;
		border-bottom: 1px solid var(--border);
		background: var(--surface);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.back-link {
		color: var(--primary);
		text-decoration: none;
		font-size: 0.85rem;
	}

	.novel-title {
		font-size: 0.85rem;
		color: var(--muted);
	}

	.reader-controls {
		display: flex;
		gap: 0.25rem;
	}

	.control-btn {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-dim);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
	}

	.control-btn:hover {
		background: var(--surface-raised);
	}

	.reader {
		max-width: 680px;
		margin: 0 auto;
		padding: 3rem 2rem;
	}

	.not-found {
		color: var(--muted);
		text-align: center;
		padding: 4rem 0;
	}

	.not-found a {
		color: var(--primary);
		text-decoration: none;
	}

	.chapter-heading {
		text-align: center;
		margin-bottom: 3rem;
	}

	.chapter-label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.chapter-heading h1 {
		font-size: 2rem;
		font-weight: 700;
		font-family: var(--font-serif);
		margin-top: 0.25rem;
	}

	.prose {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		line-height: 1.9;
		color: var(--text-dim);
	}

	.prose :global(p) {
		margin-bottom: 1.25em;
		text-indent: 1.5em;
	}

	.prose :global(p:first-child) {
		text-indent: 0;
	}

	.prose :global(h1), .prose :global(h2), .prose :global(h3) {
		font-family: var(--font-sans);
		color: var(--text);
		margin: 2em 0 0.5em;
		text-indent: 0;
	}

	.prose :global(blockquote) {
		border-left: 3px solid var(--secondary);
		padding-left: 1em;
		color: var(--text-dim);
		font-style: italic;
		margin: 1.5em 0;
	}

	.prose :global(hr) {
		border: none;
		border-top: 1px solid var(--border);
		margin: 2.5em auto;
		width: 40%;
	}

	.chapter-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 0;
		margin-top: 3rem;
		border-top: 1px solid var(--border);
	}

	.nav-btn {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		text-decoration: none;
		font-size: 0.85rem;
		color: var(--text-dim);
		transition: all 0.15s;
	}

	.nav-btn:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.nav-btn.end {
		color: var(--muted);
		border-color: transparent;
	}

	.chapter-progress {
		font-size: 0.8rem;
		color: var(--muted);
		font-family: var(--font-mono);
	}
</style>
