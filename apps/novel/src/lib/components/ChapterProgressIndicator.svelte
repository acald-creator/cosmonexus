<script lang="ts">
	let { read = false }: { read: boolean } = $props()
</script>

<span class="indicator" class:read aria-hidden="true"></span>

<style>
	.indicator {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		background: var(--border-light);
		transition: background-color var(--duration-100) ease;
	}

	.read {
		background: var(--color-accent-main);
	}
</style>
