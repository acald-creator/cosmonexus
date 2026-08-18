import { describe, it, expect, vi } from 'vitest'
import { Store } from '../store'

type TestState = {
	count: number
	name: string
	items: string[]
}

const initialState: TestState = { count: 0, name: 'test', items: [] }

describe('Store', () => {
	it('initializes with given state', () => {
		const store = new Store(initialState)
		expect(store.getState()).toEqual(initialState)
	})

	it('dispatches actions to update state', () => {
		const store = new Store(initialState)
		store.dispatch((s) => ({ ...s, count: s.count + 1 }))
		expect(store.getState().count).toBe(1)
	})

	it('notifies subscribers on state change', () => {
		const store = new Store(initialState)
		const fn = vi.fn()
		store.subscribe(fn)

		store.dispatch((s) => ({ ...s, count: 5 }))
		expect(fn).toHaveBeenCalledWith({ ...initialState, count: 5 })
	})

	it('select emits distinct values for a key', () => {
		const store = new Store(initialState)
		const values: number[] = []
		store.select('count').subscribe((v) => values.push(v))

		store.dispatch((s) => ({ ...s, name: 'changed' })) // count didn't change
		store.dispatch((s) => ({ ...s, count: 1 }))
		store.dispatch((s) => ({ ...s, count: 1 })) // same value
		store.dispatch((s) => ({ ...s, count: 2 }))

		expect(values).toEqual([0, 1, 2])
	})

	it('computed derives from state', () => {
		const store = new Store(initialState)
		const values: string[] = []
		store.computed((s) => `${s.name}:${s.count}`).subscribe((v) => values.push(v))

		store.dispatch((s) => ({ ...s, count: 1 }))
		store.dispatch((s) => ({ ...s, name: 'hello' }))

		expect(values).toEqual(['test:0', 'test:1', 'hello:1'])
	})

	it('combine selects multiple keys', () => {
		const store = new Store(initialState)
		const values: any[] = []
		store.combine('count', 'name').subscribe((v) => values.push(v))

		store.dispatch((s) => ({ ...s, count: 1 }))

		expect(values.length).toBeGreaterThanOrEqual(1)
		expect(values[values.length - 1]).toEqual({ count: 1, name: 'test' })
	})

	it('asyncDispatch applies async result', async () => {
		const store = new Store(initialState)

		await store.asyncDispatch(async (s) => {
			return { ...s, count: 99 }
		})

		expect(store.getState().count).toBe(99)
	})

	it('middleware is called on dispatch', () => {
		const mw = vi.fn()
		const store = new Store(initialState, { middleware: [mw] })

		const action = (s: TestState) => ({ ...s, count: 10 })
		store.dispatch(action)

		expect(mw).toHaveBeenCalledWith(initialState, { ...initialState, count: 10 }, action)
	})

	it('reset sets state', () => {
		const store = new Store(initialState)
		store.dispatch((s) => ({ ...s, count: 50 }))
		store.reset(initialState)
		expect(store.getState()).toEqual(initialState)
	})

	it('destroy completes the observable', () => {
		const store = new Store(initialState)
		const completeFn = vi.fn()
		store.asObservable().subscribe({ complete: completeFn })
		store.destroy()
		expect(completeFn).toHaveBeenCalled()
	})

	it('setState bypasses middleware', () => {
		const mw = vi.fn()
		const store = new Store(initialState, { middleware: [mw] })
		store.setState({ ...initialState, count: 100 })
		expect(store.getState().count).toBe(100)
		expect(mw).not.toHaveBeenCalled()
	})
})
