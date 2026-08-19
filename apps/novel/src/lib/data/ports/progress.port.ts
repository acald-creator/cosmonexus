import type { Observable } from 'rxjs'

export type ReadingProgress = {
	novelId: string
	chaptersRead: Record<string, string>
	lastChapterId: string | null
	updatedAt: string
}

export interface ProgressPort {
	getProgress(novelId: string): Promise<ReadingProgress | null>
	markChapterRead(novelId: string, chapterId: string): Promise<void>
	progress$(novelId: string): Observable<ReadingProgress | null>
}
