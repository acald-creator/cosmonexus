/**
 * Type-safe event emitter.
 * T maps event names to their handler signatures.
 */
export class EventEmitter<T extends Record<string, (...args: never[]) => void>> {
	private listeners: { [K in keyof T]?: T[K][] } = {}

	on<K extends keyof T>(event: K, listener: T[K]): void {
		if (!this.listeners[event]) {
			this.listeners[event] = []
		}
		this.listeners[event]!.push(listener)
	}

	off<K extends keyof T>(event: K, listener: T[K]): void {
		const listeners = this.listeners[event]
		if (listeners) {
			this.listeners[event] = listeners.filter((l) => l !== listener)
		}
	}

	emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
		const listeners = this.listeners[event]
		if (listeners) {
			for (const listener of listeners) {
				listener(...args)
			}
		}
	}
}
