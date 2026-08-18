import { context } from './createSignal'

/**
 * Reads signals without subscribing to them.
 * Any signal reads inside the callback will not be tracked by the current effect/memo.
 *
 * @example
 * ```ts
 * createEffect(() => {
 *   const tracked = count()     // subscribes to count
 *   const ignored = untrack(() => name())  // does NOT subscribe to name
 *   console.log(tracked, ignored)
 * })
 * ```
 */
export function untrack<T>(fn: () => T): T {
	const prev = context.length
	// Temporarily remove the tracking context
	const saved = context.splice(0, context.length)
	try {
		return fn()
	} finally {
		// Restore the tracking context
		context.push(...saved)
	}
}
