<script lang="ts">
	import type { Snippet } from 'svelte';

	interface TabDef {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		tabs: TabDef[];
		value?: string;
		defaultValue?: string;
		onValueChange?: (value: string) => void;
		variant?: 'line' | 'pills' | 'enclosed';
		children: Snippet<[string]>;
		class?: string;
	}

	let {
		tabs,
		value = undefined,
		defaultValue = undefined,
		onValueChange,
		variant = 'line',
		children,
		class: className = ''
	}: Props = $props();

	function getInitialValue(): string {
		return defaultValue ?? tabs[0]?.value ?? '';
	}

	let activeValue: string = $state(getInitialValue());

	let effectiveValue: string = $derived(value ?? activeValue);

	function selectTab(tabValue: string) {
		const tab = tabs.find((t) => t.value === tabValue);
		if (tab?.disabled) return;

		if (value === undefined) {
			activeValue = tabValue;
		}
		onValueChange?.(tabValue);
	}

	function handleKeydown(event: KeyboardEvent) {
		const enabledTabs = tabs.filter((t) => !t.disabled);
		const currentIndex = enabledTabs.findIndex((t) => t.value === effectiveValue);
		let nextIndex = currentIndex;

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			nextIndex = (currentIndex + 1) % enabledTabs.length;
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
		} else if (event.key === 'Home') {
			event.preventDefault();
			nextIndex = 0;
		} else if (event.key === 'End') {
			event.preventDefault();
			nextIndex = enabledTabs.length - 1;
		} else {
			return;
		}

		const nextTab = enabledTabs[nextIndex];
		if (nextTab) {
			selectTab(nextTab.value);
			const el = document.getElementById(`tab-${nextTab.value}`);
			el?.focus();
		}
	}
</script>

<div class="tabs tabs--{variant} {className}">
	<div class="tab-list" role="tablist" tabindex="-1" onkeydown={handleKeydown}>
		{#each tabs as tab (tab.value)}
			<button
				role="tab"
				class="tab-trigger"
				class:active={effectiveValue === tab.value}
				aria-selected={effectiveValue === tab.value}
				tabindex={effectiveValue === tab.value ? 0 : -1}
				disabled={tab.disabled}
				onclick={() => selectTab(tab.value)}
				id="tab-{tab.value}"
				aria-controls="panel-{tab.value}"
			>
				{tab.label}
			</button>
		{/each}
	</div>
	<div
		class="tab-panel"
		role="tabpanel"
		id="panel-{effectiveValue}"
		aria-labelledby="tab-{effectiveValue}"
	>
		{@render children(effectiveValue)}
	</div>
</div>

<style>
	.tabs {
		width: 100%;
	}

	.tab-list {
		display: flex;
		gap: var(--tabs-list-gap);
	}

	/* Line variant */
	.tabs--line .tab-list {
		border-bottom: var(--tabs-variant-line-list-border-bottom);
		gap: 0;
	}

	.tabs--line .tab-trigger {
		background: var(--tabs-trigger-background);
		border: none;
		border-bottom: var(--tabs-trigger-indicator-height) solid transparent;
		padding: var(--tabs-trigger-padding-y) var(--tabs-trigger-padding-x);
		margin-bottom: calc(-1 * var(--tabs-list-border-width));
		border-radius: var(--tabs-variant-line-trigger-border-radius);
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.tabs--line .tab-trigger.active {
		color: var(--tabs-trigger-color-active);
		border-bottom-color: var(--tabs-trigger-indicator-color);
	}

	/* Pills variant */
	.tabs--pills .tab-list {
		gap: var(--tabs-list-gap);
	}

	.tabs--pills .tab-trigger {
		background: var(--tabs-variant-pills-trigger-background);
		border: none;
		border-radius: var(--tabs-variant-pills-trigger-border-radius);
		padding: var(--tabs-trigger-padding-y) var(--tabs-trigger-padding-x);
		transition: color 0.15s ease, background-color 0.15s ease;
	}

	.tabs--pills .tab-trigger.active {
		background-color: var(--tabs-variant-pills-trigger-background-active);
		color: var(--tabs-variant-pills-trigger-color-active);
	}

	/* Enclosed variant */
	.tabs--enclosed .tab-list {
		border-bottom: var(--tabs-variant-enclosed-content-border);
		gap: 0;
	}

	.tabs--enclosed .tab-trigger {
		background: var(--tabs-variant-enclosed-trigger-background);
		border: 1px solid transparent;
		border-bottom: none;
		border-radius: var(--tabs-variant-enclosed-trigger-border-radius);
		padding: var(--tabs-trigger-padding-y) var(--tabs-trigger-padding-x);
		margin-bottom: calc(-1 * var(--tabs-list-border-width));
		transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
	}

	.tabs--enclosed .tab-trigger.active {
		color: var(--tabs-trigger-color-active);
		background-color: var(--tabs-variant-enclosed-trigger-background-active);
		border-color: var(--tabs-list-border-color);
		border-bottom-color: var(--tabs-variant-enclosed-trigger-background-active);
	}

	/* Shared trigger styles */
	.tab-trigger {
		font-size: var(--tabs-trigger-font-size);
		font-weight: var(--tabs-trigger-font-weight);
		line-height: 1.25rem;
		color: var(--tabs-trigger-color);
		cursor: pointer;
		white-space: nowrap;
		outline: none;
	}

	.tab-trigger:hover:not(:disabled):not(.active) {
		color: var(--tabs-trigger-color-hover);
		background: var(--tabs-trigger-background-hover);
	}

	.tab-trigger:focus-visible {
		outline: 2px solid var(--tabs-trigger-color-active);
		outline-offset: -2px;
		border-radius: var(--tabs-trigger-border-radius);
	}

	.tab-trigger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Panel */
	.tab-panel {
		padding-top: var(--tabs-content-padding-top);
	}
</style>
