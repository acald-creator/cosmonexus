import { describe, it, expect, vi } from 'vitest'
import { createSignal } from '../createSignal'
import { createEffect } from '../createEffect'
import { untrack } from '../untrack'

describe('untrack', () => {
	it('reads signal without subscribing', () => {
		const [a, setA] = createSignal(1)
		const [b, setB] = createSignal(2)
		const fn = vi.fn()

		createEffect(() => {
			const aVal = a() // tracked
			const bVal = untrack(() => b()) // NOT tracked
			fn(aVal, bVal)
		})

		expect(fn).toHaveBeenCalledWith(1, 2)

		setB(99) // should NOT trigger effect
		expect(fn).toHaveBeenCalledTimes(1)

		setA(10) // SHOULD trigger effect (and see latest b)
		expect(fn).toHaveBeenCalledWith(10, 99)
		expect(fn).toHaveBeenCalledTimes(2)
	})

	it('returns the value from the function', () => {
		const [get] = createSignal('hello')
		const result = untrack(() => get())
		expect(result).toBe('hello')
	})

	it('works outside of effects', () => {
		const [get] = createSignal(42)
		expect(untrack(() => get())).toBe(42)
	})
})
