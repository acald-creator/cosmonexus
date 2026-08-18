import { type Accessor, For, type JSX, Show } from 'solid-js'
import {
	cellLabel,
	emptyState,
	row,
	rowClickable,
	skeleton,
	skeletonCell,
	skeletonRow,
	table,
	tableWrapper,
	tbody,
	td,
	th,
	thead,
} from './DataTable.css'

export interface Column<T> {
	key: keyof T & string
	label: string
	render?: (value: T[keyof T & string], row: T) => JSX.Element
}

export interface DataTableProps<T extends Record<string, unknown>> {
	columns: Column<T>[]
	data: Accessor<T[]>
	onRowClick?: (row: T) => void
	loading?: Accessor<boolean>
	emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>(props: DataTableProps<T>) {
	const isLoading = () => props.loading?.() ?? false
	const isEmpty = () => !isLoading() && props.data().length === 0

	function handleRowKeyDown(rowData: T, e: KeyboardEvent) {
		if (props.onRowClick && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault()
			props.onRowClick(rowData)
		}
	}

	return (
		<div class={tableWrapper}>
			<table class={table}>
				<thead class={thead}>
					<tr>
						<For each={props.columns}>{(col) => <th class={th}>{col.label}</th>}</For>
					</tr>
				</thead>
				<tbody class={tbody}>
					<Show when={isLoading()}>
						<For each={[0, 1, 2]}>
							{() => (
								<tr class={skeletonRow}>
									<For each={props.columns}>
										{() => (
											<td class={skeletonCell}>
												<div class={skeleton} />
											</td>
										)}
									</For>
								</tr>
							)}
						</For>
					</Show>

					<Show when={isEmpty()}>
						<tr>
							<td class={emptyState} colSpan={props.columns.length}>
								{props.emptyMessage ?? 'No data available'}
							</td>
						</tr>
					</Show>

					<Show when={!isLoading() && !isEmpty()}>
						<For each={props.data()}>
							{(rowData) => (
								<tr
									class={`${row} ${props.onRowClick ? rowClickable : ''}`}
									tabIndex={props.onRowClick ? 0 : undefined}
									role={props.onRowClick ? 'button' : undefined}
									onClick={() => props.onRowClick?.(rowData)}
									onKeyDown={(e) => handleRowKeyDown(rowData, e)}
								>
									<For each={props.columns}>
										{(col) => (
											<td class={td}>
												<span class={cellLabel}>{col.label}:</span>
												{col.render
													? col.render(rowData[col.key], rowData)
													: String(rowData[col.key] ?? '')}
											</td>
										)}
									</For>
								</tr>
							)}
						</For>
					</Show>
				</tbody>
			</table>
		</div>
	)
}
