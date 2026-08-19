<script lang="ts">
	import { getAuthorBio } from '$lib/data/authors'

	interface Props {
		author: string
		novelId: string
	}

	let { author }: Props = $props()
	let bio = $derived(getAuthorBio(author))
</script>

<section class="author-section" aria-label="About the author">
	<div class="avatar" aria-hidden="true">
		<span>{author.charAt(0)}</span>
	</div>
	<div class="author-info">
		<h2 class="author-name">{author}</h2>
		<p class="author-bio">{bio}</p>
	</div>
</section>

<style>
	.author-section {
		display: flex;
		gap: var(--spacing-4);
		align-items: start;
		padding-block: var(--spacing-6);
		border-block: 1px solid var(--border-light);
		margin-block: var(--spacing-8);
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-full);
		background: var(--background-muted);
		display: grid;
		place-items: center;
		font-family: var(--font-family-display);
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-lg);
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.author-name {
		font-family: var(--font-family-sans);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
		margin-block-end: var(--spacing-1);
	}

	.author-bio {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		line-height: var(--line-height-relaxed);
	}
</style>
