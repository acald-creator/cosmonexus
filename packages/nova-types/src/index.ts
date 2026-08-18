/**
 * @cosmonexus/nova-types
 *
 * Foundational TypeScript types for the Nova reactive system and prose editor.
 * Groups: Utility, Reactive/Signal, Observable, Store, Scope, Prose/Novel.
 */

// === Utility Types ===

/** Generic string-keyed record. */
export type Dict<T = unknown> = Record<string, T>

/** Make specific keys required while keeping the rest partial. */
export type RequiredBy<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>

/** Make all properties deeply partial. */
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** Extract keys from T whose values extend V. */
export type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]

// === Signal / Reactive Types ===

/** A set of subscribers tracking a reactive dependency. */
export type Dependency = Set<Subscriber>

/** A reactive subscriber with tracked dependencies and an execute function. */
export type Subscriber = {
	dependencies: Set<Dependency>
	execute(): void
}

/** A signal tuple: [getter, setter]. */
export type Signal<T> = [() => T, (value: T) => void]

/** A read-only signal (getter only, typically from createMemo). */
export type ReadonlySignal<T> = () => T

/** A function that disposes a reactive subscription or effect. */
export type Dispose = () => void

/** Options for signal creation. */
export type SignalOptions<T> = {
	/** Custom equality function. Return true if values are equal (skip update). */
	equals?: (prev: T, next: T) => boolean
}

// === Scope Types ===

/** A reactive scope that groups effects for batch disposal. */
export type Scope = {
	/** Run a function within this scope. Effects created inside are tracked. */
	run<T>(fn: () => T): T
	/** Dispose all effects and nested scopes. */
	dispose(): void
	/** Whether this scope has been disposed. */
	readonly disposed: boolean
}

// === Observable / Reactive Types ===

export type Unsubscribable = { unsubscribe: () => void }

export type Subscribable<T = unknown> = {
	subscribe: (callback: (value: T) => void) => Unsubscribable
}

export type ObservableLookup = Record<string, Subscribable>

/** Extract the inner value type from a Subscribable. */
export type UnwrapObservable<Obs> = Obs extends Subscribable<infer T> ? T : never

/** Unwrap all values in a record of Subscribables. */
export type UnwrapObservableLookup<TLookup extends ObservableLookup> = {
	[Key in keyof TLookup]: UnwrapObservable<TLookup[Key]>
}

// === Store Types ===

/** Function that takes the current state and returns the new state. */
export type Action<T> = (state: T) => T

/** Middleware function called on every dispatch. */
export type StoreMiddleware<T> = (prev: T, next: T, action: Action<T>) => void

/** Options for Store creation. */
export type StoreOptions<T> = {
	middleware?: StoreMiddleware<T>[]
}

// === Event Emitter Types ===

/** A generic typed event map. */
export type EventMap = Record<string, unknown>

/** A typed event handler. */
export type EventHandler<T> = (payload: T) => void

/** Typed event emitter interface. */
export type TypedEventEmitter<Events extends EventMap> = {
	on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): Dispose
	off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void
	emit<K extends keyof Events>(event: K, payload: Events[K]): void
}

// === Prose / Novel Types ===

export type {
	NovelId,
	ChapterId,
	ChapterStatus,
	ChapterMeta,
	NovelMeta,
	DocumentJSON,
	NodeJSON,
	MarkJSON,
	Chapter,
	WordCount,
	WritingProgress,
	WritingSession,
	EditorEventMap,
	EditorEventPayload,
	Annotation,
	ExportFormat,
	ExportOptions,
} from './prose'
