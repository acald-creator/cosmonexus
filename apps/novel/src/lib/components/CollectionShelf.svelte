<script lang="ts">
	import type { NovelMeta } from '@cosmonexus/nova-types'
	import NovelCard from './NovelCard.svelte'

	interface Props {
		title: string
		novels: NovelMeta[]
	}

	let { title, novels }: Props = $props()
</script>

{#if novels.length > 0}
	<section class="shelf">
		<h2 class="shelf-title">{title}</h2>
		<div class="shelf-scroll">
			{#each novels as novel}
				<NovelCard {novel} size="md" />
			{/each}
		</div>
	</section>
{/if}

<style>
	.shelf {
		margin-block-end: var(--spacing-12);
	}

	.shelf-title {
		font-family: var(--font-family-sans);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-block-end: var(--spacing-5);
	}

	.shelf-scroll {
		display: flex;
		gap: var(--spacing-5);
		overflow-x: auto;
		padding-block-end: var(--spacing-3);
		scrollbar-width: thin;
	}
</style>
