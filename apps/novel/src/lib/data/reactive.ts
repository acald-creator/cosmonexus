import { type Observable, from, of } from 'rxjs'
import { map, shareReplay, switchMap, catchError } from 'rxjs/operators'
import type { NovelMeta, ChapterMeta } from '@cosmonexus/nova-types'
import type { ReadingProgress } from './reading-progress'
import { getDatabase, type AppDatabase } from './database'
import type { NovelDocument, ChapterDocument, ProgressDocument } from './schemas'

/**
 * Helper: lazily get a collection observable once DB is ready.
 */
function fromDb<T>(factory: (db: AppDatabase) => Observable<T>): Observable<T> {
	return from(getDatabase()).pipe(
		switchMap(factory),
		shareReplay(1),
		catchError(err => {
			console.error('[data/reactive] Query error:', err)
			return of(null as any)
		}),
	)
}

// ─── Mapping Functions ───

export function toNovelMeta(doc: NovelDocument, chapters: ChapterMeta[] = []): NovelMeta {
	return {
		id: doc.id,
		title: doc.title,
		author: doc.author,
		genre: doc.genre,
		synopsis: doc.synopsis,
		coverUrl: doc.coverUrl,
		targetWordCount: doc.targetWordCount,
		chapters,
		createdAt: doc.createdAt,
		updatedAt: doc.updatedAt,
	}
}

export function toChapterMeta(doc: ChapterDocument): ChapterMeta {
	return {
		id: doc.id,
		title: doc.title,
		order: doc.order,
		status: doc.status as ChapterMeta['status'],
		wordCount: doc.wordCount,
		targetWordCount: doc.targetWordCount,
		createdAt: doc.createdAt,
		updatedAt: doc.updatedAt,
	}
}

export function toProgress(doc: ProgressDocument): ReadingProgress {
	return {
		novelId: doc.novelId,
		chaptersRead: doc.chaptersRead ?? {},
		lastChapterId: doc.lastChapterId ?? null,
		updatedAt: doc.updatedAt,
	}
}

// ─── Reactive Queries ───

/** Observable of all novels with their chapter metadata. */
export function novels$(): Observable<NovelMeta[]> {
	return fromDb(db => {
		// Combine novels + chapters to reconstruct NovelMeta with chapters array
		return new Observable<NovelMeta[]>(subscriber => {
			let novels: NovelDocument[] = []
			let chapters: ChapterDocument[] = []

			const novelsSub = db.novels.find().$.subscribe(docs => {
				novels = docs as unknown as NovelDocument[]
				emit()
			})

			const chaptersSub = db.chapters.find({ sort: [{ order: 'asc' }] }).$.subscribe(docs => {
				chapters = docs as unknown as ChapterDocument[]
				emit()
			})

			function emit() {
				const result = novels.map(n => {
					const novelChapters = chapters
						.filter(ch => ch.novelId === n.id)
						.map(toChapterMeta)
					return toNovelMeta(n, novelChapters)
				})
				subscriber.next(result)
			}

			return () => {
				novelsSub.unsubscribe()
				chaptersSub.unsubscribe()
			}
		})
	})
}

/** Observable of a single novel by id (with chapters). */
export function novel$(id: string): Observable<NovelMeta | null> {
	return fromDb(db => {
		return new Observable<NovelMeta | null>(subscriber => {
			let novelDoc: NovelDocument | null = null
			let chapters: ChapterDocument[] = []

			const novelSub = db.novels.findOne(id).$.subscribe(doc => {
				novelDoc = doc as unknown as NovelDocument
				emit()
			})

			const chaptersSub = db.chapters.find({ selector: { novelId: id }, sort: [{ order: 'asc' }] }).$.subscribe(docs => {
				chapters = docs as unknown as ChapterDocument[]
				emit()
			})

			function emit() {
				if (!novelDoc) {
					subscriber.next(null)
				} else {
					subscriber.next(toNovelMeta(novelDoc, chapters.map(toChapterMeta)))
				}
			}

			return () => {
				novelSub.unsubscribe()
				chaptersSub.unsubscribe()
			}
		})
	})
}

/** Observable of chapters for a novel, ordered by order. */
export function chapters$(novelId: string): Observable<ChapterMeta[]> {
	return fromDb(db =>
		db.chapters.find({ selector: { novelId }, sort: [{ order: 'asc' }] }).$.pipe(
			map(docs => docs.map(d => toChapterMeta(d as unknown as ChapterDocument)))
		)
	)
}

/** Observable of reading progress for a novel. */
export function progress$(novelId: string): Observable<ReadingProgress | null> {
	return fromDb(db =>
		db.progress.findOne({ selector: { novelId } }).$.pipe(
			map(doc => doc ? toProgress(doc as unknown as ProgressDocument) : null)
		)
	)
}
