import type { Dependency, Signal, Subscriber } from '@cosmonexus/nova-types'

/** Global tracking context stack. The top entry is the currently executing subscriber. */
export const context: Subscriber[] = []

/** Queue of pending subscribers during a batch. null when not batching. */
let batchQueue: Set<Subscriber> | null = null

/** Whether we're currently inside a batch. */
export function isBatching(): boolean {
	return batchQueue !== null
}

/** Start a batch — subscriber notifications are deferred. */
export function startBatch(): void {
	batchQueue = batchQueue ?? new Set()
}

/** End a batch — flush all deferred subscriber notifications. */
export function endBatch(): void {
	const queue = batchQueue
	batchQueue = null
	if (queue) {
		for (const sub of queue) {
			sub.execute()
		}
	}
}

export type SignalOptions<T> = {
	/** Custom equality function. Return true if values are considered equal (skip notification). */
	equals?: (prev: T, next: T) => boolean
}

/**
 * Creates a reactive signal — a [getter, setter] tuple.
 *
 * When the getter is called inside a tracked scope (effect/memo),
 * the caller is automatically subscribed to changes.
 * When the setter is called, all subscribers are re-executed
 * (unless the new value is equal to the old value per the equality check).
 *
 * @param value - Initial value
 * @param options - Optional config (equality function)
 */
export function createSignal<T>(value: T, options?: SignalOptions<T>): Signal<T> {
	const subscriptions: Dependency = new Set()
	const equals = options?.equals ?? Object.is

	const read = () => {
		const running = context[context.length - 1]

		if (running) {
			subscriptions.add(running)
			running.dependencies.add(subscriptions)
		}

		return value
	}

	const write = (nextValue: T) => {
		if (equals(value, nextValue)) return

		value = nextValue

		if (batchQueue) {
			// Batching: defer notifications
			for (const sub of subscriptions) {
				batchQueue.add(sub)
			}
		} else {
			// Immediate: notify subscribers
			for (const sub of [...subscriptions]) {
				;(sub as Subscriber).execute()
			}
		}
	}

	return [read, write]
}
