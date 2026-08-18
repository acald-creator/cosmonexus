import * as styles from './Pagination.css'

export interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
	className?: string
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

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
	const pages = getVisiblePages(currentPage, totalPages)

	return (
		<nav
			className={className ? `${styles.container} ${className}` : styles.container}
			aria-label="Pagination"
		>
			<button
				className={styles.pageButton}
				disabled={currentPage <= 1}
				onClick={() => onPageChange(currentPage - 1)}
				aria-label="Previous page"
			>
				&laquo;
			</button>

			{pages.map((page, index) =>
				page === '...' ? (
					<span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
						&hellip;
					</span>
				) : (
					<button
						key={page}
						className={`${styles.pageButton}${page === currentPage ? ` ${styles.activeButton}` : ''}`}
						onClick={() => onPageChange(page)}
						aria-label={`Page ${page}`}
						aria-current={page === currentPage ? 'page' : undefined}
					>
						{page}
					</button>
				),
			)}

			<button
				className={styles.pageButton}
				disabled={currentPage >= totalPages}
				onClick={() => onPageChange(currentPage + 1)}
				aria-label="Next page"
			>
				&raquo;
			</button>
		</nav>
	)
}
