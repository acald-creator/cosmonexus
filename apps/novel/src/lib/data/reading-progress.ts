import type { NovelMeta, ChapterMeta } from '@cosmonexus/nova-types'
import { getAdapter } from './registry'

export type ReadingProgress = {
	novelId: string
	chaptersRead: Record<string, string>
	lastChapterId: string | null
	updatedAt: string
}

export function getProgress(novelId: string): ReadingProgress | null {
	return null // Sync read not available — use progress$() reactive query
}

export async function getProgressAsync(novelId: string): Promise<ReadingProgress | null> {
	return getAdapter().progress.getProgress(novelId)
}

export async function markChapterRead(novelId: string, chapterId: string): Promise<void> {
	return getAdapter().progress.markChapterRead(novelId, chapterId)
}

export function getNextUnread(novel: NovelMeta, progress: ReadingProgress | null): ChapterMeta | null {
	const published = novel.chapters
		.filter(ch => ch.status === 'final' || ch.status === 'editing')
		.sort((a, b) => a.order - b.order)
	if (!progress) return published[0] ?? null
	return published.find(ch => !progress.chaptersRead[ch.id]) ?? null
}

export function getSmartCTAState(novel: NovelMeta, progress: ReadingProgress | null): { label: string; targetChapterOrder: number } {
	const published = novel.chapters
		.filter(ch => ch.status === 'final' || ch.status === 'editing')
		.sort((a, b) => a.order - b.order)
	if (!published.length) return { label: 'Start Reading', targetChapterOrder: 1 }
	if (!progress || Object.keys(progress.chaptersRead).length === 0) return { label: 'Start Reading', targetChapterOrder: published[0].order }
	const allRead = published.every(ch => progress.chaptersRead[ch.id])
	if (allRead) return { label: 'Read Again', targetChapterOrder: published[0].order }
	const nextUnread = published.find(ch => !progress.chaptersRead[ch.id])
	return { label: 'Continue Reading', targetChapterOrder: nextUnread?.order ?? published[0].order }
}
