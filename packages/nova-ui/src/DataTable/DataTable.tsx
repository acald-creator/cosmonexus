import type { KeyboardEvent, ReactNode } from 'react'
import * as styles from './DataTable.css'

export interface Column<T> {
	key: keyof T & string
	label: string
	render?: (value: T[keyof T & string], row: T) => ReactNode
}

export interface DataTableProps<T extends Record<string, unknown>> {
	columns: Column<T>[]
	data: T[]
	onRowClick?: (row: T) => void
	loading?: boolean
	emptyMessage?: string
	className?: string
}

export function DataTable<T extends Record<string, unknown>>({
	columns,
	data,
	onRowClick,
	loading = false,
	emptyMessage = 'No data available',
	className,
}: DataTableProps<T>) {
	const isEmpty = !loading && data.length === 0

	function handleRowKeyDown(rowData: T, e: KeyboardEvent<HTMLTableRowElement>) {
		if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault()
			onRowClick(rowData)
		}
	}

	return (
		<div className={className ? `${styles.tableWrapper} ${className}` : styles.tableWrapper}>
			<table className={styles.table}>
				<thead className={styles.thead}>
					<tr>
						{columns.map((col) => (
							<th key={col.key} className={styles.th}>
								{col.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody className={styles.tbody}>
					{loading &&
						[0, 1, 2].map((i) => (
							<tr key={`skeleton-${i}`} className={styles.skeletonRow}>
								{columns.map((col) => (
									<td key={col.key} className={styles.skeletonCell}>
										<div className={styles.skeleton} />
									</td>
								))}
							</tr>
						))}

					{isEmpty && (
						<tr>
							<td className={styles.emptyState} colSpan={columns.length}>
								{emptyMessage}
							</td>
						</tr>
					)}

					{!loading &&
						!isEmpty &&
						data.map((rowData, index) => (
							<tr
								key={index}
								className={`${styles.row}${onRowClick ? ` ${styles.rowClickable}` : ''}`}
								tabIndex={onRowClick ? 0 : undefined}
								role={onRowClick ? 'button' : undefined}
								onClick={() => onRowClick?.(rowData)}
								onKeyDown={(e) => handleRowKeyDown(rowData, e)}
							>
								{columns.map((col) => (
									<td key={col.key} className={styles.td} data-label={col.label}>
										<span className={styles.cellLabel}>{col.label}:</span>
										{col.render
											? col.render(rowData[col.key], rowData)
											: String(rowData[col.key] ?? '')}
									</td>
								))}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}
