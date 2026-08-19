<script lang="ts">
	let { novelId }: { novelId: string } = $props()

	// Static mock data — will be replaced with real data later
	const MOCK: Record<string, { rating: number; readers: number; reviews: number }> = {
		'demo-last-horizon': { rating: 4.5, readers: 2847, reviews: 42 },
		'demo-ember-falls': { rating: 4.8, readers: 1923, reviews: 31 },
		'demo-salt-and-static': { rating: 4.3, readers: 876, reviews: 15 },
		'demo-hollow-season': { rating: 4.6, readers: 1204, reviews: 22 },
		'demo-the-mapmakers-daughter': { rating: 4.7, readers: 1560, reviews: 28 },
		'demo-neon-psalm': { rating: 4.4, readers: 692, reviews: 11 },
	}

	let data = $derived(MOCK[novelId] ?? { rating: 4.0, readers: 0, reviews: 0 })
</script>

<div class="social-proof">
	<span class="stat">⭐ {data.rating.toFixed(1)}</span>
	<span class="divider">·</span>
	<span class="stat">{data.readers.toLocaleString()} readers</span>
	<span class="divider">·</span>
	<span class="stat">{data.reviews} reviews</span>
</div>

<style>
	.social-proof {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		padding-block: var(--spacing-3);
	}

	.stat {
		font-family: var(--font-family-mono);
	}

	.divider {
		opacity: 0.3;
	}
</style>
