<script lang="ts">
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import { listNovels, getNovelWordCount } from '$lib/data/novels'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	let novels = $state<NovelMeta[]>([])

	onMount(() => {
		novels = listNovels()
	})

	const genres = ['Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Literary', 'Horror']
</script>

<Header variant="reader" />

<main class="library">
	<section class="hero">
		<h1>Discover Stories</h1>
		<p>Read serialized novels from independent authors, one chapter at a time.</p>
	</section>

	<section class="section">
		<h2 class="section-title">Trending Now</h2>
		{#if novels.length === 0}
			<p class="empty">No novels yet. <a href="/author">Start writing!</a></p>
		{:else}
			<div class="book-grid">
				{#each novels as book}
					<a href="/novel/{book.id}" class="book-card">
						<div class="book-cover">
							<span class="cover-emoji">📖</span>
						</div>
						<h3 class="book-title">{book.title}</h3>
						<p class="book-author">by {book.author}</p>
						<div class="book-meta">
							<span>{book.chapters.length} ch</span>
							{#if book.genre}
								<span class="genre-tag">{book.genre}</span>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>

	<section class="section">
		<h2 class="section-title">Genres</h2>
		<div class="genre-list">
			{#each genres as genre}
				<button class="genre-pill">{genre}</button>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Recently Updated</h2>
		<div class="updates-list">
			{#each novels.slice(0, 5) as novel}
				{@const lastChapter = novel.chapters[novel.chapters.length - 1]}
				{#if lastChapter}
					<a href="/novel/{novel.id}/{lastChapter.order}" class="update-card">
						<div class="update-info">
							<span class="update-title">📖 {novel.title} · Ch {lastChapter.order} "{lastChapter.title}"</span>
							<span class="update-meta">by {novel.author}</span>
						</div>
					</a>
				{/if}
			{/each}
		</div>
	</section>
</main>

<style>
	.library {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--spacing-8);
	}

	.hero {
		text-align: center;
		padding-block: var(--spacing-12) var(--spacing-8);
	}

	.hero h1 {
		font-size: var(--font-size-5xl);
		font-weight: var(--font-weight-extrabold);
		margin-block-end: var(--spacing-2);
	}

	.hero p {
		color: var(--text-muted);
		font-size: var(--font-size-lg);
	}

	.section {
		margin-block-end: var(--spacing-12);
	}

	.section-title {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		margin-block-end: var(--spacing-4);
		color: var(--text-secondary);
	}

	.empty {
		color: var(--text-muted);
	}

	.empty a {
		color: var(--color-accent-main);
		text-decoration: none;
	}

	.book-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--spacing-6);
	}

	.book-card {
		background: var(--background-surface);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-xl);
		padding: var(--spacing-5);
		text-decoration: none;
		transition: border-color 0.15s, transform 0.15s;
	}

	.book-card:hover {
		border-color: var(--color-accent-main);
		transform: translateY(-2px);
	}

	.book-cover {
		height: 120px;
		background: var(--background-muted);
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-block-end: var(--spacing-4);
		font-size: var(--font-size-5xl);
	}

	.book-card .book-title {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		margin-block-end: var(--spacing-1);
	}

	.book-author {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		margin-block-end: var(--spacing-2);
	}

	.book-meta {
		display: flex;
		gap: var(--spacing-2);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		font-family: var(--font-family-mono);
	}

	.genre-tag {
		background: var(--color-accent-soft);
		color: var(--color-accent-main);
		padding: var(--spacing-0-5) var(--spacing-1-5);
		border-radius: var(--radius-md);
	}

	.genre-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
	}

	.genre-pill {
		padding: var(--spacing-1-5) var(--spacing-4);
		border-radius: var(--radius-full);
		border: 1px solid var(--border-light);
		background: transparent;
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		cursor: pointer;
		transition: border-color var(--duration-150) ease, color var(--duration-150) ease;
	}

	.genre-pill:hover {
		border-color: var(--color-accent-main);
		color: var(--color-accent-main);
		background: var(--color-accent-soft);
	}

	.updates-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.update-card {
		display: block;
		padding: var(--spacing-4) var(--spacing-5);
		background: var(--background-surface);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: border-color var(--duration-150) ease;
	}

	.update-card:hover {
		border-color: var(--color-accent-main);
	}

	.update-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.update-title {
		font-size: var(--font-size-sm);
	}

	.update-meta {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
</style>
