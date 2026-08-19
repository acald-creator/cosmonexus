<script lang="ts">
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import { listNovels } from '$lib/data/novels'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	let novels = $state<NovelMeta[]>([])

	onMount(() => {
		novels = listNovels()
	})

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
		<section class="section">
			<h2 class="section-heading">Now Reading</h2>
			<div class="novel-list">
				{#each novels as book}
					<a href="/novel/{book.id}" class="novel-entry">
						<div class="novel-entry-meta">
							{#if book.genre}
								<span class="genre">{book.genre}</span>
							{/if}
							<span class="chapter-count">{book.chapters.length} chapters</span>
						</div>
						<h3 class="novel-entry-title">{book.title}</h3>
						<p class="novel-entry-author">by {book.author}</p>
						{#if book.synopsis}
							<p class="novel-entry-synopsis">{book.synopsis}</p>
						{/if}
					</a>
				{/each}
			</div>
		</section>

		<section class="section">
			<h2 class="section-heading">Browse by Genre</h2>
			<div class="genre-row">
				{#each genres as genre}
					<button class="genre-chip">{genre}</button>
				{/each}
			</div>
		</section>

		<section class="section">
			<h2 class="section-heading">Latest Updates</h2>
			<div class="updates">
				{#each novels.slice(0, 5) as novel}
					{@const lastChapter = novel.chapters[novel.chapters.length - 1]}
					{#if lastChapter}
						<a href="/novel/{novel.id}/{lastChapter.order}" class="update-row">
							<span class="update-novel">{novel.title}</span>
							<span class="update-chapter">Ch {lastChapter.order}: {lastChapter.title}</span>
							<span class="update-author">{novel.author}</span>
						</a>
					{/if}
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
		padding-block-end: var(--space-section);
		border-block-end: 1px solid var(--border-light);
		margin-block-end: var(--space-section);
	}

	.hero h1 {
		font-family: var(--font-display);
		font-size: clamp(var(--font-size-3xl), 5vw, var(--font-size-5xl));
		font-weight: var(--font-weight-extrabold);
		letter-spacing: -0.03em;
		line-height: var(--leading-tight);
		margin-block-end: var(--spacing-3);
	}

	.hero p {
		font-size: var(--font-size-lg);
		color: var(--text-muted);
		max-width: var(--measure-narrow);
	}

	/* ─── Sections ─── */
	.section {
		margin-block-end: var(--space-section);
	}

	.section-heading {
		font-family: var(--font-ui);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-block-end: var(--space-block);
	}

	.empty {
		color: var(--text-muted);
		font-size: var(--font-size-lg);
		padding-block: var(--space-section);
	}

	/* ─── Novel List (editorial, not cards) ─── */
	.novel-list {
		display: flex;
		flex-direction: column;
	}

	.novel-entry {
		display: block;
		padding-block: var(--space-block);
		border-block-end: 1px solid var(--border-light);
		text-decoration: none;
		transition: padding-inline-start var(--motion-state);
	}

	.novel-entry:first-child {
		padding-block-start: 0;
	}

	.novel-entry:hover {
		padding-inline-start: var(--spacing-3);
	}

	.novel-entry-meta {
		display: flex;
		gap: var(--spacing-3);
		font-size: var(--font-size-xs);
		font-family: var(--font-mono);
		color: var(--text-muted);
		margin-block-end: var(--spacing-2);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.genre {
		color: var(--color-accent-main);
	}

	.novel-entry-title {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-bold);
		line-height: var(--leading-tight);
		color: var(--text-primary);
		margin-block-end: var(--spacing-1);
	}

	.novel-entry-author {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		margin-block-end: var(--spacing-2);
	}

	.novel-entry-synopsis {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		line-height: var(--line-height-relaxed);
		max-width: var(--measure);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
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
		transition: border-color var(--motion-micro), color var(--motion-micro), background-color var(--motion-micro);
	}

	.genre-chip:hover {
		border-color: var(--color-accent-main);
		color: var(--color-accent-main);
	}

	.genre-chip:focus-visible {
		outline: 2px solid var(--focus-ring, var(--color-accent-main));
		outline-offset: 2px;
	}

	/* ─── Updates ─── */
	.updates {
		display: flex;
		flex-direction: column;
	}

	.update-row {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: var(--spacing-4);
		align-items: baseline;
		padding-block: var(--spacing-3);
		border-block-end: 1px solid var(--border-light);
		text-decoration: none;
		font-size: var(--font-size-sm);
		transition: padding-inline-start var(--motion-micro);
	}

	.update-row:hover {
		padding-inline-start: var(--spacing-2);
	}

	.update-novel {
		font-weight: var(--font-weight-medium);
		color: var(--text-primary);
	}

	.update-chapter {
		color: var(--text-secondary);
	}

	.update-author {
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
	}
</style>
