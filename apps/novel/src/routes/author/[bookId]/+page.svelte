<script>
	import { page } from '$app/stores'
	import Header from '$lib/components/Header.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'

	const bookId = $derived($page.params.bookId)

	// Mock
	const book = {
		id: 'last-horizon',
		title: 'The Last Horizon',
		genre: 'Sci-Fi',
		targetWordCount: 80000,
		chapters: [
			{ id: 1, title: 'The Beginning', words: 4200, status: 'final' },
			{ id: 2, title: 'Rising Action', words: 3800, status: 'final' },
			{ id: 3, title: 'The Crisis', words: 2847, status: 'draft' },
			{ id: 4, title: 'Convergence', words: 3100, status: 'revision' },
			{ id: 5, title: 'The Descent', words: 4500, status: 'final' },
			{ id: 6, title: 'Revelations', words: 3900, status: 'final' },
			{ id: 7, title: 'Breaking Point', words: 4100, status: 'final' },
			{ id: 8, title: 'The Void', words: 3600, status: 'editing' },
			{ id: 9, title: 'Echoes', words: 3200, status: 'final' },
			{ id: 10, title: 'Fragments', words: 4400, status: 'final' },
			{ id: 11, title: 'Horizon', words: 3700, status: 'final' },
			{ id: 12, title: 'Arrival', words: 5100, status: 'final' },
		],
	}

	const totalWords = $derived(book.chapters.reduce((sum, ch) => sum + ch.words, 0))
	const analytics = { reads: 12400, rating: 4.7, comments: 89 }
</script>

<Header variant="author" />

<main class="book-page">
	<div class="book-header">
		<div>
			<span class="genre-tag">{book.genre}</span>
			<h1>{book.title}</h1>
		</div>
		<a href="/author/{bookId}/write/{book.chapters[0]?.id}" class="write-btn">Continue Writing</a>
	</div>

	<div class="stats-row">
		<div class="stat-card">
			<span class="stat-value">{totalWords.toLocaleString()}</span>
			<span class="stat-label">Words</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{book.chapters.length}</span>
			<span class="stat-label">Chapters</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">👁 {analytics.reads.toLocaleString()}</span>
			<span class="stat-label">Reads</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">⭐ {analytics.rating}</span>
			<span class="stat-label">Rating</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">💬 {analytics.comments}</span>
			<span class="stat-label">Comments</span>
		</div>
	</div>

	<div class="progress-section">
		<ProgressBar current={totalWords} target={book.targetWordCount} label="Novel Progress" />
	</div>

	<section class="chapters-section">
		<div class="chapters-header">
			<h2>Chapters</h2>
			<button class="add-chapter-btn">+ Add Chapter</button>
		</div>
		<table class="chapters-table">
			<thead>
				<tr>
					<th>#</th>
					<th>Title</th>
					<th>Words</th>
					<th>Status</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each book.chapters as chapter}
					<tr>
						<td class="col-num">{chapter.id}</td>
						<td class="col-title">{chapter.title}</td>
						<td class="col-words">{chapter.words.toLocaleString()}</td>
						<td><span class="status-badge {chapter.status}">{chapter.status}</span></td>
						<td class="col-actions">
							<a href="/author/{bookId}/write/{chapter.id}" class="edit-link">Edit</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</main>

<style>
	.book-page {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	.book-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	.genre-tag {
		font-size: 0.7rem;
		background: var(--primary-dim);
		color: var(--primary);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.book-header h1 {
		font-size: 1.75rem;
		font-weight: 800;
		margin-top: 0.25rem;
	}

	.write-btn {
		padding: 0.6rem 1.25rem;
		background: var(--primary);
		color: var(--bg);
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.85rem;
		transition: opacity 0.15s;
	}

	.write-btn:hover {
		opacity: 0.9;
	}

	.stats-row {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		flex: 1;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.stat-value {
		font-weight: 700;
		font-family: var(--font-mono);
		font-size: 1rem;
	}

	.stat-label {
		font-size: 0.7rem;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.progress-section {
		margin-bottom: 2rem;
		padding: 1rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
	}

	.chapters-section {
		margin-top: 1rem;
	}

	.chapters-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.chapters-header h2 {
		font-size: 1rem;
		font-weight: 600;
	}

	.add-chapter-btn {
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		border: 1px dashed var(--border);
		background: transparent;
		color: var(--muted);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.add-chapter-btn:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.chapters-table {
		width: 100%;
		border-collapse: collapse;
	}

	.chapters-table th {
		text-align: left;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--border);
	}

	.chapters-table td {
		padding: 0.65rem 0.75rem;
		border-bottom: 1px solid var(--border);
		font-size: 0.85rem;
	}

	.chapters-table tbody tr:hover {
		background: var(--surface);
	}

	.col-num {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--muted);
		width: 3rem;
	}

	.col-words {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--muted);
	}

	.status-badge {
		font-size: 0.7rem;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		text-transform: capitalize;
	}

	.status-badge.draft { background: rgba(224, 175, 104, 0.15); color: var(--warning); }
	.status-badge.revision { background: rgba(187, 154, 247, 0.15); color: var(--secondary); }
	.status-badge.editing { background: rgba(122, 162, 247, 0.15); color: var(--primary); }
	.status-badge.final { background: rgba(158, 206, 106, 0.15); color: var(--success); }

	.edit-link {
		font-size: 0.8rem;
		color: var(--primary);
		text-decoration: none;
	}

	.edit-link:hover {
		text-decoration: underline;
	}
</style>
