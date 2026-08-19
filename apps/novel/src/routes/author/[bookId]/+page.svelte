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
		padding: 2rem;
	}

	.not-found, .empty {
		color: var(--muted);
	}

	.not-found a {
		color: var(--primary);
		text-decoration: none;
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
