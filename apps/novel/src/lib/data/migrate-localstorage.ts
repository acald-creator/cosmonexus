import type { AppDatabase } from './database'
import * as storage from './storage'
import type { NovelMeta, DocumentJSON } from '@cosmonexus/nova-types'

const MIGRATION_DONE_KEY = 'rxdb-migrated'

/**
 * One-time migration from localStorage to RxDB.
 * Reads existing novel/chapter/progress data, bulk-inserts into RxDB,
 * then clears the old localStorage keys.
 */
export async function migrateFromLocalStorage(db: AppDatabase): Promise<void> {
	if (typeof localStorage === 'undefined') return
	if (localStorage.getItem(MIGRATION_DONE_KEY)) return

	const novels = storage.get<NovelMeta[]>('novels')
	if (!novels || novels.length === 0) {
		localStorage.setItem(MIGRATION_DONE_KEY, 'true')
		return
	}

	try {
		// Insert novels (without nested chapters array)
		await db.novels.bulkInsert(
			novels.map(n => ({
				id: n.id,
				title: n.title,
				author: n.author,
				genre: n.genre,
				synopsis: n.synopsis,
				coverUrl: n.coverUrl,
				targetWordCount: n.targetWordCount,
				createdAt: n.createdAt,
				updatedAt: n.updatedAt,
			}))
		)

		// Flatten chapters from all novels and insert
		const chapterDocs = novels.flatMap(novel =>
			(novel.chapters ?? []).map(ch => {
				const content = storage.get<DocumentJSON>(`chapter:${novel.id}:${ch.id}`)
				return {
					id: ch.id,
					novelId: novel.id,
					title: ch.title,
					order: ch.order,
					status: ch.status,
					wordCount: ch.wordCount,
					targetWordCount: ch.targetWordCount,
					content: content ?? undefined,
					createdAt: ch.createdAt,
					updatedAt: ch.updatedAt,
				}
			})
		)
		if (chapterDocs.length > 0) {
			await db.chapters.bulkInsert(chapterDocs)
		}

		// Migrate reading progress
		const progressKeys = storage.keys('reading-progress:')
		for (const key of progressKeys) {
			const progress = storage.get<any>(key)
			if (progress) {
				await db.progress.insert({
					id: `progress-${progress.novelId}`,
					novelId: progress.novelId,
					chaptersRead: progress.chaptersRead ?? {},
					lastChapterId: progress.lastChapterId,
					updatedAt: progress.updatedAt ?? new Date().toISOString(),
				})
			}
		}

		// Clear old localStorage data
		storage.remove('novels')
		storage.remove('seeded')
		for (const novel of novels) {
			for (const ch of novel.chapters ?? []) {
				storage.remove(`chapter:${novel.id}:${ch.id}`)
			}
		}
		for (const key of progressKeys) {
			storage.remove(key)
		}
	} catch (err) {
		console.error('[data/migration] Migration failed:', err)
	}

	localStorage.setItem(MIGRATION_DONE_KEY, 'true')
}
