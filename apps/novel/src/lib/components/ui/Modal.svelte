<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		closeOnOverlayClick?: boolean;
		title?: string;
		showCloseButton?: boolean;
		footer?: Snippet;
		children: Snippet;
		class?: string;
	}

	let {
		open,
		onclose,
		size = 'md',
		closeOnOverlayClick = true,
		title,
		showCloseButton = true,
		footer,
		children,
		class: className = ''
	}: Props = $props();

	let dialogEl: HTMLDialogElement;

	$effect(() => {
		if (!dialogEl) return;
		if (open && !dialogEl.open) {
			dialogEl.showModal();
		} else if (!open && dialogEl.open) {
			dialogEl.close();
		}
	});

	function handleDialogClick(e: MouseEvent) {
		if (closeOnOverlayClick && e.target === dialogEl) {
			onclose();
		}
	}

	function handleClose() {
		onclose();
	}
</script>

<dialog
	bind:this={dialogEl}
	class="modal {size} {className}"
	onclick={handleDialogClick}
	onclose={handleClose}
>
	<div class="modal-container">
		{#if title || showCloseButton}
			<div class="modal-header">
				{#if title}<h2 class="modal-title">{title}</h2>{/if}
				{#if showCloseButton}
					<button class="modal-close" onclick={onclose} aria-label="Close">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
		{/if}
		<div class="modal-body">
			{@render children()}
		</div>
		{#if footer}
			<div class="modal-footer">
				{@render footer()}
			</div>
		{/if}
	</div>
</dialog>

<style>
	dialog {
		margin: auto;
		position: fixed;
		inset: 0;
		padding: 0;
		border: none;
		border-radius: var(--modal-border-radius);
		background: var(--modal-background);
		color: var(--modal-title-color);
		max-height: 90dvh;
		overflow: hidden;
		box-shadow: var(--modal-shadow);
		opacity: 0;
		transform: translateY(var(--modal-animation-initial-translate-y));
		scale: var(--modal-animation-initial-scale);
		transition:
			opacity var(--modal-animation-duration) var(--modal-animation-easing),
			transform var(--modal-animation-duration) var(--modal-animation-easing),
			scale var(--modal-animation-duration) var(--modal-animation-easing),
			display var(--modal-animation-duration) allow-discrete,
			overlay var(--modal-animation-duration) allow-discrete;
	}

	dialog[open] {
		opacity: 1;
		transform: translateY(0);
		scale: 1;
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
			transform: translateY(var(--modal-animation-initial-translate-y));
			scale: var(--modal-animation-initial-scale);
		}
	}

	dialog::backdrop {
		background: var(--modal-overlay-background);
		backdrop-filter: var(--modal-overlay-blur);
		opacity: 0;
		transition:
			opacity var(--modal-animation-duration) var(--modal-animation-easing),
			display var(--modal-animation-duration) allow-discrete,
			overlay var(--modal-animation-duration) allow-discrete;
	}

	dialog[open]::backdrop {
		opacity: 1;
	}

	@starting-style {
		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	dialog.sm {
		max-width: var(--modal-max-width-sm);
		width: 90vw;
	}

	dialog.md {
		max-width: var(--modal-max-width-md);
		width: 90vw;
	}

	dialog.lg {
		max-width: var(--modal-max-width-lg);
		width: 90vw;
	}

	dialog.xl {
		max-width: var(--modal-max-width-xl);
		width: 90vw;
	}

	dialog.full {
		max-width: 95dvw;
		max-height: 95dvh;
		width: 95dvw;
		height: 95dvh;
	}

	.modal-container {
		display: flex;
		flex-direction: column;
		max-height: 90dvh;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--modal-header-padding);
		border-bottom: 1px solid var(--modal-header-border-bottom);
		gap: var(--modal-header-gap);
	}

	.modal-title {
		font-size: var(--modal-title-font-size);
		font-weight: var(--modal-title-font-weight);
		color: var(--modal-title-color);
		margin: 0;
		line-height: 1.4;
	}

	.modal-body {
		padding: var(--modal-body-padding);
		overflow-y: auto;
		flex: 1;
	}

	.modal-footer {
		padding: var(--modal-footer-padding);
		border-top: 1px solid var(--modal-footer-border-top);
		background: var(--modal-footer-background);
		display: flex;
		justify-content: flex-end;
		gap: var(--modal-footer-gap);
		border-radius: 0 0 var(--modal-border-radius) var(--modal-border-radius);
	}

	.modal-close {
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--modal-close-color);
		padding: var(--modal-padding);
		border-radius: var(--modal-close-border-radius);
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--modal-close-size);
		height: var(--modal-close-size);
		transition: color 0.15s ease, background-color 0.15s ease;
		margin-left: auto;
	}

	.modal-close:hover {
		color: var(--modal-close-hover-color);
		background: var(--modal-close-hover-background);
	}
</style>
