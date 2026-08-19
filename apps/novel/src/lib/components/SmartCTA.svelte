<script lang="ts">
	import type { NovelMeta } from '@cosmonexus/nova-types'
	import { getProgress, getSmartCTAState, type ReadingProgress } from '$lib/data/reading-progress'

	interface Props {
		novel: NovelMeta
	}

	let { novel }: Props = $props()
	let progress = $derived(getProgress(novel.id))
	let cta = $derived(getSmartCTAState(novel, progress))
</script>

<a href="/novel/{novel.id}/{cta.targetChapterOrder}" class="smart-cta">
	{cta.label}
</a>

<style>
	.smart-cta {
		display: inline-block;
		padding: var(--spacing-3) var(--spacing-6);
		background: var(--color-accent-main);
		color: var(--background-body);
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-sm);
		border-radius: var(--radius-lg);
		text-decoration: none;
		width: fit-content;
		transition: opacity var(--duration-100) ease;
	}

	.smart-cta:hover {
		opacity: 0.85;
		color: var(--background-body);
	}

	.smart-cta:focus-visible {
		outline: 2px solid var(--color-accent-main);
		outline-offset: 3px;
	}
</style>
