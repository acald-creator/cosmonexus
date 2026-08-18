import type { Store } from '@cosmonexus/nova-store'
import { readable, writable, type Readable, type Writable } from 'svelte/store'

/**
 * Converts a Nova Store into a Svelte readable store that tracks all state changes.
 * For selective subscriptions, use `fromStoreSelect` instead.
 *
 * @example
 * ```svelte
 * <script>
 *   import { fromStore } from '@cosmonexus/nova-svelte'
 *   import { appStore } from './stores'
 *   const state = fromStore(appStore)
 * </script>
 * <p>{$state.count}</p>
 * ```
 */
export function fromStore<T>(store: Store<T>): Readable<T> {
	return readable<T>(store.getState(), (set) => {
		const subscription = store.subscribe((state) => set(state))

		return () => {
			subscription.unsubscribe()
		}
	})
}

/**
 * Subscribes to a specific property of a Nova Store as a distinct Svelte readable store.
 * Only emits when the selected value actually changes.
 *
 * @example
 * ```svelte
 * <script>
 *   import { fromStoreSelect } from '@cosmonexus/nova-svelte'
 *   import { appStore } from './stores'
 *   const count = fromStoreSelect(appStore, 'count')
 * </script>
 * <p>{$count}</p>
 * ```
 */
export function fromStoreSelect<T, K extends keyof T>(store: Store<T>, key: K): Readable<T[K]> {
	return readable<T[K]>(store.getState()[key], (set) => {
		const subscription = store.select(key).subscribe((value) => set(value))

		return () => {
			subscription.unsubscribe()
		}
	})
}

/**
 * Creates a two-way binding between a Nova Store property and a Svelte writable store.
 * Writing to the Svelte store dispatches an update to the Nova Store.
 *
 * @example
 * ```svelte
 * <script>
 *   import { fromStoreWritable } from '@cosmonexus/nova-svelte'
 *   import { appStore } from './stores'
 *   const name = fromStoreWritable(appStore, 'name')
 * </script>
 * <input bind:value={$name} />
 * ```
 */
export function fromStoreWritable<T, K extends keyof T>(store: Store<T>, key: K): Writable<T[K]> {
	const { subscribe, set: svelteSet } = writable<T[K]>(store.getState()[key])

	// Sync Nova Store → Svelte store
	const subscription = store.select(key).subscribe((value) => {
		svelteSet(value)
	})

	return {
		subscribe,
		set(value: T[K]) {
			store.dispatch((state) => ({ ...state, [key]: value }))
		},
		update(fn: (value: T[K]) => T[K]) {
			const currentValue = store.getState()[key]
			store.dispatch((state) => ({ ...state, [key]: fn(currentValue) }))
		},
	}
}
