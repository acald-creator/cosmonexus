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
		padding: 2rem;
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

	.novel-header {
		display: flex;
		gap: 2rem;
		margin-bottom: 3rem;
		align-items: flex-start;
	}

	.novel-cover {
		width: 160px;
		height: 220px;
		background: var(--surface-raised);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
		flex-shrink: 0;
	}

	.novel-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.genre-tag {
		font-size: 0.75rem;
		background: var(--primary-dim);
		color: var(--primary);
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		width: fit-content;
	}

	.novel-info h1 {
		font-size: 2rem;
		font-weight: 800;
	}

	.author {
		color: var(--muted);
		font-size: 0.95rem;
	}

	.synopsis {
		color: var(--text-dim);
		line-height: 1.7;
		margin: 0.5rem 0;
	}

	.novel-stats {
		display: flex;
		gap: 1.25rem;
		font-size: 0.8rem;
		color: var(--muted);
		font-family: var(--font-mono);
	}

	.start-btn {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.7rem 1.5rem;
		background: var(--primary);
		color: var(--bg);
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
		width: fit-content;
		transition: opacity 0.15s;
	}

	.start-btn:hover {
		opacity: 0.9;
	}

	.chapters-section h2 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.chapter-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.chapter-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		text-decoration: none;
		transition: border-color 0.15s;
	}

	.chapter-row:hover {
		border-color: var(--primary);
	}

	.chapter-num {
		font-size: 0.8rem;
		color: var(--muted);
		font-family: var(--font-mono);
		width: 2ch;
	}

	.chapter-title {
		flex: 1;
		font-size: 0.9rem;
	}

	.chapter-words {
		font-size: 0.75rem;
		color: var(--muted);
		font-family: var(--font-mono);
	}
</style>
