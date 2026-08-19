import type { DataPorts } from './ports'

export type AdapterFactory = () => DataPorts

const factories = new Map<string, AdapterFactory>()
let activeAdapter: DataPorts | null = null
let activeName: string | null = null
let initPromise: Promise<void> | null = null

export function registerAdapter(name: string, factory: AdapterFactory): void {
	factories.set(name, factory)
}

export async function setActiveAdapter(name: string): Promise<void> {
	const factory = factories.get(name)
	if (!factory) {
		throw new Error(`[data/registry] No adapter registered with name "${name}". Available: ${[...factories.keys()].join(', ')}`)
	}
	if (activeName === name && activeAdapter) return

	activeAdapter = factory()
	activeName = name
	initPromise = activeAdapter.novels.init()
	await initPromise
}

export function getAdapter(): DataPorts {
	if (!activeAdapter) {
		throw new Error('[data/registry] No adapter is active. Call initDataLayer() first.')
	}
	return activeAdapter
}

export function getInitPromise(): Promise<void> | null {
	return initPromise
}

export function isInitialized(): boolean {
	return activeAdapter !== null
}
