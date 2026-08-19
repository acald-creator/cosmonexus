<script lang="ts">
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import Sidebar from '$lib/components/Sidebar.svelte'
	import { novels$ } from '$lib/data/reactive'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	let novels = $state<NovelMeta[]>([])
	let totalWords = $derived(novels.reduce((sum, n) => sum + n.chapters.reduce((s, ch) => s + ch.wordCount, 0), 0))

	onMount(() => {
		const sub = novels$().subscribe(n => { novels = n })
		return () => sub.unsubscribe()
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
		padding: var(--spacing-8);
		overflow-y: auto;
	}

	.welcome h1 {
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-bold);
	}

	.subtitle {
		color: var(--text-muted);
		margin-block-start: var(--spacing-1);
	}

	.subtitle strong {
		color: var(--color-accent-main);
	}

	.section {
		margin-top: 2.5rem;
	}

	.section h2 {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		margin-block-end: var(--spacing-4);
	}

	.empty {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.chapter-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.chapter-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-3) var(--spacing-4);
		background: var(--background-surface);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: border-color var(--duration-150) ease;
	}

	.chapter-card:hover {
		border-color: var(--color-accent-main);
	}

	.chapter-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.chapter-book {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.chapter-title {
		font-size: var(--font-size-sm);
	}

	.chapter-right {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
	}

	.status-badge {
		font-size: var(--font-size-xs);
		padding: var(--spacing-0-5) var(--spacing-2);
		border-radius: var(--radius-md);
		text-transform: capitalize;
	}

	.status-badge.draft { background: rgba(224, 175, 104, 0.15); color: var(--color-warning-text); }
	.status-badge.revision { background: rgba(187, 154, 247, 0.15); color: var(--color-accent-pink); }
	.status-badge.editing { background: rgba(122, 162, 247, 0.15); color: var(--color-accent-main); }
	.status-badge.final { background: rgba(158, 206, 106, 0.15); color: var(--color-success-text); }

	.chapter-words {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		font-family: var(--font-family-mono);
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--spacing-4);
	}

	.action-card {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
		padding: var(--spacing-5);
		background: var(--background-surface);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-xl);
		text-decoration: none;
		transition: border-color 0.15s, transform 0.15s;
	}

	.action-card:hover {
		border-color: var(--color-accent-main);
		transform: translateY(-1px);
	}

	.action-icon {
		font-size: var(--font-size-2xl);
		margin-block-end: var(--spacing-1);
	}

	.action-card span:nth-child(2) {
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-sm);
	}

	.action-detail {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}
</style>
