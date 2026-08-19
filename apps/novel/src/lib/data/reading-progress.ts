import type { NovelMeta, ChapterMeta } from '@cosmonexus/nova-types'
import * as storage from './storage'

export type ReadingProgress = {
	novelId: string
	chaptersRead: Record<string, string>
	lastChapterId: string | null
	updatedAt: string
}

function key(novelId: string): string {
	return `reading-progress:${novelId}`
}

/** Get reading progress for a novel. Returns null if none exists. */
export function getProgress(novelId: string): ReadingProgress | null {
	return storage.get<ReadingProgress>(key(novelId))
}

/** Mark a chapter as read. Idempotent — won't overwrite existing timestamp. */
export function markChapterRead(novelId: string, chapterId: string): void {
	let progress = getProgress(novelId)
	if (!progress) {
		progress = {
			novelId,
			chaptersRead: {},
			lastChapterId: null,
			updatedAt: new Date().toISOString(),
		}
	}

	if (!progress.chaptersRead[chapterId]) {
		progress.chaptersRead[chapterId] = new Date().toISOString()
	}
	progress.lastChapterId = chapterId
	progress.updatedAt = new Date().toISOString()
	storage.set(key(novelId), progress)
}

/** Find the next unread published chapter. */
export function getNextUnread(novel: NovelMeta, progress: ReadingProgress | null): ChapterMeta | null {
	const published = novel.chapters
		.filter(ch => ch.status === 'final' || ch.status === 'editing')
		.sort((a, b) => a.order - b.order)

	if (!progress) return published[0] ?? null
	return published.find(ch => !progress.chaptersRead[ch.id]) ?? null
}

/** Determine Smart CTA state. */
export function getSmartCTAState(
	novel: NovelMeta,
	progress: ReadingProgress | null,
): { label: string; targetChapterOrder: number } {
	const published = novel.chapters
		.filter(ch => ch.status === 'final' || ch.status === 'editing')
		.sort((a, b) => a.order - b.order)

	if (!published.length) return { label: 'Start Reading', targetChapterOrder: 1 }

	if (!progress || Object.keys(progress.chaptersRead).length === 0) {
		return { label: 'Start Reading', targetChapterOrder: published[0].order }
	}

	const allRead = published.every(ch => progress.chaptersRead[ch.id])
	if (allRead) {
		return { label: 'Read Again', targetChapterOrder: published[0].order }
	}

	const nextUnread = published.find(ch => !progress.chaptersRead[ch.id])
	return {
		label: 'Continue Reading',
		targetChapterOrder: nextUnread?.order ?? published[0].order,
	}
}
