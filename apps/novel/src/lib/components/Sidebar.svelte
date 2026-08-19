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
		border-inline-end: 1px solid var(--border-light);
		background: var(--background-surface);
		padding: var(--spacing-5);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-8);
		overflow-y: auto;
	}

	.section-title {
		font-size: var(--font-size-xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin-block-end: var(--spacing-3);
		font-weight: var(--font-weight-semibold);
	}

	.book-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.book-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-2) var(--spacing-3);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: var(--text-primary);
		font-size: var(--font-size-sm);
		transition: background-color var(--duration-150) ease;
	}

	.book-item:hover {
		background: var(--background-body);
	}

	.book-item:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}

	.book-item.active {
		background: var(--color-accent-soft);
		color: var(--color-accent-main);
	}

	.book-meta {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		font-family: var(--font-family-mono);
	}

	.new-book-btn {
		display: block;
		margin-block-start: var(--spacing-2);
		padding: var(--spacing-1-5) var(--spacing-3);
		border-radius: var(--radius-lg);
		border: 1px dashed var(--border-light);
		text-align: center;
		color: var(--text-muted);
		text-decoration: none;
		font-size: var(--font-size-sm);
		transition: border-color var(--duration-150) ease, color var(--duration-150) ease;
	}

	.new-book-btn:hover {
		border-color: var(--color-accent-main);
		color: var(--color-accent-main);
	}

	.new-book-btn:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-block-end: var(--spacing-2);
	}

	.stat-label {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}

	.stat-value {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		font-family: var(--font-family-mono);
	}
</style>
