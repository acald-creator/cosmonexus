<script lang="ts">
	import * as styles from './Toast.css'
	import { toastRecipe } from './Toast.css'
	import { getToasts, dismiss } from './store.svelte'

	let toasts = $derived(getToasts())
</script>

{#if toasts.length > 0}
	<div class={styles.container} aria-live="polite" aria-label="Notifications">
		{#each toasts as toast (toast.id)}
			<div class={toastRecipe({ variant: toast.variant })} role="status">
				<span>{toast.message}</span>
				<button
					class={styles.dismissBtn}
					onclick={() => dismiss(toast.id)}
					aria-label="Dismiss"
				>
					&times;
				</button>
			</div>
		{/each}
	</div>
{/if}
