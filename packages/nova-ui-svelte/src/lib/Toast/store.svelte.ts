/**
 * Reactive toast notification store using Svelte 5 runes.
 */

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
	id: string
	message: string
	variant: ToastVariant
	duration: number
}

let items: ToastItem[] = $state([])

export function getToasts(): ToastItem[] {
	return items
}

export function addToast(
	message: string,
	variant: ToastVariant = 'info',
	duration = 4000,
): string {
	const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
	const toast: ToastItem = { id, message, variant, duration }
	items = [...items, toast]

	if (duration > 0) {
		setTimeout(() => dismiss(id), duration)
	}

	return id
}

export function dismiss(id: string): void {
	items = items.filter((t) => t.id !== id)
}

export function clearAll(): void {
	items = []
}
