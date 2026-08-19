import { getDatabase } from './database'
import type { NovelMeta, ChapterMeta } from '@cosmonexus/nova-types'
import { toNovelMeta, toChapterMeta } from './reactive'
import type { NovelDocument, ChapterDocument } from './schemas'

let initialized = false

// Internal caches (primed by subscriptions)
let _novelsCache: NovelMeta[] = []
let _chaptersCache: ChapterMeta[] = []

export function getNovelsCache(): NovelMeta[] { return _novelsCache }
export function getChaptersCache(): ChapterMeta[] { return _chaptersCache }

/**
 * Initialize the data layer: ensures DB is ready, runs migration/seed,
 * and starts cache-priming subscriptions.
 * Call once from root layout's onMount.
 */
export async function initDataLayer(): Promise<void> {
	if (initialized) return
	initialized = true

	const db = await getDatabase()

	// Seed if empty
	const count = await db.novels.count().exec()
	if (count === 0) {
		const { seedDatabase } = await import('./seed')
		await seedDatabase(db)
	}

	// Prime caches via subscriptions
	let novels: NovelDocument[] = []
	let chapters: ChapterDocument[] = []

	db.novels.find().$.subscribe(docs => {
		novels = docs as unknown as NovelDocument[]
		rebuildCache()
	})

	db.chapters.find({ sort: [{ order: 'asc' }] }).$.subscribe(docs => {
		chapters = docs as unknown as ChapterDocument[]
		rebuildCache()
	})

	function rebuildCache() {
		_chaptersCache = chapters.map(toChapterMeta)
		_novelsCache = novels.map(n => {
			const novelChapters = chapters
				.filter(ch => ch.novelId === n.id)
				.map(toChapterMeta)
			return toNovelMeta(n, novelChapters)
		})
	}
}
