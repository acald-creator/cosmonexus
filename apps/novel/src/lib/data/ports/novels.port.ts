import type { Observable } from 'rxjs'
import type { NovelMeta } from '@cosmonexus/nova-types'

export type CreateNovelData = {
	title: string
	author: string
	genre?: string
	synopsis?: string
	coverUrl?: string
	targetWordCount?: number
}

export type UpdateNovelData = Partial<Omit<NovelMeta, 'id' | 'createdAt' | 'chapters'>>

export interface NovelsPort {
	init(): Promise<void>
	listNovels(): NovelMeta[]
	getNovel(id: string): NovelMeta | null
	createNovel(data: CreateNovelData): Promise<NovelMeta>
	updateNovel(id: string, updates: UpdateNovelData): Promise<NovelMeta | null>
	deleteNovel(id: string): Promise<void>
	novels$(): Observable<NovelMeta[]>
	novel$(id: string): Observable<NovelMeta | null>
}
