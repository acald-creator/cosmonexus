import type { ChapterStatus } from '@cosmonexus/nova-types'
import { updateChapter, getChapterMeta } from './chapters'
import { getNovel } from './novels'

/**
 * Valid status transitions for the publishing workflow.
 * draft → revision → editing → final (published)
 * Any status can go back to draft.
 */
const TRANSITIONS: Record<ChapterStatus, ChapterStatus[]> = {
	draft: ['revision'],
	revision: ['draft', 'editing'],
	editing: ['draft', 'revision', 'final'],
	final: ['draft', 'editing'],
}

/** Check if a status transition is valid. */
export function canTransition(from: ChapterStatus, to: ChapterStatus): boolean {
	return TRANSITIONS[from]?.includes(to) ?? false
}

/** Get available next statuses from current status. */
export function getNextStatuses(current: ChapterStatus): ChapterStatus[] {
	return TRANSITIONS[current] ?? []
}

/** Transition a chapter's status. Returns the new status or null if invalid. */
export function transitionChapter(
	novelId: string,
	chapterId: string,
	newStatus: ChapterStatus,
): ChapterStatus | null {
	const chapter = getChapterMeta(novelId, chapterId)
	if (!chapter) return null

	if (!canTransition(chapter.status, newStatus)) {
		return null
	}

	const updated = updateChapter(novelId, chapterId, { status: newStatus })
	return updated?.status ?? null
}

/** Publish a chapter (shortcut for transitioning to 'final'). */
export function publishChapter(novelId: string, chapterId: string): boolean {
	const chapter = getChapterMeta(novelId, chapterId)
	if (!chapter) return false

	// Allow publishing from editing or final (re-publish)
	if (chapter.status === 'editing' || chapter.status === 'final') {
		updateChapter(novelId, chapterId, { status: 'final' })
		return true
	}

	return false
}

/** Get all published (final) chapters for a novel, ordered. */
export function getPublishedChapters(novelId: string) {
	const novel = getNovel(novelId)
	if (!novel) return []
	return novel.chapters
		.filter((ch) => ch.status === 'final')
		.sort((a, b) => a.order - b.order)
}

/** Check if a novel has any published chapters. */
export function isNovelPublished(novelId: string): boolean {
	return getPublishedChapters(novelId).length > 0
}

/** Status display metadata. */
export const STATUS_META: Record<ChapterStatus, { label: string; color: string; icon: string }> = {
	draft: { label: 'Draft', color: 'var(--warning)', icon: '📝' },
	revision: { label: 'Revision', color: 'var(--secondary)', icon: '🔄' },
	editing: { label: 'Editing', color: 'var(--primary)', icon: '✏️' },
	final: { label: 'Published', color: 'var(--success)', icon: '✅' },
}
