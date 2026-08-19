<script lang="ts">
	interface Props {
		orientation?: 'horizontal' | 'vertical';
		label?: string;
		labelPosition?: 'start' | 'center' | 'end';
		class?: string;
	}

	let {
		orientation = 'horizontal',
		label,
		labelPosition = 'center',
		class: className,
	}: Props = $props();

	let hasLabel = $derived(!!label);
</script>

{#if hasLabel}
	<div
		class="divider divider--{orientation} divider--label-{labelPosition} {className ?? ''}"
		role="separator"
		aria-orientation={orientation}
	>
		<span class="divider__label">{label}</span>
	</div>
{:else if orientation === 'vertical'}
	<div
		class="divider divider--vertical {className ?? ''}"
		role="separator"
		aria-orientation="vertical"
	></div>
{:else}
	<hr
		class="divider divider--horizontal {className ?? ''}"
		aria-orientation="horizontal"
	/>
{/if}

<style>
	.divider {
		border: none;
		margin: 0;
		padding: 0;
	}

	.divider--horizontal {
		width: 100%;
		height: var(--divider-thickness);
		background: var(--divider-color);
	}

	.divider--vertical {
		width: var(--divider-thickness);
		height: var(--divider-vertical-height);
		background: var(--divider-color);
	}

	.divider--label-start,
	.divider--label-center,
	.divider--label-end {
		display: flex;
		align-items: center;
		width: 100%;
		gap: 0;
	}

	.divider--label-start::before,
	.divider--label-center::before,
	.divider--label-end::before,
	.divider--label-start::after,
	.divider--label-center::after,
	.divider--label-end::after {
		content: '';
		height: var(--divider-thickness);
		background: var(--divider-color);
	}

	.divider--label-center::before,
	.divider--label-center::after {
		flex: 1;
	}

	.divider--label-start::before {
		flex: 0;
	}

	.divider--label-start::after {
		flex: 1;
	}

	.divider--label-end::before {
		flex: 1;
	}

	.divider--label-end::after {
		flex: 0;
	}

	.divider__label {
		color: var(--divider-with-label-color);
		font-size: var(--divider-with-label-font-size);
		font-weight: var(--divider-with-label-font-weight);
		letter-spacing: var(--divider-with-label-letter-spacing);
		text-transform: var(--divider-with-label-text-transform);
		padding: 0 var(--divider-with-label-gap);
		white-space: nowrap;
	}
</style>
