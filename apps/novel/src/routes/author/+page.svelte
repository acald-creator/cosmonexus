<script lang="ts">
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import Sidebar from '$lib/components/Sidebar.svelte'
	import { listNovels, getNovelWordCount } from '$lib/data/novels'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	let novels = $state<NovelMeta[]>([])
	let totalWords = $derived(novels.reduce((sum, n) => sum + n.chapters.reduce((s, ch) => s + ch.wordCount, 0), 0))

	onMount(() => {
		novels = listNovels()
	})

	// Collect recent chapters across all books
	const recentChapters = $derived(
		novels
			.flatMap((n) => n.chapters.map((ch) => ({ ...ch, bookId: n.id, bookTitle: n.title })))
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
			.slice(0, 5)
	)
</script>

<Header variant="author" />

<div class="layout">
	<Sidebar books={novels} totalWords={totalWords} targetWords={80000} streak={7} todayWords={0} />

	<main class="content">
		<section class="welcome">
			<h1>Welcome back 👋</h1>
			<p class="subtitle">You have <strong>{novels.length} book{novels.length !== 1 ? 's' : ''}</strong> with <strong>{totalWords.toLocaleString()} words</strong> written.</p>
		</section>

		<section class="section">
			<h2>Recent Chapters</h2>
			{#if recentChapters.length === 0}
				<p class="empty">No chapters yet. Create a book to get started.</p>
			{:else}
				<div class="chapter-list">
					{#each recentChapters as chapter}
						<a href="/author/{chapter.bookId}/write/{chapter.id}" class="chapter-card">
							<div class="chapter-info">
								<span class="chapter-book">{chapter.bookTitle}</span>
								<span class="chapter-title">Ch {chapter.order}: {chapter.title}</span>
							</div>
							<div class="chapter-right">
								<span class="status-badge {chapter.status}">{chapter.status}</span>
								<span class="chapter-words">{chapter.wordCount.toLocaleString()}w</span>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</section>

		<section class="section">
			<h2>Quick Actions</h2>
			<div class="actions-grid">
				{#if recentChapters.length > 0}
					<a href="/author/{recentChapters[0].bookId}/write/{recentChapters[0].id}" class="action-card">
						<span class="action-icon">✏️</span>
						<span>Continue Writing</span>
						<span class="action-detail">Ch {recentChapters[0].order}: {recentChapters[0].title}</span>
					</a>
				{/if}
				{#if novels.length > 0}
					<a href="/author/{novels[0].id}" class="action-card">
						<span class="action-icon">📊</span>
						<span>Manage Book</span>
						<span class="action-detail">{novels[0].title}</span>
					</a>
				{/if}
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
		margin-top: 2.5rem;
	}

	.section h2 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.empty {
		color: var(--muted);
		font-size: 0.9rem;
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
