import { describe, it, expect, vi } from 'vitest'
import { createSignal } from '../createSignal'
import { createEffect, onCleanup } from '../createEffect'

describe('createEffect', () => {
	it('runs immediately on creation', () => {
		const fn = vi.fn()
		createEffect(fn)
		expect(fn).toHaveBeenCalledTimes(1)
	})

	it('re-runs when dependencies change', () => {
		const [get, set] = createSignal(0)
		const fn = vi.fn()

		createEffect(() => {
			fn(get())
		})

		set(1)
		set(2)
		expect(fn).toHaveBeenCalledTimes(3)
		expect(fn).toHaveBeenLastCalledWith(2)
	})

	it('returns a dispose function', () => {
		const [get, set] = createSignal(0)
		const fn = vi.fn()

		const dispose = createEffect(() => {
			fn(get())
		})

		expect(fn).toHaveBeenCalledTimes(1)
		dispose()
		set(1)
		expect(fn).toHaveBeenCalledTimes(1) // no longer tracking
	})

	it('runs cleanup on re-execution', () => {
		const [get, set] = createSignal(0)
		const cleanupFn = vi.fn()

		createEffect(() => {
			get()
			onCleanup(cleanupFn)
		})

		expect(cleanupFn).not.toHaveBeenCalled()
		set(1) // re-runs effect, triggering cleanup from previous run
		expect(cleanupFn).toHaveBeenCalledTimes(1)
	})

	it('runs cleanup on dispose', () => {
		const cleanupFn = vi.fn()

		const dispose = createEffect(() => {
			onCleanup(cleanupFn)
		})

		expect(cleanupFn).not.toHaveBeenCalled()
		dispose()
		expect(cleanupFn).toHaveBeenCalledTimes(1)
	})

	it('supports return-a-function cleanup pattern', () => {
		const [get, set] = createSignal(0)
		const cleanupFn = vi.fn()

		createEffect(() => {
			get()
			return cleanupFn
		})

		set(1)
		expect(cleanupFn).toHaveBeenCalledTimes(1)
	})

	it('stops tracking after dispose', () => {
		const [get, set] = createSignal(0)
		const fn = vi.fn()

		const dispose = createEffect(() => {
			fn(get())
		})

		dispose()
		set(1)
		set(2)
		expect(fn).toHaveBeenCalledTimes(1) // only the initial run
	})

	it('tracks only the latest dependencies', () => {
		const [a, setA] = createSignal(true)
		const [b, setB] = createSignal('B')
		const [c, setC] = createSignal('C')
		const fn = vi.fn()

		createEffect(() => {
			fn(a() ? b() : c())
		})

		expect(fn).toHaveBeenCalledWith('B')

		setC('C2') // c is not tracked (a is true, so b branch was taken)
		expect(fn).toHaveBeenCalledTimes(1)

		setA(false) // now c branch is taken
		expect(fn).toHaveBeenCalledWith('C2')

		setB('B2') // b is no longer tracked
		expect(fn).toHaveBeenCalledTimes(2)
	})
})
