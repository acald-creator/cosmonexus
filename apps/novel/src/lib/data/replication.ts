import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

export type ReplicationCheckpoint = {
	updatedAt: string
	id: string
}

export type PushRow<T> = {
	newDocumentState: T
	assumedMasterState?: T
}

export type PullResponse<T> = {
	documents: T[]
	checkpoint: ReplicationCheckpoint
}

export type ConflictResult<T> = T

export type ReplicationState = {
	status: 'idle' | 'active' | 'error' | 'stopped'
	error?: Error
}

export interface ReplicationContract<T = unknown> {
	push: (rows: PushRow<T>[]) => Promise<ConflictResult<T>[]>
	pull: (checkpoint: ReplicationCheckpoint | null, batchSize: number) => Promise<PullResponse<T>>
	conflictHandler: (input: { realMasterState: T; newDocumentState: T }) => Promise<T>
}

/**
 * Stub — sets up replication for future use.
 * Currently logs a warning and returns idle state.
 */
export function setupReplication<T>(_options: ReplicationContract<T>): Observable<ReplicationState> {
	console.warn('[data/replication] Replication is not yet configured. This is a stub.')
	const state$ = new BehaviorSubject<ReplicationState>({ status: 'idle' })
	return state$.asObservable()
}
