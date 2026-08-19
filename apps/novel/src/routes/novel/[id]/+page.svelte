<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import SmartCTA from '$lib/components/SmartCTA.svelte'
	import AuthorSection from '$lib/components/AuthorSection.svelte'
	import SocialProof from '$lib/components/SocialProof.svelte'
	import ChapterProgressIndicator from '$lib/components/ChapterProgressIndicator.svelte'
	import RelatedNovels from '$lib/components/RelatedNovels.svelte'
	import { novel$, novels$ } from '$lib/data/reactive'
	import { progress$ } from '$lib/data/reactive'
	import { formatReadingTime, getPublishedWordCount, computeUpdateFrequency } from '$lib/data/reading-time'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	const novelId = $derived($page.params.id)
	let novel = $state<NovelMeta | null>(null)
	let allNovels = $state<NovelMeta[]>([])
	let progress = $state(null as any)
	let publishedChapters = $derived(
		novel?.chapters.filter(ch => ch.status === 'final' || ch.status === 'editing').sort((a, b) => a.order - b.order) ?? []
	)
	let totalWords = $derived(novel ? getPublishedWordCount(novel) : 0)
	let readingTime = $derived(formatReadingTime(totalWords))
	let updateFreq = $derived(novel ? computeUpdateFrequency(novel) : null)

	onMount(() => {
		const sub1 = novel$(novelId).subscribe(n => { novel = n })
		const sub2 = novels$().subscribe(n => { allNovels = n })
		const sub3 = progress$(novelId).subscribe(p => { progress = p })
		return () => { sub1.unsubscribe(); sub2.unsubscribe(); sub3.unsubscribe() }
	})
</script>

<Header variant="reader" />

{#if novel}
	<main class="novel-page">
		<!-- Hero -->
		<section class="hero">
			<div class="cover-wrapper">
				{#if novel.coverUrl}
					<img src={novel.coverUrl} alt="{novel.title} cover" class="cover-image" />
				{:else}
					<div class="cover-placeholder">
						<span>{novel.title.charAt(0)}</span>
					</div>
				{/if}
			</div>

			<div class="hero-info">
				{#if novel.genre}
					<span class="genre">{novel.genre}</span>
				{/if}
				<h1>{novel.title}</h1>
				<p class="author-name">by {novel.author}</p>

				<!-- Stats -->
				<div class="stats">
					<span>{publishedChapters.length} chapters</span>
					<span class="dot">·</span>
					<span>{readingTime}</span>
					<span class="dot">·</span>
					<span>{totalWords.toLocaleString()} words</span>
					{#if updateFreq}
						<span class="dot">·</span>
						<span>{updateFreq}</span>
					{/if}
				</div>

				<!-- Social Proof -->
				<SocialProof novelId={novel.id} />

				{#if novel.synopsis}
					<p class="synopsis">{novel.synopsis}</p>
				{/if}

				<!-- Smart CTA -->
				<SmartCTA {novel} />
			</div>
		</section>

		<!-- Author -->
		<AuthorSection author={novel.author} novelId={novel.id} />

		<!-- Chapters -->
		<section class="chapters" aria-label="Chapter list">
			<h2 class="section-heading">Chapters</h2>
			{#if publishedChapters.length === 0}
				<p class="empty">No published chapters yet. Check back soon.</p>
			{:else}
				<ol class="chapter-list">
					{#each publishedChapters as chapter}
						<li>
							<a href="/novel/{novel.id}/{chapter.order}" class="chapter-row">
								<ChapterProgressIndicator read={!!progress?.chaptersRead[chapter.id]} />
								<span class="chapter-num">{chapter.order}</span>
								<span class="chapter-title">{chapter.title}</span>
								<span class="chapter-time">{formatReadingTime(chapter.wordCount)}</span>
							</a>
						</li>
					{/each}
				</ol>
			{/if}
		</section>

		<!-- Related -->
		<RelatedNovels currentNovel={novel} {allNovels} />
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
		padding-block: var(--spacing-10);
	}

	.not-found, .empty {
		color: var(--text-muted);
		font-style: italic;
	}

	/* Hero */
	.hero {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--spacing-10);
		align-items: start;
	}

	@media (max-width: 768px) {
		.hero {
			grid-template-columns: 1fr;
			justify-items: center;
			text-align: center;
		}
	}

	.cover-wrapper {
		width: clamp(140px, 20vw, 200px);
		aspect-ratio: 2 / 3;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg, 0 8px 24px oklch(0% 0 0 / 0.3));
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
		font-family: var(--font-display);
		font-size: var(--font-size-5xl);
		font-weight: var(--font-weight-extrabold);
		color: var(--text-muted);
		opacity: 0.4;
	}

	.hero-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.genre {
		font-size: var(--font-size-xs);
		font-family: var(--font-family-mono);
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

	.author-name {
		font-size: var(--font-size-base);
		color: var(--text-muted);
		margin-block-end: var(--spacing-2);
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-2);
		font-size: var(--font-size-sm);
		font-family: var(--font-family-mono);
		color: var(--text-muted);
	}

	.dot { opacity: 0.3; }

	.synopsis {
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		color: var(--text-secondary);
		max-width: var(--measure);
		margin-block: var(--spacing-3);
	}

	/* Chapters */
	.chapters {
		margin-block-start: var(--spacing-8);
	}

	.section-heading {
		font-family: var(--font-family-sans);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-block-end: var(--spacing-5);
	}

	.chapter-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.chapter-row {
		display: grid;
		grid-template-columns: 16px 3ch 1fr auto;
		gap: var(--spacing-3);
		align-items: center;
		padding-block: var(--spacing-3);
		border-block-end: 1px solid var(--border-light);
		text-decoration: none;
		transition: transform var(--duration-100) ease;
	}

	.chapter-row:hover {
		transform: translateX(var(--spacing-1));
	}

	.chapter-num {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.chapter-title {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		color: var(--text-primary);
	}

	.chapter-time {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}
</style>
