import { useEffect, useRef, useState } from 'react'
import type { Observable } from 'rxjs'

/**
 * Subscribes to an RxJS Observable and returns the latest emitted value.
 * Re-subscribes when the observable reference changes.
 */
export function useObservable<T>(observable: Observable<T>): T | undefined
export function useObservable<T>(observable: Observable<T>, initialValue: T): T
export function useObservable<T>(observable: Observable<T>, initialValue?: T): T | undefined {
	const [value, setValue] = useState<T | undefined>(initialValue)
	const observableRef = useRef(observable)

	useEffect(() => {
		observableRef.current = observable
		const subscription = observable.subscribe((next) => {
			setValue(next)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [observable])

	return value
}
