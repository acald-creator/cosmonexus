<script>
	import { page } from '$app/stores'
	import Header from '$lib/components/Header.svelte'

	const novelId = $derived($page.params.id)
	const chapterNum = $derived(Number($page.params.chapter))

	// Mock — will come from API
	const chapter = {
		title: 'The Crisis',
		number: 3,
		content: `
			<p>The storm had been building for hours. Dark clouds rolled across the valley like a tide of ink, swallowing the last traces of afternoon light.</p>
			<p>"We need to leave," she said, her voice barely above a whisper.</p>
			<p>He looked out the window at the darkening sky and knew she was right. But leaving meant facing what waited on the road — and that terrified him more than any storm.</p>
			<p>The first drops of rain hit the glass like scattered gunfire. In the distance, thunder rolled across the mountains, low and ominous, as if the earth itself were growling a warning.</p>
			<p>"There's a shelter three miles north," she continued, already pulling her coat from the hook by the door. "If we leave now, we can make it before the worst hits."</p>
			<p>He turned from the window. Her eyes — those steady, fearless eyes — met his, and for a moment he saw something flicker there. Not fear, exactly. Something closer to resignation.</p>
			<p>"You know what's out there," he said. It wasn't a question.</p>
			<p>She zipped her coat. "I know what's in here if we stay."</p>
		`,
	}

	const prevChapter = chapterNum > 1 ? chapterNum - 1 : null
	const nextChapter = chapterNum < 12 ? chapterNum + 1 : null
</script>

<header class="reader-header">
	<a href="/novel/{novelId}" class="back-link">← Library</a>
	<span class="novel-title">The Last Horizon</span>
	<div class="reader-controls">
		<button class="control-btn" aria-label="Font settings">Aa</button>
		<button class="control-btn" aria-label="Dark mode">🌙</button>
		<button class="control-btn" aria-label="Chapter list">📑</button>
	</div>
</header>

<main class="reader">
	<article class="chapter-content">
		<div class="chapter-heading">
			<span class="chapter-label">Chapter {chapter.number}</span>
			<h1>{chapter.title}</h1>
		</div>

		<div class="prose">
			{@html chapter.content}
		</div>
	</article>

	<nav class="chapter-nav">
		{#if prevChapter}
			<a href="/novel/{novelId}/{prevChapter}" class="nav-btn prev">← Previous Chapter</a>
		{:else}
			<span></span>
		{/if}
		<span class="chapter-progress">{chapterNum} / 12</span>
		{#if nextChapter}
			<a href="/novel/{novelId}/{nextChapter}" class="nav-btn next">Next Chapter →</a>
		{:else}
			<span class="nav-btn end">End of novel</span>
		{/if}
	</nav>

	<section class="comments">
		<h2>Comments (23)</h2>
		<div class="comment">
			<span class="comment-author">@reader1</span>
			<p>"That last line gave me chills"</p>
		</div>
		<div class="comment">
			<span class="comment-author">@reader2</span>
			<p>"The pacing here is perfect"</p>
		</div>
		<div class="comment-input">
			<input type="text" placeholder="Add a comment..." />
		</div>
	</section>
</main>

<style>
	.reader-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 2rem;
		border-bottom: 1px solid var(--border);
		background: var(--surface);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.back-link {
		color: var(--primary);
		text-decoration: none;
		font-size: 0.85rem;
	}

	.novel-title {
		font-size: 0.85rem;
		color: var(--muted);
	}

	.reader-controls {
		display: flex;
		gap: 0.25rem;
	}

	.control-btn {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-dim);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
	}

	.control-btn:hover {
		background: var(--surface-raised);
	}

	.reader {
		max-width: 680px;
		margin: 0 auto;
		padding: 3rem 2rem;
	}

	.chapter-heading {
		text-align: center;
		margin-bottom: 3rem;
	}

	.chapter-label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.chapter-heading h1 {
		font-size: 2rem;
		font-weight: 700;
		font-family: var(--font-serif);
		margin-top: 0.25rem;
	}

	.prose {
		font-family: var(--font-serif);
		font-size: 1.15rem;
		line-height: 1.9;
		color: var(--text-dim);
	}

	.prose :global(p) {
		margin-bottom: 1.25em;
		text-indent: 1.5em;
	}

	.prose :global(p:first-child) {
		text-indent: 0;
	}

	.chapter-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 0;
		margin-top: 3rem;
		border-top: 1px solid var(--border);
	}

	.nav-btn {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: 1px solid var(--border);
		text-decoration: none;
		font-size: 0.85rem;
		color: var(--text-dim);
		transition: all 0.15s;
	}

	.nav-btn:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.nav-btn.end {
		color: var(--muted);
		border-color: transparent;
	}

	.chapter-progress {
		font-size: 0.8rem;
		color: var(--muted);
		font-family: var(--font-mono);
	}

	.comments {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.comments h2 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.comment {
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--border);
	}

	.comment-author {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--primary);
	}

	.comment p {
		font-size: 0.9rem;
		color: var(--text-dim);
		margin-top: 0.25rem;
	}

	.comment-input input {
		width: 100%;
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text);
		font-size: 0.9rem;
	}

	.comment-input input:focus {
		outline: none;
		border-color: var(--primary);
	}
</style>
