import {
	BehaviorSubject,
	type Observable,
	type Subscription,
	distinctUntilChanged,
	map,
} from 'rxjs'

/** Function that takes the current state and returns the new state. */
export type Action<T> = (state: T) => T

export type Reducer<T> = (state: T, action: Action<T>) => T

export type StoreType<T> = {
	state$: Observable<T>
	dispatch: (action: Action<T>) => void
}

/**
 * RxJS-based reactive store with dispatch/select pattern.
 *
 * Provides observable state, synchronous dispatch, selector-based subscriptions,
 * and async dispatch for side-effect-producing operations.
 */
export class Store<T> {
	private readonly state$: BehaviorSubject<T>

	constructor(
		private readonly initialState: T,
		private readonly reducer: Reducer<T>,
	) {
		this.state$ = new BehaviorSubject(initialState)
	}

	getState(): T {
		return this.state$.getValue()
	}

	setState(newState: T): void {
		this.state$.next(newState)
	}

	/** Subscribe to all state changes. */
	subscribe(callback: (state: T) => void): Subscription {
		return this.state$.subscribe(callback)
	}

	/** Dispatch an action to update the state synchronously. */
	dispatch = (action: Action<T>): void => {
		const prevState = this.state$.getValue()
		const newState = action(prevState)
		this.state$.next(newState)
	}

	/** Select a specific property from the state as a distinct Observable. */
	select<K extends keyof T>(key: K): Observable<T[K]> {
		return this.state$.pipe(
			map((state) => state[key]),
			distinctUntilChanged(),
		)
	}

	/** Asynchronously dispatch — runs an async function then applies the result. */
	asyncDispatch = async (_type: string, runner: (state: T) => Promise<T>): Promise<void> => {
		const payload = await runner(this.state$.getValue())
		this.dispatch((state) => ({ ...state, ...payload }))
	}
}
