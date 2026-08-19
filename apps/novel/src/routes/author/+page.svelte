<script>
	import Header from '$lib/components/Header.svelte'
	import Sidebar from '$lib/components/Sidebar.svelte'

	const books = [
		{ id: 'last-horizon', title: 'The Last Horizon', chapters: Array(12).fill(null) },
		{ id: 'ember-falls', title: 'Ember Falls', chapters: Array(8).fill(null) },
	]

	const recentChapters = [
		{ bookId: 'last-horizon', bookTitle: 'The Last Horizon', id: 3, title: 'The Crisis', status: 'draft', words: 2847 },
		{ bookId: 'last-horizon', bookTitle: 'The Last Horizon', id: 12, title: 'Arrival', status: 'final', words: 5100 },
		{ bookId: 'ember-falls', bookTitle: 'Ember Falls', id: 8, title: 'The Forge', status: 'revision', words: 3200 },
	]
</script>

<Header variant="author" />

<div class="layout">
	<Sidebar {books} totalWords={48400} targetWords={80000} streak={7} todayWords={1204} />

	<main class="content">
		<section class="welcome">
			<h1>Welcome back 👋</h1>
			<p class="subtitle">You've written <strong>1,204 words</strong> today. Keep it going!</p>
		</section>

		<section class="section">
			<h2>Recent Chapters</h2>
			<div class="chapter-list">
				{#each recentChapters as chapter}
					<a href="/author/{chapter.bookId}/write/{chapter.id}" class="chapter-card">
						<div class="chapter-info">
							<span class="chapter-book">{chapter.bookTitle}</span>
							<span class="chapter-title">Ch {chapter.id}: {chapter.title}</span>
						</div>
						<div class="chapter-right">
							<span class="status-badge {chapter.status}">{chapter.status}</span>
							<span class="chapter-words">{chapter.words.toLocaleString()}w</span>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section class="section">
			<h2>Quick Actions</h2>
			<div class="actions-grid">
				<a href="/author/last-horizon/write/3" class="action-card">
					<span class="action-icon">✏️</span>
					<span>Continue Writing</span>
					<span class="action-detail">Ch 3: The Crisis</span>
				</a>
				<a href="/author/last-horizon" class="action-card">
					<span class="action-icon">📊</span>
					<span>Manage Book</span>
					<span class="action-detail">The Last Horizon</span>
				</a>
				<a href="/author/new" class="action-card">
					<span class="action-icon">📖</span>
					<span>New Book</span>
					<span class="action-detail">Start a new project</span>
				</a>
			</div>
		</section>
	</main>
</div>

<style>
	.layout {
		display: flex;
		flex: 1;
		min-height: calc(100vh - 57px);
	}

	.content {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
	}

	.welcome {
		margin-bottom: 2rem;
	}

	.welcome h1 {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.subtitle {
		color: var(--muted);
		margin-top: 0.25rem;
	}

	.subtitle strong {
		color: var(--primary);
	}

	.section {
		margin-bottom: 2.5rem;
	}

	.section h2 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.chapter-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.chapter-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		text-decoration: none;
		transition: border-color 0.15s;
	}

	.chapter-card:hover {
		border-color: var(--primary);
	}

	.chapter-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.chapter-book {
		font-size: 0.7rem;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.chapter-title {
		font-size: 0.9rem;
	}

	.chapter-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
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

	.chapter-words {
		font-size: 0.75rem;
		color: var(--muted);
		font-family: var(--font-mono);
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.action-card {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 1.25rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 10px;
		text-decoration: none;
		transition: border-color 0.15s, transform 0.15s;
	}

	.action-card:hover {
		border-color: var(--primary);
		transform: translateY(-1px);
	}

	.action-icon {
		font-size: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.action-card span:nth-child(2) {
		font-weight: 600;
		font-size: 0.9rem;
	}

	.action-detail {
		font-size: 0.75rem;
		color: var(--muted);
	}
</style>
