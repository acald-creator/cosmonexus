import { startBatch, endBatch } from './createSignal'

/**
 * Batch multiple signal writes into a single notification pass.
 * Subscribers are only notified once after all writes within the batch complete.
 *
 * @example
 * ```ts
 * const [count, setCount] = createSignal(0)
 * const [name, setName] = createSignal('')
 *
 * // Without batch: effect runs twice
 * // With batch: effect runs once
 * batch(() => {
 *   setCount(1)
 *   setName('hello')
 * })
 * ```
 */
export function batch<T>(fn: () => T): T {
	startBatch()
	try {
		return fn()
	} finally {
		endBatch()
	}
}
