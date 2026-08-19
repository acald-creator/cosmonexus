import { Observable, defer, of } from 'rxjs'
import { map, shareReplay, switchMap, catchError } from 'rxjs/operators'
import type { NovelMeta, ChapterMeta } from '@cosmonexus/nova-types'
import type { ReadingProgress } from './reading-progress'
import { getDatabase, type AppDatabase } from './database'
import type { NovelDocument, ChapterDocument, ProgressDocument } from './schemas'

// ─── Mapping Functions ───

export function toNovelMeta(doc: any, chapters: ChapterMeta[] = []): NovelMeta {
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

export function toChapterMeta(doc: any): ChapterMeta {
	return {
		id: doc.id,
		title: doc.title,
		order: doc.order,
		status: doc.status,
		wordCount: doc.wordCount,
		targetWordCount: doc.targetWordCount,
		createdAt: doc.createdAt,
		updatedAt: doc.updatedAt,
	}
}

export function toProgress(doc: any): ReadingProgress {
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
	return new Observable<NovelMeta[]>(subscriber => {
		let novels: any[] = []
		let chapters: any[] = []
		let novelsSub: any = null
		let chaptersSub: any = null

		getDatabase().then(db => {
			novelsSub = db.novels.find().$.subscribe((docs: any) => {
				novels = docs
				emit()
			})

			chaptersSub = db.chapters.find({ sort: [{ order: 'asc' }] }).$.subscribe((docs: any) => {
				chapters = docs
				emit()
			})
		}).catch(err => {
			console.error('[data/reactive] novels$ error:', err)
			subscriber.next([])
		})

		function emit() {
			const result = novels.map((n: any) => {
				const novelChapters = chapters
					.filter((ch: any) => ch.novelId === n.id)
					.map(toChapterMeta)
				return toNovelMeta(n, novelChapters)
			})
			subscriber.next(result)
		}

		return () => {
			novelsSub?.unsubscribe()
			chaptersSub?.unsubscribe()
		}
	}).pipe(shareReplay(1))
}

/** Observable of a single novel by id (with chapters). */
export function novel$(id: string): Observable<NovelMeta | null> {
	return new Observable<NovelMeta | null>(subscriber => {
		let novelDoc: any = null
		let chapters: any[] = []
		let novelSub: any = null
		let chaptersSub: any = null

		getDatabase().then(db => {
			novelSub = db.novels.findOne(id).$.subscribe((doc: any) => {
				novelDoc = doc
				emit()
			})

			chaptersSub = db.chapters.find({ selector: { novelId: id }, sort: [{ order: 'asc' }] }).$.subscribe((docs: any) => {
				chapters = docs
				emit()
			})
		}).catch(err => {
			console.error('[data/reactive] novel$ error:', err)
			subscriber.next(null)
		})

		function emit() {
			if (!novelDoc) {
				subscriber.next(null)
			} else {
				subscriber.next(toNovelMeta(novelDoc, chapters.map(toChapterMeta)))
			}
		}

		return () => {
			novelSub?.unsubscribe()
			chaptersSub?.unsubscribe()
		}
	}).pipe(shareReplay(1))
}

/** Observable of chapters for a novel, ordered by order. */
export function chapters$(novelId: string): Observable<ChapterMeta[]> {
	return new Observable<ChapterMeta[]>(subscriber => {
		let sub: any = null

		getDatabase().then(db => {
			sub = db.chapters.find({ selector: { novelId }, sort: [{ order: 'asc' }] }).$.subscribe((docs: any) => {
				subscriber.next(docs.map(toChapterMeta))
			})
		}).catch(err => {
			console.error('[data/reactive] chapters$ error:', err)
			subscriber.next([])
		})

		return () => { sub?.unsubscribe() }
	}).pipe(shareReplay(1))
}

/** Observable of reading progress for a novel. */
export function progress$(novelId: string): Observable<ReadingProgress | null> {
	return new Observable<ReadingProgress | null>(subscriber => {
		let sub: any = null

		getDatabase().then(db => {
			sub = db.progress.findOne({ selector: { novelId } }).$.subscribe((doc: any) => {
				subscriber.next(doc ? toProgress(doc) : null)
			})
		}).catch(err => {
			console.error('[data/reactive] progress$ error:', err)
			subscriber.next(null)
		})

		return () => { sub?.unsubscribe() }
	}).pipe(shareReplay(1))
}
