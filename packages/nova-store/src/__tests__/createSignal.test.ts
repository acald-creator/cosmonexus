import { describe, it, expect, vi } from 'vitest'
import { createSignal } from '../createSignal'
import { createEffect } from '../createEffect'

describe('createSignal', () => {
	it('returns a getter and setter', () => {
		const [get, set] = createSignal(0)
		expect(get()).toBe(0)
		set(5)
		expect(get()).toBe(5)
	})

	it('getter returns current value', () => {
		const [get, set] = createSignal('hello')
		expect(get()).toBe('hello')
		set('world')
		expect(get()).toBe('world')
	})

	it('notifies subscribers when value changes', () => {
		const [get, set] = createSignal(0)
		const fn = vi.fn()

		createEffect(() => {
			fn(get())
		})

		expect(fn).toHaveBeenCalledWith(0)
		set(1)
		expect(fn).toHaveBeenCalledWith(1)
		expect(fn).toHaveBeenCalledTimes(2)
	})

	it('skips notification when value is the same (Object.is)', () => {
		const [get, set] = createSignal(1)
		const fn = vi.fn()

		createEffect(() => {
			fn(get())
		})

		expect(fn).toHaveBeenCalledTimes(1)
		set(1) // same value
		expect(fn).toHaveBeenCalledTimes(1)
	})

	it('uses custom equality function', () => {
		const [get, set] = createSignal(
			{ x: 1, y: 2 },
			{ equals: (a, b) => a.x === b.x && a.y === b.y },
		)
		const fn = vi.fn()

		createEffect(() => {
			fn(get())
		})

		expect(fn).toHaveBeenCalledTimes(1)
		set({ x: 1, y: 2 }) // equal by custom check
		expect(fn).toHaveBeenCalledTimes(1)
		set({ x: 1, y: 3 }) // different
		expect(fn).toHaveBeenCalledTimes(2)
	})

	it('handles NaN correctly with Object.is', () => {
		const [get, set] = createSignal(NaN)
		const fn = vi.fn()

		createEffect(() => {
			fn(get())
		})

		expect(fn).toHaveBeenCalledTimes(1)
		set(NaN) // Object.is(NaN, NaN) === true
		expect(fn).toHaveBeenCalledTimes(1)
	})

	it('supports multiple subscribers', () => {
		const [get, set] = createSignal(0)
		const fn1 = vi.fn()
		const fn2 = vi.fn()

		createEffect(() => { fn1(get()) })
		createEffect(() => { fn2(get()) })

		set(1)
		expect(fn1).toHaveBeenCalledWith(1)
		expect(fn2).toHaveBeenCalledWith(1)
	})
})
