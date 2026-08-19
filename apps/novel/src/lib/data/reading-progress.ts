import type { NovelMeta, ChapterMeta } from '@cosmonexus/nova-types'
import { getDatabase } from './database'
import { uid } from './storage'

export type ReadingProgress = {
	novelId: string
	chaptersRead: Record<string, string>
	lastChapterId: string | null
	updatedAt: string
}

/** Get reading progress for a novel. */
export function getProgress(novelId: string): ReadingProgress | null {
	// Sync read not available without cache — return null initially.
	// Components should use progress$ reactive query for live data.
	return null
}

/** Get reading progress (async version). */
export async function getProgressAsync(novelId: string): Promise<ReadingProgress | null> {
	const db = await getDatabase()
	const doc = await db.progress.findOne({ selector: { novelId } }).exec()
	if (!doc) return null
	return {
		novelId: doc.novelId,
		chaptersRead: doc.chaptersRead ?? {},
		lastChapterId: doc.lastChapterId ?? null,
		updatedAt: doc.updatedAt,
	}
}

/** Mark a chapter as read. Idempotent. */
export async function markChapterRead(novelId: string, chapterId: string): Promise<void> {
	const db = await getDatabase()
	const existing = await db.progress.findOne({ selector: { novelId } }).exec()
	const now = new Date().toISOString()

	if (!existing) {
		await db.progress.insert({
			id: uid(),
			novelId,
			chaptersRead: { [chapterId]: now },
			lastChapterId: chapterId,
			updatedAt: now,
		})
	} else {
		const chaptersRead = { ...existing.chaptersRead }
		if (!chaptersRead[chapterId]) {
			chaptersRead[chapterId] = now
		}
		await existing.incrementalPatch({
			chaptersRead,
			lastChapterId: chapterId,
			updatedAt: now,
		})
	}
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
