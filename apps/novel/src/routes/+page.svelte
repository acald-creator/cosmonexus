<script lang="ts">
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import NovelCard from '$lib/components/NovelCard.svelte'
	import GenreFilter from '$lib/components/GenreFilter.svelte'
	import CollectionShelf from '$lib/components/CollectionShelf.svelte'
	import CoverGrid from '$lib/components/CoverGrid.svelte'
	import SmartCTA from '$lib/components/SmartCTA.svelte'
	import { listNovels } from '$lib/data/novels'
	import { getNewThisWeek, getStaffPicks, getCompletedSeries, getRisingAuthors } from '$lib/data/collections'
	import { formatReadingTime, getPublishedWordCount } from '$lib/data/reading-time'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	let novels = $state<NovelMeta[]>([])
	let selectedGenre = $state<string | null>(null)

	onMount(() => {
		novels = listNovels()
	})

	const availableGenres = $derived([...new Set(novels.map(n => n.genre).filter(Boolean))] as string[])
	const filteredNovels = $derived(selectedGenre ? novels.filter(n => n.genre === selectedGenre) : novels)
	const featured = $derived(filteredNovels[0] ?? null)
	const newThisWeek = $derived(getNewThisWeek(novels))
	const staffPicks = $derived(getStaffPicks(novels))
	const completedSeries = $derived(getCompletedSeries(novels))
	const risingAuthors = $derived(getRisingAuthors(novels))
</script>

<Header variant="reader" />

<main class="library">
	<!-- Hero -->
	<section class="hero">
		<h1>Stories worth your time</h1>
		<p>Serialized fiction from independent authors. Read chapter by chapter.</p>
	</section>

	{#if novels.length === 0}
		<p class="empty">Nothing here yet. <a href="/author">Start writing</a></p>
	{:else}
		<!-- Featured Novel -->
		{#if featured}
			<section class="featured" aria-label="Featured novel">
				<a href="/novel/{featured.id}" class="featured-card">
					<div class="featured-cover">
						{#if featured.coverUrl}
							<img src={featured.coverUrl} alt="{featured.title} cover" />
						{:else}
							<div class="cover-placeholder"><span>{featured.title.charAt(0)}</span></div>
						{/if}
					</div>
					<div class="featured-info">
						{#if featured.genre}
							<span class="label">{featured.genre}</span>
						{/if}
						<h2 class="featured-title">{featured.title}</h2>
						<p class="featured-author">by {featured.author}</p>
						{#if featured.synopsis}
							<p class="featured-synopsis">{featured.synopsis}</p>
						{/if}
						<span class="featured-meta">
							{featured.chapters.length} chapters · {formatReadingTime(getPublishedWordCount(featured))}
						</span>
						<SmartCTA novel={featured} />
					</div>
				</a>
			</section>
		{/if}

		<!-- New This Week -->
		{#if newThisWeek.length > 0 && !selectedGenre}
			<CollectionShelf title="New This Week" novels={newThisWeek} />
		{/if}

		<!-- Genre Filter -->
		<section class="filter-section">
			<h2 class="section-heading">Browse</h2>
			<GenreFilter genres={availableGenres} selected={selectedGenre} onSelect={(g) => selectedGenre = g} />
		</section>

		<!-- Cover Grid -->
		<section class="grid-section" aria-label="All novels">
			<CoverGrid novels={filteredNovels} />
		</section>

		<!-- Collection Shelves (hidden when filtering) -->
		{#if !selectedGenre}
			<CollectionShelf title="Staff Picks" novels={staffPicks} />
			<CollectionShelf title="Completed Series" novels={completedSeries} />
			<CollectionShelf title="Rising Authors" novels={risingAuthors} />
		{/if}

		<!-- Author CTA -->
		<section class="author-cta">
			<p>Have a story to tell?</p>
			<a href="/author" class="cta-link">Start writing →</a>
		</section>
	{/if}
</main>

<style>
	.library {
		max-width: var(--measure-wide, 80ch);
		margin-inline: auto;
		padding-inline: var(--space-page);
		padding-block: var(--spacing-10);
	}

	/* Hero */
	.hero {
		margin-block-end: var(--spacing-12);
	}

	.hero h1 {
		font-family: var(--font-display);
		font-size: clamp(var(--font-size-3xl), 5vw, var(--font-size-5xl));
		font-weight: var(--font-weight-extrabold);
		letter-spacing: -0.03em;
		line-height: var(--leading-tight, 1.2);
		margin-block-end: var(--spacing-2);
	}

	.hero p {
		font-size: var(--font-size-lg);
		color: var(--text-muted);
		max-width: var(--measure-narrow, 45ch);
	}

	.empty {
		color: var(--text-muted);
		font-size: var(--font-size-lg);
		padding-block: var(--spacing-16);
	}

	/* Featured */
	.featured {
		margin-block-end: var(--spacing-12);
		padding-block-end: var(--spacing-12);
		border-block-end: 1px solid var(--border-light);
	}

	.featured-card {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--spacing-8);
		align-items: start;
		text-decoration: none;
	}

	@media (max-width: 768px) {
		.featured-card {
			grid-template-columns: 1fr;
			justify-items: center;
			text-align: center;
		}
	}

	.featured-cover {
		width: clamp(130px, 18vw, 180px);
		aspect-ratio: 2 / 3;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-md);
	}

	.featured-cover img {
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
		font-family: var(--font-family-display);
		font-size: var(--font-size-4xl);
		font-weight: var(--font-weight-extrabold);
		color: var(--text-muted);
		opacity: 0.4;
	}

	.featured-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
		padding-block-start: var(--spacing-2);
	}

	.label {
		font-size: var(--font-size-xs);
		font-family: var(--font-family-mono);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-accent-main);
	}

	.featured-title {
		font-family: var(--font-display);
		font-size: var(--font-size-3xl);
		font-weight: var(--font-weight-bold);
		line-height: var(--leading-tight, 1.2);
		letter-spacing: -0.02em;
		color: var(--text-primary);
	}

	.featured-author {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}

	.featured-synopsis {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-relaxed);
		color: var(--text-secondary);
		margin-block: var(--spacing-2);
		max-width: var(--measure);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.featured-meta {
		font-size: var(--font-size-xs);
		font-family: var(--font-family-mono);
		color: var(--text-muted);
		margin-block-end: var(--spacing-3);
	}

	/* Sections */
	.filter-section {
		margin-block-end: var(--spacing-8);
	}

	.section-heading {
		font-family: var(--font-family-sans);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-block-end: var(--spacing-4);
	}

	.grid-section {
		margin-block-end: var(--spacing-12);
	}

	/* Author CTA */
	.author-cta {
		margin-block-start: var(--spacing-12);
		padding-block: var(--spacing-8);
		border-block-start: 1px solid var(--border-light);
		text-align: center;
	}

	.author-cta p {
		font-size: var(--font-size-base);
		color: var(--text-muted);
		margin-block-end: var(--spacing-2);
	}

	.cta-link {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-accent-main);
		text-decoration: none;
	}

	.cta-link:hover {
		text-decoration: underline;
	}
</style>
