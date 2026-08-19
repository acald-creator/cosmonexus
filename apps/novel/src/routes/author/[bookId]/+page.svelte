<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import Header from '$lib/components/Header.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import { getNovel } from '$lib/data/novels'
	import { createChapter } from '$lib/data/chapters'
	import type { NovelMeta } from '@cosmonexus/nova-types'

	const bookId = $derived($page.params.bookId)
	let novel = $state<NovelMeta | null>(null)
	let totalWords = $derived(novel?.chapters.reduce((sum, ch) => sum + ch.wordCount, 0) ?? 0)

	onMount(() => {
		novel = getNovel(bookId)
	})

	function addChapter() {
		if (!novel) return
		const title = prompt('Chapter title:')
		if (!title) return
		const ch = createChapter(bookId, { title, targetWordCount: 4000 })
		if (ch) {
			novel = getNovel(bookId) // refresh
		}
	}
</script>

<Header variant="author" />

{#if novel}
	<main class="book-page">
		<div class="book-header">
			<div>
				{#if novel.genre}
					<span class="genre-tag">{novel.genre}</span>
				{/if}
				<h1>{novel.title}</h1>
			</div>
			{#if novel.chapters.length > 0}
				<a href="/author/{bookId}/write/{novel.chapters[0].id}" class="write-btn">Continue Writing</a>
			{/if}
		</div>

		<div class="stats-row">
			<div class="stat-card">
				<span class="stat-value">{totalWords.toLocaleString()}</span>
				<span class="stat-label">Words</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{novel.chapters.length}</span>
				<span class="stat-label">Chapters</span>
			</div>
		</div>

		{#if novel.targetWordCount}
			<div class="progress-section">
				<ProgressBar current={totalWords} target={novel.targetWordCount} label="Novel Progress" />
			</div>
		{/if}

		<section class="chapters-section">
			<div class="chapters-header">
				<h2>Chapters</h2>
				<button class="add-chapter-btn" onclick={addChapter}>+ Add Chapter</button>
			</div>
			{#if novel.chapters.length === 0}
				<p class="empty">No chapters yet. Click "+ Add Chapter" to start writing.</p>
			{:else}
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
						{#each novel.chapters as chapter}
							<tr>
								<td class="col-num">{chapter.order}</td>
								<td class="col-title">{chapter.title}</td>
								<td class="col-words">{chapter.wordCount.toLocaleString()}</td>
								<td><span class="status-badge {chapter.status}">{chapter.status}</span></td>
								<td class="col-actions">
									<a href="/author/{bookId}/write/{chapter.id}" class="edit-link">Edit</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</section>
	</main>
{:else}
	<main class="book-page">
		<p class="not-found">Book not found. <a href="/author">← Back to dashboard</a></p>
	</main>
{/if}

<style>
	.book-page {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--spacing-8);
	}

	.not-found, .empty {
		color: var(--text-muted);
	}

	.not-found a {
		color: var(--color-accent-main);
		text-decoration: none;
	}

	.book-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-block-end: var(--spacing-8);
	}

	.genre-tag {
		font-size: var(--font-size-xs);
		background: var(--color-accent-soft);
		color: var(--color-accent-main);
		padding: var(--spacing-0-5) var(--spacing-2);
		border-radius: var(--radius-md);
	}

	.book-header h1 {
		font-size: var(--font-size-3xl);
		font-weight: var(--font-weight-extrabold);
		margin-block-start: var(--spacing-1);
	}

	.write-btn {
		padding: var(--spacing-2-5) var(--spacing-5);
		background: var(--color-accent-main);
		color: var(--background-body);
		border-radius: var(--radius-lg);
		text-decoration: none;
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-sm);
		transition: opacity var(--duration-150) ease;
	}

	.write-btn:hover {
		opacity: 0.9;
	}

	.stats-row {
		display: flex;
		gap: var(--spacing-4);
		margin-block-end: var(--spacing-6);
	}

	.stat-card {
		flex: 1;
		background: var(--background-surface);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-lg);
		padding: var(--spacing-4);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-1);
	}

	.stat-value {
		font-weight: var(--font-weight-bold);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-base);
	}

	.stat-label {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.progress-section {
		margin-block-end: var(--spacing-8);
		padding: var(--spacing-4);
		background: var(--background-surface);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-lg);
	}

	.chapters-section {
		margin-block-start: var(--spacing-4);
	}

	.chapters-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-block-end: var(--spacing-4);
	}

	.chapters-header h2 {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
	}

	.add-chapter-btn {
		padding: var(--spacing-1-5) var(--spacing-3);
		border-radius: var(--radius-md);
		border: 1px dashed var(--border-light);
		background: transparent;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		cursor: pointer;
		transition: border-color var(--duration-150) ease, color var(--duration-150) ease;
	}

	.add-chapter-btn:hover {
		border-color: var(--color-accent-main);
		color: var(--color-accent-main);
	}

	.chapters-table {
		width: 100%;
		border-collapse: collapse;
	}

	.chapters-table th {
		text-align: left;
		font-size: var(--font-size-xs);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		padding: var(--spacing-2) var(--spacing-3);
		border-bottom: 1px solid var(--border-light);
	}

	.chapters-table td {
		padding: 0.65rem 0.75rem;
		border-bottom: 1px solid var(--border-light);
		font-size: var(--font-size-sm);
	}

	.chapters-table tbody tr:hover {
		background: var(--background-surface);
	}

	.col-num {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		width: 3rem;
	}

	.col-words {
		font-family: var(--font-family-mono);
		font-size: var(--font-size-sm);
		color: var(--text-muted);
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

	.edit-link {
		font-size: var(--font-size-sm);
		color: var(--color-accent-main);
		text-decoration: none;
	}

	.edit-link:hover {
		text-decoration: underline;
	}
</style>
