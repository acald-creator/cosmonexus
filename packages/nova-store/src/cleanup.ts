import type { Dependency, Subscriber } from '@cosmonexus/nova-types'

/**
 * Removes a subscriber from all its tracked dependencies and clears its dependency set.
 * Called before re-executing an effect to avoid stale subscriptions.
 */
export function cleanup(running: Subscriber) {
	const depArray: Dependency[] = Array.from(running.dependencies)

	for (const dep of depArray) {
		dep.delete(running)
	}

	running.dependencies.clear()
}
