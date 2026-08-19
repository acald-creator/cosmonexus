<script>
	let { current = 0, target = 1, label = '' } = $props()
	let percentage = $derived(Math.min(100, Math.round((current / target) * 100)))
</script>

<div class="progress-container">
	{#if label}
		<div class="progress-label">
			<span>{label}</span>
			<span class="progress-stats">{current.toLocaleString()} / {target.toLocaleString()}</span>
		</div>
	{/if}
	<div class="progress-track">
		<div class="progress-fill" style:width="{percentage}%"></div>
	</div>
	<span class="progress-percent">{percentage}%</span>
</div>

<style>
	.progress-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.progress-label {
		display: flex;
		justify-content: space-between;
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.progress-stats {
		font-family: var(--font-family-mono);
	}

	.progress-track {
		height: 6px;
		background: var(--background-body);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-accent-main);
		border-radius: var(--radius-full);
		transition: width var(--duration-300) ease;
	}

	.progress-percent {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		font-family: var(--font-family-mono);
		align-self: flex-end;
	}
</style>
