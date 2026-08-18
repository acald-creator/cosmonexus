import { type Accessor, For, Show } from 'solid-js'
import { activeButton, container, ellipsis, pageButton } from './Pagination.css'

export interface PaginationProps {
	currentPage: Accessor<number>
	totalPages: Accessor<number>
	onPageChange: (page: number) => void
}

/**
 * Computes the visible page numbers, capping at 5 visible with ellipsis if totalPages > 7.
 */
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

export function Pagination(props: PaginationProps) {
	const pages = () => getVisiblePages(props.currentPage(), props.totalPages())

	return (
		<nav class={container} aria-label="Pagination">
			<button
				class={pageButton}
				disabled={props.currentPage() <= 1}
				onClick={() => props.onPageChange(props.currentPage() - 1)}
				aria-label="Previous page"
			>
				&laquo;
			</button>

			<For each={pages()}>
				{(page) => (
					<Show
						when={page !== '...'}
						fallback={
							<span class={ellipsis} aria-hidden="true">
								&hellip;
							</span>
						}
					>
						<button
							class={`${pageButton} ${page === props.currentPage() ? activeButton : ''}`}
							onClick={() => props.onPageChange(page as number)}
							aria-label={`Page ${page}`}
							aria-current={page === props.currentPage() ? 'page' : undefined}
						>
							{page}
						</button>
					</Show>
				)}
			</For>

			<button
				class={pageButton}
				disabled={props.currentPage() >= props.totalPages()}
				onClick={() => props.onPageChange(props.currentPage() + 1)}
				aria-label="Next page"
			>
				&raquo;
			</button>
		</nav>
	)
}
