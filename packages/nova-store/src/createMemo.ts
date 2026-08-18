import { createEffect } from './createEffect'
import { createSignal } from './createSignal'

/**
 * Creates a derived reactive value (memoized computation).
 *
 * Returns a getter that always reflects the latest computed value.
 * Re-computes whenever its signal dependencies change.
 */
export function createMemo<T>(fn: () => T): () => T {
	const [read, write] = createSignal<T>(fn())

	createEffect(() => {
		write(fn())
	})

	return read
}
