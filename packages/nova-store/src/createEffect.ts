import type { Subscriber } from '@cosmonexus/nova-types'

import { cleanup } from './cleanup'
import { context } from './createSignal'

/**
 * Creates a reactive effect that automatically re-runs when its signal dependencies change.
 *
 * On each execution, the effect's previous subscriptions are cleaned up and re-established
 * based on which signals are read during the current execution.
 */
export function createEffect(effect: () => void) {
	const execute = () => {
		cleanup(running)
		context.push(running)

		try {
			effect()
		} finally {
			context.pop()
		}
	}

	const running: Subscriber = {
		execute,
		dependencies: new Set(),
	}

	execute()
}
