<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import { getNovel } from '$lib/data/novels'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	const novelId = $derived($page.params.id)
	let novel = $state<NovelMeta | null>(null)
	let totalWords = $derived(novel?.chapters.reduce((sum, ch) => sum + ch.wordCount, 0) ?? 0)

	onMount(() => {
		novel = getNovel(novelId)
	})
</script>

<Header variant="reader" />

{#if novel}
	<main class="novel-page">
		<section class="novel-header">
			<div class="novel-cover">📖</div>
			<div class="novel-info">
				{#if novel.genre}
					<span class="genre-tag">{novel.genre}</span>
				{/if}
				<h1>{novel.title}</h1>
				<p class="author">by {novel.author}</p>
				{#if novel.synopsis}
					<p class="synopsis">{novel.synopsis}</p>
				{/if}
				<div class="novel-stats">
					<span>{novel.chapters.length} chapters</span>
					<span>{totalWords.toLocaleString()} words</span>
				</div>
				{#if novel.chapters.length > 0}
					<a href="/novel/{novel.id}/{novel.chapters[0].order}" class="start-btn">Start Reading</a>
				{/if}
			</div>
		</section>

		<section class="chapters-section">
			<h2>Chapters</h2>
			<div class="chapter-list">
				{#each novel.chapters as chapter}
					{#if chapter.status === 'final' || chapter.status === 'editing'}
						<a href="/novel/{novel.id}/{chapter.order}" class="chapter-row">
							<span class="chapter-num">{chapter.order}</span>
							<span class="chapter-title">{chapter.title}</span>
							<span class="chapter-words">{chapter.wordCount.toLocaleString()}w</span>
						</a>
					{/if}
				{/each}
			</div>
		</section>
	</main>
{:else}
	<main class="novel-page">
		<p class="not-found">Novel not found. <a href="/">← Back to library</a></p>
	</main>
{/if}

<style>
	.novel-page {
		max-width: 800px;
		margin: 0 auto;
		padding: var(--spacing-8);
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

	.novel-header {
		display: flex;
		gap: var(--spacing-8);
		margin-block-end: var(--spacing-12);
		align-items: flex-start;
	}

	.novel-cover {
		width: 160px;
		height: 220px;
		background: var(--background-muted);
		border-radius: var(--radius-xl);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
		flex-shrink: 0;
	}

	.novel-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.genre-tag {
		font-size: var(--font-size-xs);
		background: var(--color-accent-soft);
		color: var(--color-accent-main);
		padding: var(--spacing-0-5) var(--spacing-2-5);
		border-radius: var(--radius-md);
		width: fit-content;
	}

	.novel-info h1 {
		font-size: var(--font-size-4xl);
		font-weight: var(--font-weight-extrabold);
	}

	.author {
		color: var(--text-muted);
		font-size: var(--font-size-base);
	}

	.synopsis {
		color: var(--text-secondary);
		line-height: 1.7;
		margin: 0.5rem 0;
	}

	.novel-stats {
		display: flex;
		gap: var(--spacing-5);
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		font-family: var(--font-family-mono);
	}

	.start-btn {
		display: inline-block;
		margin-block-start: var(--spacing-4);
		padding: var(--spacing-3) var(--spacing-6);
		background: var(--color-accent-main);
		color: var(--background-body);
		border-radius: var(--radius-lg);
		text-decoration: none;
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-sm);
		width: fit-content;
		transition: opacity var(--duration-150) ease;
	}

	.start-btn:hover {
		opacity: 0.9;
	}

	.chapters-section h2 {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		margin-block-end: var(--spacing-4);
	}

	.chapter-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.chapter-row {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
		padding: var(--spacing-3) var(--spacing-4);
		background: var(--background-surface);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: border-color var(--duration-150) ease;
	}

	.chapter-row:hover {
		border-color: var(--color-accent-main);
	}

	.chapter-num {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		font-family: var(--font-family-mono);
		width: 2ch;
	}

	.chapter-title {
		flex: 1;
		font-size: var(--font-size-sm);
	}

	.chapter-words {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		font-family: var(--font-family-mono);
	}
</style>
