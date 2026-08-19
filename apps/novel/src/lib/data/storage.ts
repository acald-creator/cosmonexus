/**
 * Typed localStorage abstraction.
 * All novel data is stored under a `novel:` prefix.
 */

const PREFIX = 'cosmonexus:'

export function get<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(PREFIX + key)
		return raw ? JSON.parse(raw) : null
	} catch {
		return null
	}
}

export function set<T>(key: string, value: T): void {
	localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function remove(key: string): void {
	localStorage.removeItem(PREFIX + key)
}

export function keys(pattern?: string): string[] {
	const results: string[] = []
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i)
		if (key?.startsWith(PREFIX)) {
			const stripped = key.slice(PREFIX.length)
			if (!pattern || stripped.startsWith(pattern)) {
				results.push(stripped)
			}
		}
	}
	return results
}

/** Generate a short unique ID. */
export function uid(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
