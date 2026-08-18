import { createEffect } from '@cosmonexus/nova-store'
import type { MachineContextType, MachineStateType } from '@cosmonexus/nova-types'
import {
	BehaviorSubject,
	type Observable,
	Subject,
	distinctUntilChanged,
	map,
	switchMap,
} from 'rxjs'

export const states = {
	INITIAL: 'INITIAL',
	SETUP: 'SETUP',
	RUNNING: 'RUNNING',
	DONE: 'DONE',
} as const

const transitions: Record<string, string> = {
	[states.INITIAL]: states.SETUP,
	[states.SETUP]: states.RUNNING,
	[states.RUNNING]: states.DONE,
	[states.DONE]: states.INITIAL,
}

/**
 * Creates a simple linear state machine backed by RxJS.
 * States progress: INITIAL → SETUP → RUNNING → DONE → INITIAL.
 */
export function createStateMachine<
	_Context extends MachineContextType = MachineContextType,
	State extends MachineStateType = MachineStateType,
>(): {
	transition: () => void
	stateChanges$: Observable<{ state: State }>
} {
	const currentStateSubject = new BehaviorSubject<string>(states.INITIAL)
	const stateChangeObject = new Subject<{ state: State }>()

	function transition() {
		currentStateSubject.next(transitions[currentStateSubject.value])
	}

	createEffect(() => {
		const stateChangeSubscription = currentStateSubject
			.pipe(
				distinctUntilChanged(),
				switchMap(async (currentState) => {
					if (currentState === (states.RUNNING as string)) {
						return new Promise<void>((resolve) => {
							setTimeout(() => {
								resolve()
							}, 2000)
						})
					}
					return Promise.resolve()
				}),
				map((currentState) => {
					return { state: currentState as unknown as State }
				}),
			)
			.subscribe((state) => {
				stateChangeObject.next(state)
			})

		return () => {
			stateChangeSubscription.unsubscribe()
		}
	})

	return {
		transition,
		stateChanges$: stateChangeObject.asObservable(),
	}
}
