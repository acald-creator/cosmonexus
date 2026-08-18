import { describe, it, expect, vi } from 'vitest'
import { createSignal } from '../createSignal'
import { createEffect } from '../createEffect'
import { createMemo } from '../createMemo'

describe('createMemo', () => {
	it('computes initial value', () => {
		const [get] = createSignal(5)
		const double = createMemo(() => get() * 2)
		expect(double()).toBe(10)
	})

	it('recomputes when dependencies change', () => {
		const [get, set] = createSignal(3)
		const double = createMemo(() => get() * 2)

		expect(double()).toBe(6)
		set(7)
		expect(double()).toBe(14)
	})

	it('can be used as a dependency in effects', () => {
		const [get, set] = createSignal(2)
		const squared = createMemo(() => get() * get())
		const fn = vi.fn()

		createEffect(() => {
			fn(squared())
		})

		expect(fn).toHaveBeenCalledWith(4)
		set(3)
		expect(fn).toHaveBeenCalledWith(9)
	})

	it('chains memos', () => {
		const [get, set] = createSignal(2)
		const double = createMemo(() => get() * 2)
		const quadruple = createMemo(() => double() * 2)

		expect(quadruple()).toBe(8)
		set(5)
		expect(quadruple()).toBe(20)
	})
})
