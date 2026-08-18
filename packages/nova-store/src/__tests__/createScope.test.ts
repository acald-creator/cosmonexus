import { describe, it, expect, vi } from 'vitest'
import { createSignal } from '../createSignal'
import { createEffect } from '../createEffect'
import { createScope } from '../createScope'

describe('createScope', () => {
	it('tracks effects created within run()', () => {
		const [get, set] = createSignal(0)
		const fn = vi.fn()

		const scope = createScope()
		scope.run(() => {
			createEffect(() => { fn(get()) })
		})

		expect(fn).toHaveBeenCalledWith(0)
		set(1)
		expect(fn).toHaveBeenCalledWith(1)
	})

	it('disposes all effects on scope.dispose()', () => {
		const [get, set] = createSignal(0)
		const fn1 = vi.fn()
		const fn2 = vi.fn()

		const scope = createScope()
		scope.run(() => {
			createEffect(() => { fn1(get()) })
			createEffect(() => { fn2(get()) })
		})

		expect(fn1).toHaveBeenCalledTimes(1)
		expect(fn2).toHaveBeenCalledTimes(1)

		scope.dispose()

		set(1)
		expect(fn1).toHaveBeenCalledTimes(1) // not called again
		expect(fn2).toHaveBeenCalledTimes(1)
	})

	it('runs cleanup callbacks on dispose', () => {
		const cleanup1 = vi.fn()
		const cleanup2 = vi.fn()

		const scope = createScope()
		scope.run(() => {
			createEffect(() => { return cleanup1 })
			createEffect(() => { return cleanup2 })
		})

		scope.dispose()
		expect(cleanup1).toHaveBeenCalledTimes(1)
		expect(cleanup2).toHaveBeenCalledTimes(1)
	})

	it('nested scopes are disposed with parent', () => {
		const [get, set] = createSignal(0)
		const fn = vi.fn()

		const parent = createScope()
		parent.run(() => {
			const child = createScope()
			child.run(() => {
				createEffect(() => { fn(get()) })
			})
		})

		set(1)
		expect(fn).toHaveBeenCalledTimes(2)

		parent.dispose()
		set(2)
		expect(fn).toHaveBeenCalledTimes(2) // child effect disposed
	})

	it('sets disposed flag', () => {
		const scope = createScope()
		expect(scope.disposed).toBe(false)
		scope.dispose()
		expect(scope.disposed).toBe(true)
	})

	it('run returns the value', () => {
		const scope = createScope()
		const result = scope.run(() => 42)
		expect(result).toBe(42)
	})
})
