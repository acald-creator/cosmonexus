import type { Observable } from 'rxjs'
import type { ChapterMeta, DocumentJSON } from '@cosmonexus/nova-types'

export type CreateChapterData = {
	title: string
	targetWordCount?: number
}

export type UpdateChapterData = Partial<Pick<ChapterMeta, 'title' | 'status' | 'targetWordCount'>>

export interface ChaptersPort {
	listChapters(novelId: string): ChapterMeta[]
	getChapterMeta(novelId: string, chapterId: string): ChapterMeta | null
	getChapterContent(novelId: string, chapterId: string): Promise<DocumentJSON | null>
	createChapter(novelId: string, data: CreateChapterData): Promise<ChapterMeta | null>
	saveChapterContent(novelId: string, chapterId: string, content: DocumentJSON, wordCount: number): Promise<void>
	updateChapter(novelId: string, chapterId: string, updates: UpdateChapterData): ChapterMeta | null
	deleteChapter(novelId: string, chapterId: string): Promise<void>
	reorderChapters(novelId: string, orderedIds: string[]): Promise<void>
	chapters$(novelId: string): Observable<ChapterMeta[]>
}
