<script>
	import Header from '$lib/components/Header.svelte'

	// Mock data — will come from API later
	const trending = [
		{ id: 'last-horizon', title: 'The Last Horizon', author: 'A. Caldwell', genre: 'Sci-Fi', chapters: 12, rating: 4.7 },
		{ id: 'ember-falls', title: 'Ember Falls', author: 'M. Torres', genre: 'Fantasy', chapters: 8, rating: 4.9 },
		{ id: 'midnight-garden', title: 'Midnight Garden', author: 'S. Park', genre: 'Mystery', chapters: 20, rating: 4.5 },
		{ id: 'iron-tide', title: 'The Iron Tide', author: 'J. Chen', genre: 'Thriller', chapters: 15, rating: 4.6 },
	]

	const genres = ['Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Literary', 'Horror']

	const recentUpdates = [
		{ novelId: 'last-horizon', title: 'The Last Horizon', chapter: 12, chapterTitle: 'Arrival', author: 'A. Caldwell', timeAgo: '2h ago', reads: 340 },
		{ novelId: 'ember-falls', title: 'Ember Falls', chapter: 8, chapterTitle: 'The Forge', author: 'M. Torres', timeAgo: '5h ago', reads: 210 },
	]
</script>

<Header variant="reader" />

<main class="library">
	<section class="hero">
		<h1>Discover Stories</h1>
		<p>Read serialized novels from independent authors, one chapter at a time.</p>
	</section>

	<section class="section">
		<h2 class="section-title">Trending Now</h2>
		<div class="book-grid">
			{#each trending as book}
				<a href="/novel/{book.id}" class="book-card">
					<div class="book-cover">
						<span class="cover-emoji">📖</span>
					</div>
					<h3 class="book-title">{book.title}</h3>
					<p class="book-author">by {book.author}</p>
					<div class="book-meta">
						<span>⭐ {book.rating}</span>
						<span>{book.chapters} ch</span>
						<span class="genre-tag">{book.genre}</span>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Genres</h2>
		<div class="genre-list">
			{#each genres as genre}
				<a href="/?genre={genre.toLowerCase()}" class="genre-pill">{genre}</a>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Recently Updated</h2>
		<div class="updates-list">
			{#each recentUpdates as update}
				<a href="/novel/{update.novelId}/{update.chapter}" class="update-card">
					<div class="update-info">
						<span class="update-title">📖 {update.title} · Ch {update.chapter} "{update.chapterTitle}"</span>
						<span class="update-meta">by {update.author} · {update.timeAgo} · 👁 {update.reads} reads</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	.library {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.hero {
		text-align: center;
		padding: 3rem 0 2rem;
	}

	.hero h1 {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
	}

	.hero p {
		color: var(--muted);
		font-size: 1.1rem;
	}

	.section {
		margin-bottom: 3rem;
	}

	.section-title {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--text-dim);
	}

	.book-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.book-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.25rem;
		text-decoration: none;
		transition: border-color 0.15s, transform 0.15s;
	}

	.book-card:hover {
		border-color: var(--primary);
		transform: translateY(-2px);
	}

	.book-cover {
		height: 120px;
		background: var(--surface-raised);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
		font-size: 2.5rem;
	}

	.book-card .book-title {
		font-size: 0.95rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.book-author {
		font-size: 0.8rem;
		color: var(--muted);
		margin-bottom: 0.5rem;
	}

	.book-meta {
		display: flex;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--muted);
		font-family: var(--font-mono);
	}

	.genre-tag {
		background: var(--primary-dim);
		color: var(--primary);
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
	}

	.genre-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.genre-pill {
		padding: 0.4rem 1rem;
		border-radius: 20px;
		border: 1px solid var(--border);
		text-decoration: none;
		font-size: 0.85rem;
		color: var(--text-dim);
		transition: all 0.15s;
	}

	.genre-pill:hover {
		border-color: var(--primary);
		color: var(--primary);
		background: var(--primary-dim);
	}

	.updates-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.update-card {
		display: block;
		padding: 1rem 1.25rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		text-decoration: none;
		transition: border-color 0.15s;
	}

	.update-card:hover {
		border-color: var(--primary);
	}

	.update-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.update-title {
		font-size: 0.9rem;
	}

	.update-meta {
		font-size: 0.8rem;
		color: var(--muted);
	}
</style>
