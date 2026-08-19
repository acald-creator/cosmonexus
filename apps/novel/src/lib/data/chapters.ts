import type { ChapterMeta, DocumentJSON } from '@cosmonexus/nova-types'
import { getAdapter } from './registry'
import type { CreateChapterData, UpdateChapterData } from './ports'

export function listChapters(novelId: string): ChapterMeta[] {
	return getAdapter().chapters.listChapters(novelId)
}

export function getChapterMeta(novelId: string, chapterId: string): ChapterMeta | null {
	return getAdapter().chapters.getChapterMeta(novelId, chapterId)
}

export async function getChapterContent(novelId: string, chapterId: string): Promise<DocumentJSON | null> {
	return getAdapter().chapters.getChapterContent(novelId, chapterId)
}

export async function createChapter(novelId: string, data: CreateChapterData): Promise<ChapterMeta | null> {
	return getAdapter().chapters.createChapter(novelId, data)
}

export async function saveChapterContent(novelId: string, chapterId: string, content: DocumentJSON, wordCount: number): Promise<void> {
	return getAdapter().chapters.saveChapterContent(novelId, chapterId, content, wordCount)
}

export function updateChapter(novelId: string, chapterId: string, updates: UpdateChapterData): ChapterMeta | null {
	return getAdapter().chapters.updateChapter(novelId, chapterId, updates)
}

export async function deleteChapter(novelId: string, chapterId: string): Promise<void> {
	return getAdapter().chapters.deleteChapter(novelId, chapterId)
}

export async function reorderChapters(novelId: string, orderedIds: string[]): Promise<void> {
	return getAdapter().chapters.reorderChapters(novelId, orderedIds)
}
