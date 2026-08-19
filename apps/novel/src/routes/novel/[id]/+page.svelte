<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import { getNovel } from '$lib/data/novels'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	const novelId = $derived($page.params.id)
	let novel = $state<NovelMeta | null>(null)
	let totalWords = $derived(novel?.chapters.reduce((sum, ch) => sum + ch.wordCount, 0) ?? 0)
	let publishedChapters = $derived(novel?.chapters.filter(ch => ch.status === 'final' || ch.status === 'editing') ?? [])

	onMount(() => {
		novel = getNovel(novelId)
	})
</script>

<Header variant="reader" />

{#if novel}
	<main class="novel-page">
		<!-- Hero: Cover + Info -->
		<section class="hero">
			<div class="cover-wrapper">
				{#if novel.coverUrl}
					<img src={novel.coverUrl} alt="{novel.title} cover" class="cover-image" />
				{:else}
					<div class="cover-placeholder">
						<span class="cover-initial">{novel.title.charAt(0)}</span>
					</div>
				{/if}
			</div>

			<div class="hero-info">
				{#if novel.genre}
					<span class="genre">{novel.genre}</span>
				{/if}
				<h1>{novel.title}</h1>
				<p class="author">by {novel.author}</p>

				<div class="stats">
					<span class="stat">{publishedChapters.length} chapters</span>
					<span class="stat-divider">·</span>
					<span class="stat">{totalWords.toLocaleString()} words</span>
				</div>

				{#if novel.synopsis}
					<p class="synopsis">{novel.synopsis}</p>
				{/if}

				{#if publishedChapters.length > 0}
					<a href="/novel/{novel.id}/{publishedChapters[0].order}" class="cta">
						Start Reading
					</a>
				{/if}
			</div>
		</section>

		<!-- Chapter List -->
		<section class="chapters">
			<h2 class="chapters-heading">Chapters</h2>
			<ol class="chapter-list">
				{#each publishedChapters as chapter, i}
					<li>
						<a href="/novel/{novel.id}/{chapter.order}" class="chapter-row">
							<span class="chapter-num">{chapter.order}</span>
							<span class="chapter-title">{chapter.title}</span>
							<span class="chapter-words">{chapter.wordCount.toLocaleString()} words</span>
						</a>
					</li>
				{/each}
			</ol>
			{#if publishedChapters.length === 0}
				<p class="no-chapters">No published chapters yet. Check back soon.</p>
			{/if}
		</section>
	</main>
{:else}
	<main class="novel-page">
		<p class="not-found">Novel not found. <a href="/">Return to library</a></p>
	</main>
{/if}

<style>
	.novel-page {
		max-width: var(--measure-wide, 80ch);
		margin-inline: auto;
		padding-inline: var(--space-page);
		padding-block: var(--space-section);
	}

	.not-found {
		text-align: center;
		color: var(--text-muted);
		padding-block: var(--space-section);
	}

	/* ─── Hero ─── */
	.hero {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--spacing-10);
		align-items: start;
		padding-block-end: var(--space-section);
		border-block-end: 1px solid var(--border-light);
		margin-block-end: var(--space-section);
	}

	@container (max-width: 600px) {
		.hero {
			grid-template-columns: 1fr;
			justify-items: center;
			text-align: center;
		}
	}

	/* ─── Cover ─── */
	.cover-wrapper {
		width: clamp(140px, 20vw, 200px);
		aspect-ratio: 2 / 3;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg, 0 8px 24px oklch(0% 0 0 / 0.3));
		flex-shrink: 0;
	}

	.cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cover-placeholder {
		width: 100%;
		height: 100%;
		background: var(--background-elevated);
		display: grid;
		place-items: center;
	}

	.cover-initial {
		font-family: var(--font-display);
		font-size: var(--font-size-5xl);
		font-weight: var(--font-weight-extrabold);
		color: var(--text-muted);
		opacity: 0.5;
	}

	/* ─── Info ─── */
	.hero-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.genre {
		font-size: var(--font-size-xs);
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-accent-main);
	}

	.hero-info h1 {
		font-family: var(--font-display);
		font-size: clamp(var(--font-size-3xl), 4vw, var(--font-size-5xl));
		font-weight: var(--font-weight-extrabold);
		line-height: var(--leading-tight, 1.2);
		letter-spacing: -0.03em;
	}

	.author {
		font-size: var(--font-size-base);
		color: var(--text-muted);
	}

	.stats {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		font-size: var(--font-size-sm);
		font-family: var(--font-mono);
		color: var(--text-muted);
		margin-block: var(--spacing-2);
	}

	.stat-divider {
		opacity: 0.4;
	}

	.synopsis {
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		color: var(--text-secondary);
		max-width: var(--measure);
		margin-block: var(--spacing-3);
	}

	.cta {
		display: inline-block;
		margin-block-start: var(--spacing-4);
		padding: var(--spacing-3) var(--spacing-6);
		background: var(--color-accent-main);
		color: var(--background-body);
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-sm);
		border-radius: var(--radius-lg);
		text-decoration: none;
		width: fit-content;
		transition: opacity var(--motion-micro);
	}

	.cta:hover {
		opacity: 0.85;
		color: var(--background-body);
	}

	/* ─── Chapters ─── */
	.chapters-heading {
		font-family: var(--font-ui, var(--font-family-sans));
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-block-end: var(--spacing-6);
	}

	.chapter-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.chapter-row {
		display: grid;
		grid-template-columns: 3ch 1fr auto;
		gap: var(--spacing-4);
		align-items: baseline;
		padding-block: var(--spacing-3);
		border-block-end: 1px solid var(--border-light);
		text-decoration: none;
		transition: transform var(--motion-micro);
	}

	.chapter-row:hover {
		transform: translateX(var(--spacing-2));
	}

	.chapter-num {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.chapter-title {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		color: var(--text-primary);
	}

	.chapter-words {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.no-chapters {
		color: var(--text-muted);
		font-style: italic;
	}
</style>
