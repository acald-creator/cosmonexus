<script>
	import ProgressBar from './ProgressBar.svelte'

	let { books = [], activeBookId = '', totalWords = 0, targetWords = 0, streak = 0, todayWords = 0 } = $props()
</script>

<aside class="sidebar">
	<section class="section">
		<h3 class="section-title">My Books</h3>
		<ul class="book-list">
			{#each books as book}
				<li>
					<a
						href="/author/{book.id}"
						class="book-item"
						class:active={book.id === activeBookId}
					>
						<span class="book-title">{book.title}</span>
						<span class="book-meta">{book.chapters?.length ?? 0} ch</span>
					</a>
				</li>
			{/each}
		</ul>
		<a href="/author/new" class="new-book-btn">+ New Book</a>
	</section>

	<section class="section">
		<h3 class="section-title">Stats</h3>
		<div class="stat-row">
			<span class="stat-label">Today</span>
			<span class="stat-value">{todayWords.toLocaleString()}w</span>
		</div>
		<div class="stat-row">
			<span class="stat-label">Streak</span>
			<span class="stat-value">{streak} days 🔥</span>
		</div>
		{#if targetWords > 0}
			<ProgressBar current={totalWords} target={targetWords} label="Progress" />
		{/if}
	</section>
</aside>

<style>
	.sidebar {
		width: 240px;
		min-height: 100%;
		border-right: 1px solid var(--border);
		background: var(--surface);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		overflow-y: auto;
	}

	.section-title {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
		margin-bottom: 0.75rem;
		font-weight: 600;
	}

	.book-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.book-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		text-decoration: none;
		color: var(--text);
		font-size: 0.85rem;
		transition: background 0.15s;
	}

	.book-item:hover {
		background: var(--bg);
	}

	.book-item.active {
		background: var(--primary-dim);
		color: var(--primary);
	}

	.book-meta {
		font-size: 0.7rem;
		color: var(--muted);
		font-family: var(--font-mono);
	}

	.new-book-btn {
		display: block;
		margin-top: 0.5rem;
		padding: 0.4rem 0.75rem;
		border-radius: 6px;
		border: 1px dashed var(--border);
		text-align: center;
		color: var(--muted);
		text-decoration: none;
		font-size: 0.8rem;
		transition: all 0.15s;
	}

	.new-book-btn:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 0.8rem;
		color: var(--muted);
	}

	.stat-value {
		font-size: 0.8rem;
		font-weight: 600;
		font-family: var(--font-mono);
	}
</style>
