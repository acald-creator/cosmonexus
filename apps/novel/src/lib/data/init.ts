import { registerAdapter, setActiveAdapter, isInitialized } from './registry'

let initialized = false

export async function initDataLayer(adapterName: string = 'rxdb'): Promise<void> {
	if (initialized) return
	initialized = true

	// Register built-in adapters lazily
	if (adapterName === 'rxdb') {
		const { createRxDBAdapter } = await import('./adapters/rxdb/index')
		registerAdapter('rxdb', createRxDBAdapter)
	}

	await setActiveAdapter(adapterName)
}

// Legacy compat
export function getNovelsCache() { return [] }
export function getChaptersCache() { return [] }
