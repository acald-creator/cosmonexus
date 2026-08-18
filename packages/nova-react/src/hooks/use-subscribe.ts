import { useEffect, useRef } from 'react'
import type { Observable, Subscription } from 'rxjs'

/**
 * Subscribes to an Observable for side effects only (doesn't return a value).
 * Useful for triggering actions in response to stream emissions.
 */
export function useSubscribe<T>(observable: Observable<T>, callback: (value: T) => void): void {
	const callbackRef = useRef(callback)
	callbackRef.current = callback

	useEffect(() => {
		const subscription: Subscription = observable.subscribe((value) => {
			callbackRef.current(value)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [observable])
}
