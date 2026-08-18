import type { Observable } from 'rxjs'
import { readable, type Readable } from 'svelte/store'

/**
 * Converts an RxJS Observable into a Svelte readable store.
 * Automatically subscribes on first subscriber and unsubscribes when all subscribers leave.
 * SSR-safe: returns initialValue until client-side subscription activates.
 *
 * @example
 * ```svelte
 * <script>
 *   import { fromObservable } from '@cosmonexus/nova-svelte'
 *   const count = fromObservable(count$, 0)
 * </script>
 * <p>{$count}</p>
 * ```
 */
export function fromObservable<T>(observable: Observable<T>, initialValue: T): Readable<T>
export function fromObservable<T>(observable: Observable<T>): Readable<T | undefined>
export function fromObservable<T>(observable: Observable<T>, initialValue?: T): Readable<T | undefined> {
	return readable<T | undefined>(initialValue, (set) => {
		const subscription = observable.subscribe({
			next: (value) => set(value),
			error: (err) => {
				console.error('[nova-svelte] fromObservable error:', err)
			},
		})

		return () => {
			subscription.unsubscribe()
		}
	})
}
