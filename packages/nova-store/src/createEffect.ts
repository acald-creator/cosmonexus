import type { Subscriber } from '@cosmonexus/nova-types'

import { cleanup } from './cleanup'
import { context } from './createSignal'
import { registerDisposable } from './createScope'

/** Registered cleanup callbacks for the current effect execution. */
let currentCleanups: (() => void)[] | null = null

/**
 * Registers a cleanup callback that runs before the effect re-executes or when disposed.
 * Must be called synchronously inside an effect or scope.
 *
 * @example
 * ```ts
 * createEffect(() => {
 *   const id = setInterval(() => console.log('tick'), 1000)
 *   onCleanup(() => clearInterval(id))
 * })
 * ```
 */
export function onCleanup(fn: () => void): void {
	if (currentCleanups) {
		currentCleanups.push(fn)
	}
}

/**
 * Creates a reactive effect that automatically re-runs when its signal dependencies change.
 *
 * On each execution, the effect's previous subscriptions are cleaned up and re-established
 * based on which signals are read during the current execution.
 *
 * Returns a dispose function to stop the effect and run its cleanup callbacks.
 *
 * @example
 * ```ts
 * const [count, setCount] = createSignal(0)
 *
 * const dispose = createEffect(() => {
 *   console.log('count is:', count())
 *   onCleanup(() => console.log('cleaning up'))
 * })
 *
 * setCount(1) // logs: "cleaning up", then "count is: 1"
 * dispose()   // logs: "cleaning up", effect is stopped
 * ```
 */
export function createEffect(effect: () => void | (() => void)): () => void {
	let disposed = false
	let cleanups: (() => void)[] = []

	const execute = () => {
		if (disposed) return

		// Run previous cleanup callbacks
		for (const fn of cleanups) {
			fn()
		}
		cleanups = []

		// Remove stale subscriptions
		cleanup(running)

		// Set up cleanup registration context
		const prevCleanups = currentCleanups
		currentCleanups = cleanups

		context.push(running)

		try {
			const result = effect()
			// Support returning a cleanup function (alternative to onCleanup)
			if (typeof result === 'function') {
				cleanups.push(result)
			}
		} finally {
			context.pop()
			currentCleanups = prevCleanups
		}
	}

	const running: Subscriber = {
		execute,
		dependencies: new Set(),
	}

	execute()

	// Register with active scope if any
	const dispose = () => {
		if (disposed) return
		disposed = true

		// Run cleanup callbacks
		for (const fn of cleanups) {
			fn()
		}
		cleanups = []

		// Unsubscribe from all signals
		cleanup(running)
	}

	registerDisposable(dispose)

	// Return dispose function
	return dispose
}
