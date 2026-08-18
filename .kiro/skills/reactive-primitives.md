---
name: Nova Reactive Primitives
description: Architecture and usage patterns for @cosmonexus/nova-types, nova-store, and nova-react
tags: [reactive, signals, rxjs, state-management, hooks]
inclusion: manual
---

## When to Apply

- Working with the signal-based reactive system (nova-store)
- Creating React hooks that bind to observables (nova-react)
- Extending the state machine system
- Understanding the reactive dependency tracking

## Signal System (nova-store)

Fine-grained reactive primitives inspired by Solid.js, implemented in vanilla TypeScript.

### createSignal<T>(value): [getter, setter]
- `getter()` — reads the value; auto-tracks the caller if inside an effect/memo
- `setter(newValue)` — writes the value; re-executes all tracked subscribers

### createEffect(fn)
- Runs `fn` immediately
- Auto-subscribes to any signals read during execution
- Re-runs whenever those signals change
- Cleans up old subscriptions before each re-run (avoids stale tracking)

### createMemo<T>(fn): getter
- Derived computation — returns a getter that always reflects `fn()`'s latest result
- Re-computes when dependencies change (combines createSignal + createEffect)

### How Tracking Works
```
context: Subscriber[]  (global stack)

When a signal's getter is called:
  1. Check if context has a running subscriber (top of stack)
  2. If yes: add subscriber to signal's subscriptions Set
  3. Also add signal's subscriptions Set to subscriber's dependencies

When a signal's setter is called:
  1. Update the value
  2. Execute all subscribers in the subscriptions Set

When an effect runs:
  1. cleanup() — remove from all previous dependency Sets
  2. Push self onto context stack
  3. Execute the effect function (signals auto-track)
  4. Pop self from context stack
```

## RxJS Store (nova-store)

Class-based state container for larger state trees.

```typescript
const store = new Store<AppState>(initialState, reducer)

store.getState()                    // current snapshot
store.dispatch(state => newState)   // synchronous update
store.select('key')                 // Observable<T[key]> (distinct)
store.subscribe(callback)           // observe all changes
store.asyncDispatch(type, runner)   // async action
```

## React Hooks (nova-react)

### useObservable<T>(observable$): T | undefined
Subscribes to an RxJS Observable, returns latest emitted value in React state.

### useSubscribe<T>(observable$, callback)
Subscribes for side effects only — doesn't re-render on emission.

### useSnapshot<T>({ initialState })
Creates a BehaviorSubject-backed state container with an observable stream.
Returns `{ snapshot$, updateState, cleanup }`.

### useTheme<T>(): T
Reads theme from nearest `<ThemeProvider>`. Throws if missing.

### createStateMachine()
Linear state machine: INITIAL → SETUP → RUNNING → DONE → INITIAL.
Returns `{ transition, stateChanges$ }`.

## Type System (nova-types)

Key types for the reactive layer:
- `Signal<T>` = `[() => T, (value: T) => void]`
- `Subscriber` = `{ dependencies: Set<Dependency>; execute(): void }`
- `Dependency` = `Set<Subscriber>`
- `Subscribable<T>` = `{ subscribe(cb): Unsubscribable }`
- `UnwrapObservable<Obs>` — extracts T from Subscribable<T>

## References

- `packages/nova-store/src/createSignal.ts` — signal implementation
- `packages/nova-store/src/createEffect.ts` — effect with auto-tracking
- `packages/nova-store/src/store.ts` — RxJS Store class
- `packages/nova-react/src/hooks/use-observable.ts` — React binding
- `packages/nova-types/src/index.ts` — all type definitions
