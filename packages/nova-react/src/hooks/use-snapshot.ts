import { useMemo, useRef } from 'react'
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs'

type SnapshotOptions<T> = {
	initialState: T
}

/**
 * Creates a BehaviorSubject-backed state container with an observable snapshot stream.
 * Useful for bridging imperative state updates with reactive RxJS streams.
 */
export function useSnapshot<T>(options: SnapshotOptions<T>) {
	const stateSubject = useRef(new BehaviorSubject<T>(options.initialState))

	const updateState = (newState: T) => {
		stateSubject.current.next(newState)
	}

	const snapshot$ = useMemo(
		() =>
			stateSubject.current.asObservable().pipe(
				distinctUntilChanged(),
				map((state) => ({ ...state })),
			),
		[],
	)

	const cleanup = () => {
		stateSubject.current.complete()
	}

	return { snapshot$, updateState, cleanup }
}
