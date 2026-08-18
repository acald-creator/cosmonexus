import { describe, it, expect, vi } from 'vitest'
import { createSignal } from '../createSignal'
import { createEffect } from '../createEffect'
import { batch } from '../batch'

describe('batch', () => {
	it('defers notifications until batch completes', () => {
		const [a, setA] = createSignal(0)
		const [b, setB] = createSignal(0)
		const fn = vi.fn()

		createEffect(() => {
			fn(a() + b())
		})

		expect(fn).toHaveBeenCalledTimes(1)
		expect(fn).toHaveBeenCalledWith(0)

		batch(() => {
			setA(1)
			setB(2)
		})

		// Effect should only run once after the batch, not twice
		expect(fn).toHaveBeenCalledTimes(2)
		expect(fn).toHaveBeenLastCalledWith(3)
	})

	it('returns the value from the batch function', () => {
		const result = batch(() => 42)
		expect(result).toBe(42)
	})

	it('still works without effects', () => {
		const [get, set] = createSignal(0)
		batch(() => {
			set(1)
			set(2)
			set(3)
		})
		expect(get()).toBe(3)
	})

	it('batches nested signal writes', () => {
		const [a, setA] = createSignal(0)
		const [b, setB] = createSignal(0)
		const [c, setC] = createSignal(0)
		const fn = vi.fn()

		createEffect(() => {
			fn(a() + b() + c())
		})

		batch(() => {
			setA(1)
			setB(2)
			setC(3)
		})

		expect(fn).toHaveBeenCalledTimes(2) // initial + one batch
		expect(fn).toHaveBeenLastCalledWith(6)
	})
})
