<script lang="ts">
	import type { NovelMeta } from '@cosmonexus/nova-types'
	import NovelCard from './NovelCard.svelte'

	let { novels }: { novels: NovelMeta[] } = $props()
</script>

<div class="cover-grid">
	{#each novels as novel}
		<NovelCard {novel} size="sm" />
	{/each}
</div>

<style>
	.cover-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-5);
		container-type: inline-size;
	}

	@container (min-width: 480px) {
		.cover-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@container (min-width: 700px) {
		.cover-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@container (min-width: 900px) {
		.cover-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}
</style>
