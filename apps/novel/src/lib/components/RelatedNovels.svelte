<script lang="ts">
	import type { NovelMeta } from '@cosmonexus/nova-types'
	import { getRelatedNovels } from '$lib/data/collections'
	import NovelCard from './NovelCard.svelte'

	interface Props {
		currentNovel: NovelMeta
		allNovels: NovelMeta[]
	}

	let { currentNovel, allNovels }: Props = $props()
	let related = $derived(getRelatedNovels(currentNovel, allNovels))
</script>

{#if related.length > 0}
	<section class="related" aria-label="Related novels">
		<h2 class="related-title">You might also enjoy</h2>
		<div class="related-grid">
			{#each related as novel}
				<NovelCard {novel} size="sm" />
			{/each}
		</div>
	</section>
{/if}

<style>
	.related {
		margin-block-start: var(--spacing-12);
		padding-block-start: var(--spacing-8);
		border-block-start: 1px solid var(--border-light);
	}

	.related-title {
		font-family: var(--font-family-sans);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-block-end: var(--spacing-5);
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: var(--spacing-4);
	}
</style>
