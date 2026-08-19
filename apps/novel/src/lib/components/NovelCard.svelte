<script lang="ts">
	import type { NovelMeta } from '@cosmonexus/nova-types'
	import { formatReadingTime, getPublishedWordCount } from '$lib/data/reading-time'

	interface Props {
		novel: NovelMeta
		size?: 'sm' | 'md' | 'lg'
	}

	let { novel, size = 'md' }: Props = $props()
	let readingTime = $derived(formatReadingTime(getPublishedWordCount(novel)))
</script>

<a href="/novel/{novel.id}" class="novel-card {size}">
	<div class="cover">
		{#if novel.coverUrl}
			<img src={novel.coverUrl} alt="{novel.title} cover" />
		{:else}
			<div class="cover-placeholder">
				<span>{novel.title.charAt(0)}</span>
			</div>
		{/if}
	</div>
	<div class="info">
		<h3 class="title">{novel.title}</h3>
		<span class="author">{novel.author}</span>
		<span class="time">{readingTime}</span>
	</div>
</a>

<style>
	.novel-card {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
		text-decoration: none;
		transition: transform var(--motion-micro);
	}

	.novel-card:hover {
		transform: scale(1.02);
	}

	.cover {
		aspect-ratio: 2 / 3;
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: var(--background-muted);
	}

	.cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cover-placeholder {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		font-family: var(--font-family-display);
		font-weight: var(--font-weight-extrabold);
		color: var(--text-muted);
		opacity: 0.4;
	}

	/* Sizes */
	.sm .cover { width: 80px; }
	.sm .cover-placeholder { font-size: var(--font-size-xl); }
	.sm .title { font-size: var(--font-size-sm); }
	.sm .author, .sm .time { font-size: var(--font-size-xs); }

	.md .cover { width: 120px; }
	.md .cover-placeholder { font-size: var(--font-size-3xl); }
	.md .title { font-size: var(--font-size-base); }

	.lg .cover { width: 160px; }
	.lg .cover-placeholder { font-size: var(--font-size-4xl); }
	.lg .title { font-size: var(--font-size-lg); }

	.info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-0-5);
	}

	.title {
		font-family: var(--font-family-display);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--text-primary);
	}

	.author {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.time {
		font-size: var(--font-size-xs);
		font-family: var(--font-family-mono);
		color: var(--text-muted);
	}
</style>
