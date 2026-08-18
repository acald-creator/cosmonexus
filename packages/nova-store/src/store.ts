import {
	BehaviorSubject,
	type Observable,
	type Subscription,
	combineLatest,
	distinctUntilChanged,
	map,
} from 'rxjs'

/** Function that takes the current state and returns the new state. */
export type Action<T> = (state: T) => T

export type StoreType<T> = {
	state$: Observable<T>
	dispatch: (action: Action<T>) => void
}

export type StoreOptions<T> = {
	/** Optional middleware functions. Each receives the state before and after the action. */
	middleware?: StoreMiddleware<T>[]
}

export type StoreMiddleware<T> = (prev: T, next: T, action: Action<T>) => void

/**
 * RxJS-based reactive store with dispatch/select pattern.
 *
 * Provides observable state, synchronous dispatch, selector-based subscriptions,
 * computed derivations, and async dispatch for side-effect-producing operations.
 *
 * @example
 * ```ts
 * const store = new Store({ count: 0, name: '' })
 *
 * store.select('count').subscribe(c => console.log(c))
 * store.dispatch(state => ({ ...state, count: state.count + 1 }))
 * ```
 */
export class Store<T> {
	private readonly state$: BehaviorSubject<T>
	private readonly middleware: StoreMiddleware<T>[]

	constructor(initialState: T, options?: StoreOptions<T>) {
		this.state$ = new BehaviorSubject(initialState)
		this.middleware = options?.middleware ?? []
	}

	/** Get a synchronous snapshot of current state. */
	getState(): T {
		return this.state$.getValue()
	}

	/** Directly set the full state (bypasses middleware). */
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

		for (const mw of this.middleware) {
			mw(prevState, newState, action)
		}

		this.state$.next(newState)
	}

	/** Select a specific property from the state as a distinct Observable. */
	select<K extends keyof T>(key: K): Observable<T[K]> {
		return this.state$.pipe(
			map((state) => state[key]),
			distinctUntilChanged(),
		)
	}

	/**
	 * Derive a computed observable from the store state using a selector function.
	 * Only emits when the derived value changes (using reference equality).
	 *
	 * @example
	 * ```ts
	 * const fullName$ = store.computed(s => `${s.firstName} ${s.lastName}`)
	 * ```
	 */
	computed<R>(selector: (state: T) => R): Observable<R> {
		return this.state$.pipe(
			map(selector),
			distinctUntilChanged(),
		)
	}

	/**
	 * Combine multiple selectors into a single observable that emits a tuple.
	 * Only emits when any of the selected values change.
	 *
	 * @example
	 * ```ts
	 * const [count$, name$] = store.selectMany('count', 'name')
	 * // or combine them:
	 * store.combine('count', 'name').subscribe(([count, name]) => ...)
	 * ```
	 */
	combine<K extends keyof T>(...keys: K[]): Observable<Pick<T, K>> {
		const observables = keys.map((key) => this.select(key))
		return combineLatest(observables).pipe(
			map((values) => {
				const result = {} as Pick<T, K>
				keys.forEach((key, i) => {
					;(result as any)[key] = values[i]
				})
				return result
			}),
			distinctUntilChanged((a, b) => keys.every((key) => Object.is(a[key], b[key]))),
		)
	}

	/**
	 * Dispatch an async action. Runs the async function with current state,
	 * then dispatches the result as a partial state merge.
	 *
	 * @example
	 * ```ts
	 * await store.asyncDispatch(async (state) => {
	 *   const data = await fetchUser(state.userId)
	 *   return { ...state, user: data }
	 * })
	 * ```
	 */
	asyncDispatch = async (runner: (state: T) => Promise<T>): Promise<void> => {
		const payload = await runner(this.state$.getValue())
		this.dispatch(() => payload)
	}

	/** Reset the store to a given state (or initial state if not provided). */
	reset(state?: T): void {
		this.state$.next(state ?? this.state$.getValue())
	}

	/** Get the state as an observable (for combining with other streams). */
	asObservable(): Observable<T> {
		return this.state$.asObservable()
	}

	/** Complete the store's subject (for cleanup). */
	destroy(): void {
		this.state$.complete()
	}
}
