<script lang="ts">
	interface Props {
		page: number;
		totalPages: number;
		onPageChange: (page: number) => void;
		siblings?: number;
		showFirstLast?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		page,
		totalPages,
		onPageChange,
		siblings = 1,
		showFirstLast = true,
		size = 'md',
		class: className = ''
	}: Props = $props();

	let pages = $derived.by(() => {
		const result: (number | 'ellipsis')[] = [];
		const start = Math.max(2, page - siblings);
		const end = Math.min(totalPages - 1, page + siblings);

		result.push(1);
		if (start > 2) result.push('ellipsis');
		for (let i = start; i <= end; i++) result.push(i);
		if (end < totalPages - 1) result.push('ellipsis');
		if (totalPages > 1) result.push(totalPages);

		return result;
	});

	let classes = $derived(
		['pagination', `pagination--${size}`, className].filter(Boolean).join(' ')
	);
</script>

<nav aria-label="Pagination" class={classes}>
	{#if showFirstLast}
		<button
			class="page-btn"
			disabled={page === 1}
			onclick={() => onPageChange(1)}
			aria-label="First page"
		>
			&laquo;
		</button>
	{/if}

	<button
		class="page-btn"
		disabled={page === 1}
		onclick={() => onPageChange(page - 1)}
		aria-label="Previous page"
	>
		&lsaquo;
	</button>

	{#each pages as p, i (typeof p === 'number' ? p : `ellipsis-${i}`)}
		{#if p === 'ellipsis'}
			<span class="ellipsis">&hellip;</span>
		{:else}
			<button
				class="page-btn"
				class:active={p === page}
				onclick={() => onPageChange(p)}
				aria-current={p === page ? 'page' : undefined}
			>
				{p}
			</button>
		{/if}
	{/each}

	<button
		class="page-btn"
		disabled={page === totalPages}
		onclick={() => onPageChange(page + 1)}
		aria-label="Next page"
	>
		&rsaquo;
	</button>

	{#if showFirstLast}
		<button
			class="page-btn"
			disabled={page === totalPages}
			onclick={() => onPageChange(totalPages)}
			aria-label="Last page"
		>
			&raquo;
		</button>
	{/if}
</nav>

<style>
	.pagination {
		display: flex;
		align-items: center;
		gap: var(--pagination-container-gap);
	}

	.page-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--pagination-item-border-radius);
		font-size: var(--pagination-item-font-size);
		font-weight: var(--pagination-item-font-weight);
		background: var(--pagination-button-background);
		border: var(--pagination-item-border-width) solid var(--pagination-button-border-color);
		color: var(--pagination-button-color);
		cursor: pointer;
		transition:
			background-color 150ms ease,
			border-color 150ms ease;
	}

	.page-btn:hover:not(:disabled):not(.active) {
		background-color: var(--pagination-button-background-hover);
		border-color: var(--pagination-button-border-color-hover);
	}

	.page-btn:disabled {
		color: var(--pagination-button-color-disabled);
		cursor: not-allowed;
	}

	.page-btn.active {
		background-color: var(--pagination-button-background-active);
		color: var(--pagination-button-color-active);
		border-color: var(--pagination-button-background-active);
	}

	.ellipsis {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		cursor: default;
		color: var(--pagination-ellipsis-color);
		font-weight: var(--pagination-item-font-weight);
	}

	/* Size: sm */
	.pagination--sm .page-btn,
	.pagination--sm .ellipsis {
		min-width: var(--pagination-size-sm-min-width);
		height: var(--pagination-size-sm-height);
		font-size: var(--pagination-size-sm-font-size);
	}

	/* Size: md */
	.pagination--md .page-btn,
	.pagination--md .ellipsis {
		min-width: var(--pagination-size-md-min-width);
		height: var(--pagination-size-md-height);
		font-size: var(--pagination-size-md-font-size);
	}

	/* Size: lg */
	.pagination--lg .page-btn,
	.pagination--lg .ellipsis {
		min-width: var(--pagination-size-lg-min-width);
		height: var(--pagination-size-lg-height);
		font-size: var(--pagination-size-lg-font-size);
	}
</style>
