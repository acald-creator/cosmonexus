<script lang="ts" generics="T extends Record<string, unknown>">
	import * as styles from './DataTable.css'
	import type { Snippet } from 'svelte'

	interface Column<T> {
		key: keyof T & string
		label: string
		render?: Snippet<[value: T[keyof T & string], row: T]>
	}

	interface Props {
		columns: Column<T>[]
		data: T[]
		onRowClick?: (row: T) => void
		loading?: boolean
		emptyMessage?: string
		class?: string
	}

	let {
		columns,
		data,
		onRowClick,
		loading = false,
		emptyMessage = 'No data available',
		class: className,
	}: Props = $props()

	let isEmpty = $derived(!loading && data.length === 0)

	function handleRowKeyDown(row: T, e: KeyboardEvent) {
		if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault()
			onRowClick(row)
		}
	}
</script>

<div class={className ? `${styles.tableWrapper} ${className}` : styles.tableWrapper}>
	<table class={styles.table}>
		<thead class={styles.thead}>
			<tr>
				{#each columns as col}
					<th class={styles.th}>{col.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody class={styles.tbody}>
			{#if loading}
				{#each [0, 1, 2] as _}
					<tr class={styles.skeletonRow}>
						{#each columns as col}
							<td class={styles.skeletonCell}>
								<div class={styles.skeleton}></div>
							</td>
						{/each}
					</tr>
				{/each}
			{:else if isEmpty}
				<tr>
					<td class={styles.emptyState} colspan={columns.length}>{emptyMessage}</td>
				</tr>
			{:else}
				{#each data as rowData, index}
					<tr
						class={onRowClick ? `${styles.row} ${styles.rowClickable}` : styles.row}
						tabindex={onRowClick ? 0 : undefined}
						role={onRowClick ? 'button' : undefined}
						onclick={() => onRowClick?.(rowData)}
						onkeydown={(e) => handleRowKeyDown(rowData, e)}
					>
						{#each columns as col}
							<td class={styles.td} data-label={col.label}>
								<span class={styles.cellLabel}>{col.label}:</span>
								{#if col.render}
									{@render col.render(rowData[col.key], rowData)}
								{:else}
									{String(rowData[col.key] ?? '')}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
