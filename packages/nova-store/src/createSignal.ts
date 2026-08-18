import type { Dependency, Signal, Subscriber } from '@cosmonexus/nova-types'

/** Global tracking context stack. The top entry is the currently executing subscriber. */
export const context: Subscriber[] = []

/**
 * Creates a reactive signal — a [getter, setter] tuple.
 *
 * When the getter is called inside a tracked scope (effect/memo),
 * the caller is automatically subscribed to changes.
 * When the setter is called, all subscribers are re-executed.
 */
export function createSignal<T>(value: T): Signal<T> {
	const subscriptions: Dependency = new Set()

	const read = () => {
		const running = context[context.length - 1]

		if (running) {
			subscriptions.add(running)
			running.dependencies.add(subscriptions)
		}

		return value
	}

	const write = (nextValue: T) => {
		value = nextValue

		for (const sub of [...subscriptions]) {
			;(sub as Subscriber).execute()
		}
	}

	return [read, write]
}
