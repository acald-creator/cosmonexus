<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface DropdownItem {
		label: string;
		value?: string;
		onclick?: () => void;
		disabled?: boolean;
		icon?: string;
		type?: 'item' | 'divider' | 'label';
	}

	interface Props {
		items: DropdownItem[];
		align?: 'left' | 'right';
		trigger: Snippet;
		class?: string;
		/** Controlled open state. When provided, the parent controls open/close. */
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}

	let {
		items,
		align = 'left',
		trigger,
		class: className = '',
		open,
		onOpenChange,
	}: Props = $props();

	let internalOpen = $state(false);
	let isOpen = $derived(open !== undefined ? open : internalOpen);
	let wrapperEl: HTMLDivElement | undefined;
	let menuEl = $state<HTMLDivElement | undefined>(undefined);

	function setOpen(value: boolean) {
		if (open !== undefined) {
			onOpenChange?.(value);
		} else {
			internalOpen = value;
		}
	}

	function toggle() {
		setOpen(!isOpen);
	}

	function getMenuItems(): HTMLElement[] {
		if (!menuEl) return [];
		return Array.from(menuEl.querySelectorAll('[role="menuitem"]:not([disabled])'));
	}

	function handleMenuKeydown(e: KeyboardEvent) {
		const menuItems = getMenuItems();
		if (!menuItems.length) return;

		const current = menuItems.indexOf(document.activeElement as HTMLElement);

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				menuItems[(current + 1) % menuItems.length]?.focus();
				break;
			case 'ArrowUp':
				e.preventDefault();
				menuItems[(current - 1 + menuItems.length) % menuItems.length]?.focus();
				break;
			case 'Home':
				e.preventDefault();
				menuItems[0]?.focus();
				break;
			case 'End':
				e.preventDefault();
				menuItems[menuItems.length - 1]?.focus();
				break;
		}
	}

	// Focus first item when menu opens
	$effect(() => {
		if (isOpen && menuEl) {
			const firstItem = menuEl.querySelector('[role="menuitem"]:not([disabled])') as HTMLElement;
			firstItem?.focus();
		}
	});

	$effect(() => {
		if (!isOpen) return;

		function handleClickOutside(e: MouseEvent) {
			if (wrapperEl && !wrapperEl.contains(e.target as Node)) {
				setOpen(false);
			}
		}

		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				setOpen(false);
			}
		}

		document.addEventListener('click', handleClickOutside, true);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('click', handleClickOutside, true);
			document.removeEventListener('keydown', handleEscape);
		};
	});
</script>

<div class="dropdown {className}" bind:this={wrapperEl}>
	<button
		class="dropdown-trigger"
		type="button"
		onclick={toggle}
		aria-haspopup="menu"
		aria-expanded={isOpen}
	>
		{@render trigger()}
	</button>
	{#if isOpen}
		<div class="dropdown-menu {align}" role="menu" tabindex="-1" bind:this={menuEl} onkeydown={handleMenuKeydown}>
			{#each items as item, i (i)}
				{#if item.type === 'divider'}
					<div class="dropdown-divider" role="separator"></div>
				{:else if item.type === 'label'}
					<div class="dropdown-label">{item.label}</div>
				{:else}
					<button
						class="dropdown-item"
						role="menuitem"
						disabled={item.disabled}
						onclick={() => {
							item.onclick?.();
							setOpen(false);
						}}
					>
						{#if item.icon}<span class="dropdown-icon">{item.icon}</span>{/if}
						{item.label}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-trigger {
		display: inline-flex;
		align-items: center;
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
	}

	.dropdown-trigger:focus-visible {
		outline: 2px solid var(--dropdown-trigger-border-color-focus);
		outline-offset: 2px;
		border-radius: var(--dropdown-trigger-border-radius);
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		min-width: 180px;
		background: var(--dropdown-menu-background);
		border: var(--dropdown-menu-border-width) solid var(--dropdown-menu-border-color);
		border-radius: var(--dropdown-menu-border-radius);
		box-shadow: var(--dropdown-menu-shadow);
		padding: var(--dropdown-menu-padding-y);
		z-index: var(--dropdown-menu-z-index);
		margin-top: var(--spacing-1);
		animation: dropdown-enter var(--dropdown-animation-duration) ease-out;
	}

	.left {
		left: 0;
	}

	.right {
		right: 0;
	}

	.dropdown-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--dropdown-item-gap);
		padding: var(--dropdown-item-padding-y) var(--dropdown-item-padding-x);
		background: var(--dropdown-item-background);
		border: none;
		cursor: pointer;
		font-family: inherit;
		font-size: var(--dropdown-item-font-size);
		font-weight: var(--dropdown-item-font-weight);
		color: var(--dropdown-item-color);
		border-radius: var(--dropdown-trigger-border-radius);
		text-align: left;
		line-height: 1.4;
		transition: background-color var(--dropdown-animation-duration) ease;
	}

	.dropdown-item:hover:not(:disabled) {
		background: var(--dropdown-item-background-hover);
	}

	.dropdown-item:focus-visible {
		outline: 2px solid var(--dropdown-trigger-border-color-focus);
		outline-offset: -2px;
	}

	.dropdown-item:disabled {
		color: var(--dropdown-item-color-disabled);
		cursor: not-allowed;
	}

	.dropdown-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--dropdown-item-icon-size);
		flex-shrink: 0;
	}

	.dropdown-divider {
		height: var(--dropdown-separator-height);
		background: var(--dropdown-separator-color);
		margin: var(--dropdown-separator-margin-y) 0;
	}

	.dropdown-label {
		padding: var(--dropdown-group-label-padding-y) var(--dropdown-group-label-padding-x);
		font-size: var(--dropdown-group-label-font-size);
		color: var(--dropdown-group-label-color);
		font-weight: var(--dropdown-group-label-font-weight);
		text-transform: var(--dropdown-group-label-text-transform);
		letter-spacing: var(--dropdown-group-label-letter-spacing);
	}

	@keyframes dropdown-enter {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
