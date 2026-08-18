/**
 * @cosmonexus/nova-types
 *
 * Foundational TypeScript types for the Nova reactive system.
 * Groups: Utility, UI/Component, Machine, Observable/Reactive, Signal.
 */

// === Utility Types ===

/** Generic string-keyed record. */
export type Dict<T = unknown> = Record<string, T>

/** Make specific keys required while keeping the rest partial. */
export type RequiredBy<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>

// === UI / Component Types ===

export type Direction = 'ltr' | 'rtl'

export type Orientation = 'horizontal' | 'vertical'

export type DirectionProperty = {
	dir?: Direction
}

export type CommonProperties = {
	id: string
	getRootNode?: () => ShadowRoot | Document | Node
}

export type RootProperties = {
	doc?: Document
	rootNode?: ShadowRoot
	pointerdownNode?: HTMLElement | undefined
}

/** Merges a context type T with root DOM properties. */
export type Context<T> = T & RootProperties

type PropTypesKeys =
	| 'button'
	| 'label'
	| 'input'
	| 'img'
	| 'output'
	| 'element'
	| 'select'
	| 'style'

export type PropTypes<T = Dict> = Record<PropTypesKeys, T>

// === Machine Types ===

export type MachineContextType = Record<string, unknown>

export type MachineStateType = Record<string, unknown>

// === Observable / Reactive Types ===

export type Unsubscribable = { unsubscribe: () => void }

export type Subscribable<T = unknown> = {
	subscribe: (callback: (value: T) => void) => Unsubscribable
}

export type ObservableLookup = Record<string, Subscribable>

/**
 * Fixed-length tuple of Subscribables (up to 8).
 * Preserves individual type information for each position.
 */
export type ObservableTuple =
	| [Subscribable]
	| [Subscribable, Subscribable]
	| [Subscribable, Subscribable, Subscribable]
	| [Subscribable, Subscribable, Subscribable, Subscribable]
	| [Subscribable, Subscribable, Subscribable, Subscribable, Subscribable]
	| [Subscribable, Subscribable, Subscribable, Subscribable, Subscribable, Subscribable]
	| [
			Subscribable,
			Subscribable,
			Subscribable,
			Subscribable,
			Subscribable,
			Subscribable,
			Subscribable,
	  ]
	| [
			Subscribable,
			Subscribable,
			Subscribable,
			Subscribable,
			Subscribable,
			Subscribable,
			Subscribable,
			Subscribable,
	  ]

/** Extract the inner value type from a Subscribable. */
export type UnwrapObservable<Obs> = Obs extends Subscribable<infer T> ? T : never

/** Unwrap all values in a record or tuple of Subscribables. */
export type UnwrapObservableLookup<TObservableLookup extends ObservableLookup | ObservableTuple> = {
	[Key in keyof TObservableLookup]: UnwrapObservable<TObservableLookup[Key]>
}

/** Unwrap all values in a tuple of Subscribables. */
export type UnwrapObservableTuple<TObservables extends ObservableTuple> = {
	[Index in keyof TObservables]: TObservables[Index] extends Subscribable<infer TValue>
		? TValue
		: never
}

/** Unwrap any observable-like structure (single, tuple, or lookup). */
export type UnwrapAny<TObs> = TObs extends Subscribable
	? UnwrapObservable<TObs>
	: TObs extends ObservableTuple
		? UnwrapObservableTuple<TObs>
		: TObs extends ObservableLookup
			? UnwrapObservableLookup<TObs>
			: never

// === Signal Types ===

/** A set of subscribers tracking a reactive dependency. */
export type Dependency = Set<Subscriber>

/** A reactive subscriber with tracked dependencies and an execute function. */
export type Subscriber = {
	dependencies: Set<Dependency>
	execute(): void
}

/** A signal tuple: [getter, setter]. */
export type Signal<T> = [() => T, (value: T) => void]

/** A function that disposes a reactive subscription or effect. */
export type Dispose = () => void

/** A read-only signal (getter only, typically from createMemo). */
export type ReadonlySignal<T> = () => T
