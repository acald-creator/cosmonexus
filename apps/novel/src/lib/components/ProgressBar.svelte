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
		gap: 0.3rem;
	}

	.progress-label {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--muted);
	}

	.progress-stats {
		font-family: var(--font-mono);
	}

	.progress-track {
		height: 6px;
		background: var(--bg);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--primary);
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.progress-percent {
		font-size: 0.7rem;
		color: var(--muted);
		font-family: var(--font-mono);
		align-self: flex-end;
	}
</style>
