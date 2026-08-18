import { Observable } from 'rxjs'

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
	return value !== null && typeof value === 'object' && value.constructor === Object
}

/**
 * Recursively transforms a plain object into an Observable that emits
 * the compacted (non-undefined) version of the object.
 */
export function compact<T extends Record<string, unknown> | undefined>(obj: T): Observable<T> {
	return new Observable((observer) => {
		if (!isPlainObject(obj) || obj === undefined) {
			observer.next(obj)
			observer.complete()
			return
		}

		const keys = Reflect.ownKeys(obj).filter((key) => typeof key === 'string') as string[]
		const filtered: Partial<T> = {}

		let count = 0

		if (keys.length === 0) {
			observer.next(filtered as T)
			observer.complete()
			return
		}

		for (const key of keys) {
			const value = obj[key]
			compact(value as Record<string, unknown> | undefined).subscribe((result) => {
				;(filtered as Record<string, unknown>)[key] = result
				count++

				if (count === keys.length) {
					observer.next(filtered as T)
					observer.complete()
				}
			})
		}
	})
}
