<script lang="ts">
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import { listNovels } from '$lib/data/novels'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	let novels = $state<NovelMeta[]>([])

	onMount(() => {
		novels = listNovels()
	})

	const featured = $derived(novels[0] ?? null)
	const rest = $derived(novels.slice(1))
	const genres = ['Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Literary']
</script>

<Header variant="reader" />

<main class="library">
	<section class="hero">
		<h1>Stories worth your time</h1>
		<p>Serialized fiction from independent authors. Read chapter by chapter.</p>
	</section>

	{#if novels.length === 0}
		<p class="empty">Nothing here yet. <a href="/author">Start writing</a></p>
	{:else}
		<!-- Featured Novel (cover-forward) -->
		{#if featured}
			<section class="featured">
				<a href="/novel/{featured.id}" class="featured-card">
					<div class="featured-cover">
						{#if featured.coverUrl}
							<img src={featured.coverUrl} alt="{featured.title} cover" />
						{:else}
							<div class="cover-placeholder">
								<span>{featured.title.charAt(0)}</span>
							</div>
						{/if}
					</div>
					<div class="featured-info">
						{#if featured.genre}
							<span class="genre">{featured.genre}</span>
						{/if}
						<h2 class="featured-title">{featured.title}</h2>
						<p class="featured-author">by {featured.author}</p>
						{#if featured.synopsis}
							<p class="featured-synopsis">{featured.synopsis}</p>
						{/if}
						<span class="featured-meta">{featured.chapters.length} chapters · {featured.chapters.reduce((s, c) => s + c.wordCount, 0).toLocaleString()} words</span>
					</div>
				</a>
			</section>
		{/if}

		<!-- More Novels (list with thumbnail) -->
		{#if rest.length > 0}
			<section class="section">
				<h2 class="section-heading">More to Read</h2>
				<div class="novel-list">
					{#each rest as book}
						<a href="/novel/{book.id}" class="novel-row">
							<div class="novel-thumb">
								{#if book.coverUrl}
									<img src={book.coverUrl} alt="" />
								{:else}
									<div class="thumb-placeholder">{book.title.charAt(0)}</div>
								{/if}
							</div>
							<div class="novel-row-info">
								<h3>{book.title}</h3>
								<span class="novel-row-author">{book.author}</span>
							</div>
							<span class="novel-row-meta">{book.chapters.length} ch</span>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Genres -->
		<section class="section">
			<h2 class="section-heading">Browse by Genre</h2>
			<div class="genre-row">
				{#each genres as genre}
					<button class="genre-chip">{genre}</button>
				{/each}
			</div>
		</section>
	{/if}
</main>

<style>
	.library {
		max-width: var(--measure-wide, 80ch);
		margin-inline: auto;
		padding-inline: var(--space-page);
		padding-block: var(--space-section);
	}

	/* ─── Hero ─── */
	.hero {
		padding-block-end: var(--space-block);
		margin-block-end: var(--space-section);
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
		padding-block: var(--space-section);
	}

	/* ─── Featured Novel ─── */
	.featured {
		margin-block-end: var(--space-section);
		padding-block-end: var(--space-section);
		border-block-end: 1px solid var(--border-light);
	}

	.featured-card {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--spacing-8);
		align-items: start;
		text-decoration: none;
		transition: opacity var(--motion-micro);
	}

	.featured-card:hover {
		opacity: 0.9;
	}

	.featured-cover {
		width: clamp(120px, 18vw, 180px);
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
		font-family: var(--font-display);
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

	.genre {
		font-size: var(--font-size-xs);
		font-family: var(--font-mono);
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
		margin-block-start: var(--spacing-2);
		max-width: var(--measure);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.featured-meta {
		font-size: var(--font-size-xs);
		font-family: var(--font-mono);
		color: var(--text-muted);
		margin-block-start: var(--spacing-3);
	}

	/* ─── Novel List (with thumbnail) ─── */
	.section {
		margin-block-end: var(--space-section);
	}

	.section-heading {
		font-family: var(--font-ui, var(--font-family-sans));
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-block-end: var(--spacing-6);
	}

	.novel-list {
		display: flex;
		flex-direction: column;
	}

	.novel-row {
		display: grid;
		grid-template-columns: 48px 1fr auto;
		gap: var(--spacing-4);
		align-items: center;
		padding-block: var(--spacing-3);
		border-block-end: 1px solid var(--border-light);
		text-decoration: none;
		transition: transform var(--motion-micro);
	}

	.novel-row:hover {
		transform: translateX(var(--spacing-1));
	}

	.novel-thumb {
		width: 48px;
		aspect-ratio: 2 / 3;
		border-radius: var(--radius-sm);
		overflow: hidden;
		background: var(--background-muted);
	}

	.novel-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumb-placeholder {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		font-family: var(--font-display);
		font-weight: var(--font-weight-bold);
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.novel-row-info h3 {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		color: var(--text-primary);
		line-height: var(--line-height-tight);
	}

	.novel-row-author {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.novel-row-meta {
		font-size: var(--font-size-xs);
		font-family: var(--font-mono);
		color: var(--text-muted);
	}

	/* ─── Genres ─── */
	.genre-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
	}

	.genre-chip {
		padding: var(--spacing-2) var(--spacing-4);
		border-radius: var(--radius-full);
		border: 1px solid var(--border-light);
		background: transparent;
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		cursor: pointer;
		transition: border-color var(--motion-micro), color var(--motion-micro);
	}

	.genre-chip:hover {
		border-color: var(--color-accent-main);
		color: var(--color-accent-main);
	}

	.genre-chip:focus-visible {
		outline: 2px solid var(--focus-ring, var(--color-accent-main));
		outline-offset: 2px;
	}
</style>
