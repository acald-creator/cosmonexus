<script>
	import { page } from '$app/stores'
	import Header from '$lib/components/Header.svelte'

	// Mock — will come from API
	const novel = {
		id: 'last-horizon',
		title: 'The Last Horizon',
		author: 'A. Caldwell',
		synopsis: 'In a world where the sun is dying, one astronaut must journey beyond the edge of known space to find a new home for humanity. But the further she goes, the more she realizes that the universe has secrets far stranger than darkness.',
		genre: 'Sci-Fi',
		rating: 4.7,
		totalReads: 12400,
		chapters: [
			{ id: 1, title: 'The Beginning', words: 4200, published: true },
			{ id: 2, title: 'Rising Action', words: 3800, published: true },
			{ id: 3, title: 'The Crisis', words: 2847, published: true },
			{ id: 4, title: 'Convergence', words: 3100, published: true },
			{ id: 5, title: 'The Descent', words: 4500, published: true },
			{ id: 6, title: 'Revelations', words: 3900, published: true },
			{ id: 7, title: 'Breaking Point', words: 4100, published: true },
			{ id: 8, title: 'The Void', words: 3600, published: true },
			{ id: 9, title: 'Echoes', words: 3200, published: true },
			{ id: 10, title: 'Fragments', words: 4400, published: true },
			{ id: 11, title: 'Horizon', words: 3700, published: true },
			{ id: 12, title: 'Arrival', words: 5100, published: true },
		]
	}

	const totalWords = novel.chapters.reduce((sum, ch) => sum + ch.words, 0)
</script>

<Header variant="reader" />

<main class="novel-page">
	<section class="novel-header">
		<div class="novel-cover">📖</div>
		<div class="novel-info">
			<span class="genre-tag">{novel.genre}</span>
			<h1>{novel.title}</h1>
			<p class="author">by {novel.author}</p>
			<p class="synopsis">{novel.synopsis}</p>
			<div class="novel-stats">
				<span>⭐ {novel.rating}</span>
				<span>👁 {totalReads.toLocaleString()} reads</span>
				<span>{novel.chapters.length} chapters</span>
				<span>{totalWords.toLocaleString()} words</span>
			</div>
			<a href="/novel/{novel.id}/1" class="start-btn">Start Reading</a>
		</div>
	</section>

	<section class="chapters-section">
		<h2>Chapters</h2>
		<div class="chapter-list">
			{#each novel.chapters as chapter}
				<a href="/novel/{novel.id}/{chapter.id}" class="chapter-row">
					<span class="chapter-num">{chapter.id}</span>
					<span class="chapter-title">{chapter.title}</span>
					<span class="chapter-words">{chapter.words.toLocaleString()}w</span>
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	.novel-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
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
