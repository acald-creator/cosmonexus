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

<header class="reader-bar">
	<a href="/novel/{novelId}" class="back">← {novel?.title ?? 'Back'}</a>
	<span class="chapter-indicator">{chapterOrder} of {totalChapters}</span>
	<div class="controls">
		<button class="control" aria-label="Text settings">Aa</button>
		<button class="control" aria-label="Theme">🌙</button>
	</div>
</header>

{#if chapter}
	<main class="reader-page">
		<article>
			<header class="chapter-header">
				<span class="chapter-number">Chapter {chapter.order}</span>
				<h1 class="chapter-title">{chapter.title}</h1>
			</header>

			<div class="prose">
				{@html renderedHtml}
			</div>
		</article>

		<nav class="chapter-nav" aria-label="Chapter navigation">
			{#if prevOrder}
				<a href="/novel/{novelId}/{prevOrder}" class="nav-link prev">
					<span class="nav-direction">Previous</span>
					<span class="nav-chapter">Chapter {prevOrder}</span>
				</a>
			{:else}
				<span></span>
			{/if}
			{#if nextOrder}
				<a href="/novel/{novelId}/{nextOrder}" class="nav-link next">
					<span class="nav-direction">Next</span>
					<span class="nav-chapter">Chapter {nextOrder}</span>
				</a>
			{:else}
				<div class="end-marker">
					<span>End of novel</span>
				</div>
			{/if}
		</nav>
	</main>
{:else}
	<main class="reader-page">
		<p class="not-found">Chapter not found. <a href="/novel/{novelId}">Return to novel</a></p>
	</main>
{/if}

<style>
	/* ─── Reader Bar ─── */
	.reader-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block: var(--spacing-3);
		padding-inline: var(--space-page);
		border-block-end: 1px solid var(--border-light);
		background: var(--background-surface);
		position: sticky;
		inset-block-start: 0;
		z-index: 10;
	}

	.back {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		text-decoration: none;
		transition: color var(--motion-micro);
	}

	.back:hover { color: var(--text-primary); }

	.chapter-indicator {
		font-size: var(--font-size-xs);
		font-family: var(--font-mono);
		color: var(--text-muted);
		letter-spacing: 0.05em;
	}

	.controls {
		display: flex;
		gap: var(--spacing-1);
	}

	.control {
		width: var(--spacing-8);
		height: var(--spacing-8);
		border-radius: var(--radius-full);
		border: 1px solid var(--border-light);
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		display: grid;
		place-items: center;
		font-size: var(--font-size-sm);
		transition: background-color var(--motion-micro), color var(--motion-micro);
	}

	.control:hover {
		background: var(--background-muted);
		color: var(--text-primary);
	}

	/* ─── Reader Page ─── */
	.reader-page {
		padding-block: var(--space-section);
		padding-inline: var(--space-page);
	}

	.not-found {
		text-align: center;
		color: var(--text-muted);
		padding-block: var(--space-section);
	}

	/* ─── Chapter Header ─── */
	.chapter-header {
		text-align: center;
		margin-block-end: var(--space-section);
		max-width: var(--measure);
		margin-inline: auto;
	}

	.chapter-number {
		display: block;
		font-size: var(--font-size-xs);
		font-family: var(--font-ui);
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-muted);
		margin-block-end: var(--spacing-3);
	}

	.chapter-title {
		font-family: var(--font-display);
		font-size: clamp(var(--font-size-3xl), 4vw, var(--font-size-5xl));
		font-weight: var(--font-weight-bold);
		line-height: var(--leading-tight);
		letter-spacing: -0.03em;
		color: var(--text-primary);
	}

	/* ─── Chapter Navigation ─── */
	.chapter-nav {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		max-width: var(--measure);
		margin-inline: auto;
		margin-block-start: var(--space-section);
		padding-block-start: var(--space-block);
		border-block-start: 1px solid var(--border-light);
	}

	.nav-link {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-0-5);
		padding: var(--spacing-3) var(--spacing-4);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: background-color var(--motion-micro);
	}

	.nav-link:hover {
		background: var(--background-muted);
	}

	.nav-link.next {
		text-align: end;
		margin-inline-start: auto;
	}

	.nav-direction {
		font-size: var(--font-size-xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
	}

	.nav-chapter {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--text-primary);
	}

	.end-marker {
		display: flex;
		align-items: center;
		margin-inline-start: auto;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		font-style: italic;
	}
</style>
