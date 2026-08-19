import type { DataPorts } from '../../ports'
import type { NovelsPort } from '../../ports/novels.port'
import type { ChaptersPort } from '../../ports/chapters.port'
import type { ProgressPort } from '../../ports/progress.port'
import type { RestConfig } from './types'

/**
 * REST adapter factory.
 * NOT IMPLEMENTED — placeholder for future server-backed reader experience.
 * Novels and Chapters are read-only; Progress supports read-write.
 */
export function createRestAdapter(_config: RestConfig): DataPorts {
	throw new Error('[data/adapters/rest] REST adapter is not yet implemented. Define server API endpoints first.')
}

export type { RestConfig, RestEndpoints } from './types'
