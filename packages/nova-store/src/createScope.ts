/**
 * A scope groups reactive effects so they can be disposed together.
 * Useful for component lifecycle management — dispose all effects on unmount.
 *
 * @example
 * ```ts
 * const scope = createScope()
 *
 * scope.run(() => {
 *   createEffect(() => console.log(count()))
 *   createEffect(() => console.log(name()))
 * })
 *
 * // Later: dispose all effects in the scope
 * scope.dispose()
 * ```
 */
export type Scope = {
	/** Run a function within this scope. Effects created inside are tracked. */
	run<T>(fn: () => T): T
	/** Dispose all effects and nested scopes within this scope. */
	dispose(): void
	/** Whether this scope has been disposed. */
	readonly disposed: boolean
}

/** Currently active scope (if any). */
let activeScope: ScopeInternal | null = null

interface ScopeInternal extends Scope {
	disposables: (() => void)[]
}

/**
 * Get the currently active scope (used internally by createEffect to register).
 */
export function getActiveScope(): ScopeInternal | null {
	return activeScope
}

/**
 * Register a dispose function with the active scope (called by createEffect internally).
 */
export function registerDisposable(dispose: () => void): void {
	if (activeScope) {
		activeScope.disposables.push(dispose)
	}
}

/**
 * Creates a new reactive scope.
 * Effects created within `scope.run()` are automatically tracked and disposed together.
 */
export function createScope(): Scope {
	const scope: ScopeInternal = {
		disposables: [],
		disposed: false,

		run<T>(fn: () => T): T {
			const prevScope = activeScope
			activeScope = scope

			try {
				return fn()
			} finally {
				activeScope = prevScope
			}
		},

		dispose() {
			if (scope.disposed) return
			;(scope as any).disposed = true

			for (const dispose of scope.disposables) {
				dispose()
			}
			scope.disposables = []
		},
	}

	// If created inside another scope, register as a nested disposable
	if (activeScope) {
		activeScope.disposables.push(() => scope.dispose())
	}

	return scope
}
