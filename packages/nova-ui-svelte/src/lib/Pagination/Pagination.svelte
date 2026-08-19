<script lang="ts">
	import * as styles from './Pagination.css'

	interface Props {
		currentPage: number
		totalPages: number
		onPageChange: (page: number) => void
		class?: string
	}

	let { currentPage, totalPages, onPageChange, class: className }: Props = $props()

	function getVisiblePages(current: number, total: number): (number | '...')[] {
		if (total <= 7) {
			return Array.from({ length: total }, (_, i) => i + 1)
		}

		const pages: (number | '...')[] = [1]

		if (current <= 3) {
			pages.push(2, 3, 4, 5, '...', total)
		} else if (current >= total - 2) {
			pages.push('...', total - 4, total - 3, total - 2, total - 1, total)
		} else {
			pages.push('...', current - 1, current, current + 1, '...', total)
		}

		return pages
	}

	let pages = $derived(getVisiblePages(currentPage, totalPages))
</script>

<nav
	class={className ? `${styles.container} ${className}` : styles.container}
	aria-label="Pagination"
>
	<button
		class={styles.pageButton}
		disabled={currentPage <= 1}
		onclick={() => onPageChange(currentPage - 1)}
		aria-label="Previous page"
	>
		&laquo;
	</button>

	{#each pages as page, index}
		{#if page === '...'}
			<span class={styles.ellipsis} aria-hidden="true">&hellip;</span>
		{:else}
			<button
				class={page === currentPage ? `${styles.pageButton} ${styles.activeButton}` : styles.pageButton}
				onclick={() => onPageChange(page)}
				aria-label="Page {page}"
				aria-current={page === currentPage ? 'page' : undefined}
			>
				{page}
			</button>
		{/if}
	{/each}

	<button
		class={styles.pageButton}
		disabled={currentPage >= totalPages}
		onclick={() => onPageChange(currentPage + 1)}
		aria-label="Next page"
	>
		&raquo;
	</button>
</nav>
