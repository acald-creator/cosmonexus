import type { Observable } from 'rxjs'
import type { NovelMeta, ChapterMeta } from '@cosmonexus/nova-types'
import type { ReadingProgress } from './ports/progress.port'
import { getAdapter } from './registry'

export function novels$(): Observable<NovelMeta[]> {
	return getAdapter().novels.novels$()
}

export function novel$(id: string): Observable<NovelMeta | null> {
	return getAdapter().novels.novel$(id)
}

export function chapters$(novelId: string): Observable<ChapterMeta[]> {
	return getAdapter().chapters.chapters$(novelId)
}

export function progress$(novelId: string): Observable<ReadingProgress | null> {
	return getAdapter().progress.progress$(novelId)
}

