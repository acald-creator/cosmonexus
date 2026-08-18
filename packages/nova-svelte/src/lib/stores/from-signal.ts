import type { Signal } from '@cosmonexus/nova-types'
import { createEffect } from '@cosmonexus/nova-store'
import { writable, type Writable } from 'svelte/store'

/**
 * Converts a Nova signal [getter, setter] into a Svelte writable store.
 * Reads are tracked via a Nova effect; writes go through the signal setter.
 *
 * @example
 * ```svelte
 * <script>
 *   import { fromSignal } from '@cosmonexus/nova-svelte'
 *   import { countSignal } from './signals'
 *   const count = fromSignal(countSignal)
 * </script>
 * <button on:click={() => $count++}>{$count}</button>
 * ```
 */
export function fromSignal<T>(signal: Signal<T>): Writable<T> {
	const [get, set] = signal
	const { subscribe, set: svelteSet } = writable<T>(get())

	// Track signal changes via Nova's effect system and push to Svelte store
	createEffect(() => {
		const value = get()
		svelteSet(value)
	})

	return {
		subscribe,
		set(value: T) {
			set(value)
		},
		update(fn: (value: T) => T) {
			set(fn(get()))
		},
	}
}
