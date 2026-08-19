import type { DataPorts } from '../../ports'
import type { NovelsPort } from '../../ports/novels.port'
import type { ChaptersPort } from '../../ports/chapters.port'
import type { ProgressPort } from '../../ports/progress.port'
import type { ReadingProgress } from '../../ports/progress.port'
import type { NovelMeta, ChapterMeta, DocumentJSON } from '@cosmonexus/nova-types'
import { Observable, BehaviorSubject } from 'rxjs'
import { shareReplay } from 'rxjs/operators'
import { getDatabase, type AppDatabase } from './database'
import { uid } from '../../storage'

function toNovelMeta(doc: any, chapters: ChapterMeta[] = []): NovelMeta {
	return {
		id: doc.id, title: doc.title, author: doc.author, genre: doc.genre,
		synopsis: doc.synopsis, coverUrl: doc.coverUrl, targetWordCount: doc.targetWordCount,
		chapters, createdAt: doc.createdAt, updatedAt: doc.updatedAt,
	}
}

function toChapterMeta(doc: any): ChapterMeta {
	return {
		id: doc.id, title: doc.title, order: doc.order, status: doc.status,
		wordCount: doc.wordCount, targetWordCount: doc.targetWordCount,
		createdAt: doc.createdAt, updatedAt: doc.updatedAt,
	}
}

class RxDBAdapter implements NovelsPort, ChaptersPort, ProgressPort {
	private db: AppDatabase | null = null
	private novelsCache: NovelMeta[] = []
	private chaptersCache: ChapterMeta[] = []

	async init(): Promise<void> {
		this.db = await getDatabase()

		// Seed if empty
		const count = await this.db.novels.count().exec()
		if (count === 0) {
			const { seedWithPorts } = await import('../../seed-ports')
			await seedWithPorts({ novels: this, chapters: this, progress: this })
		}

		// Prime caches
		let novelDocs: any[] = []
		let chapterDocs: any[] = []

		this.db.novels.find().$.subscribe(docs => {
			novelDocs = docs
			this.rebuildCache(novelDocs, chapterDocs)
		})
		this.db.chapters.find({ sort: [{ order: 'asc' }] }).$.subscribe(docs => {
			chapterDocs = docs
			this.rebuildCache(novelDocs, chapterDocs)
		})
	}

	private rebuildCache(novelDocs: any[], chapterDocs: any[]) {
		this.chaptersCache = chapterDocs.map(toChapterMeta)
		this.novelsCache = novelDocs.map(n => {
			const chs = chapterDocs.filter((ch: any) => ch.novelId === n.id).map(toChapterMeta)
			return toNovelMeta(n, chs)
		})
	}

	// ─── NovelsPort ───
	listNovels(): NovelMeta[] { return this.novelsCache }
	getNovel(id: string): NovelMeta | null { return this.novelsCache.find(n => n.id === id) ?? null }

	async createNovel(data: any): Promise<NovelMeta> {
		const now = new Date().toISOString()
		const id = uid()
		await this.db!.novels.insert({ id, ...data, createdAt: now, updatedAt: now })
		return { id, ...data, chapters: [], createdAt: now, updatedAt: now }
	}

	async updateNovel(id: string, updates: any): Promise<NovelMeta | null> {
		const doc = await this.db!.novels.findOne(id).exec()
		if (!doc) return null
		await doc.incrementalPatch({ ...updates, updatedAt: new Date().toISOString() })
		return this.getNovel(id)
	}

	async deleteNovel(id: string): Promise<void> {
		const chapters = await this.db!.chapters.find({ selector: { novelId: id } }).exec()
		await Promise.all(chapters.map(ch => ch.remove()))
		const doc = await this.db!.novels.findOne(id).exec()
		if (doc) await doc.remove()
	}

	novels$(): Observable<NovelMeta[]> {
		return new Observable<NovelMeta[]>(sub => {
			let novels: any[] = [], chapters: any[] = []
			const s1 = this.db!.novels.find().$.subscribe(d => { novels = d; emit() })
			const s2 = this.db!.chapters.find({ sort: [{ order: 'asc' }] }).$.subscribe(d => { chapters = d; emit() })
			function emit() {
				sub.next(novels.map(n => toNovelMeta(n, chapters.filter((c: any) => c.novelId === n.id).map(toChapterMeta))))
			}
			return () => { s1.unsubscribe(); s2.unsubscribe() }
		}).pipe(shareReplay(1))
	}

	novel$(id: string): Observable<NovelMeta | null> {
		return new Observable<NovelMeta | null>(sub => {
			let novelDoc: any = null, chapters: any[] = []
			const s1 = this.db!.novels.findOne(id).$.subscribe(d => { novelDoc = d; emit() })
			const s2 = this.db!.chapters.find({ selector: { novelId: id }, sort: [{ order: 'asc' }] }).$.subscribe(d => { chapters = d; emit() })
			function emit() { sub.next(novelDoc ? toNovelMeta(novelDoc, chapters.map(toChapterMeta)) : null) }
			return () => { s1.unsubscribe(); s2.unsubscribe() }
		}).pipe(shareReplay(1))
	}

	// ─── ChaptersPort ───
	listChapters(novelId: string): ChapterMeta[] {
		return this.novelsCache.find(n => n.id === novelId)?.chapters ?? []
	}
	getChapterMeta(novelId: string, chapterId: string): ChapterMeta | null {
		return this.listChapters(novelId).find(ch => ch.id === chapterId) ?? null
	}

	async getChapterContent(novelId: string, chapterId: string): Promise<DocumentJSON | null> {
		const doc = await this.db!.chapters.findOne(chapterId).exec()
		if (!doc || doc.novelId !== novelId) return null
		return (doc.content as DocumentJSON) ?? null
	}

	async createChapter(novelId: string, data: any): Promise<ChapterMeta | null> {
		const existing = await this.db!.chapters.find({ selector: { novelId } }).exec()
		const order = existing.length + 1
		const now = new Date().toISOString()
		const id = uid()
		await this.db!.chapters.insert({ id, novelId, title: data.title, order, status: 'draft', wordCount: 0, targetWordCount: data.targetWordCount, content: { type: 'doc', content: [{ type: 'paragraph' }] }, createdAt: now, updatedAt: now })
		await this.db!.novels.findOne(novelId).exec().then(n => n?.incrementalPatch({ updatedAt: now }))
		return { id, title: data.title, order, status: 'draft', wordCount: 0, targetWordCount: data.targetWordCount, createdAt: now, updatedAt: now }
	}

	async saveChapterContent(novelId: string, chapterId: string, content: DocumentJSON, wordCount: number): Promise<void> {
		const doc = await this.db!.chapters.findOne(chapterId).exec()
		if (!doc || doc.novelId !== novelId) return
		await doc.incrementalPatch({ content, wordCount, updatedAt: new Date().toISOString() })
	}

	updateChapter(novelId: string, chapterId: string, updates: any): ChapterMeta | null {
		this.db!.chapters.findOne(chapterId).exec().then(doc => {
			if (doc && doc.novelId === novelId) doc.incrementalPatch({ ...updates, updatedAt: new Date().toISOString() })
		})
		return this.getChapterMeta(novelId, chapterId)
	}

	async deleteChapter(novelId: string, chapterId: string): Promise<void> {
		const doc = await this.db!.chapters.findOne(chapterId).exec()
		if (!doc || doc.novelId !== novelId) return
		await doc.remove()
		const remaining = await this.db!.chapters.find({ selector: { novelId }, sort: [{ order: 'asc' }] }).exec()
		await Promise.all(remaining.map((ch, i) => ch.incrementalPatch({ order: i + 1 })))
	}

	async reorderChapters(novelId: string, orderedIds: string[]): Promise<void> {
		const chapters = await this.db!.chapters.find({ selector: { novelId } }).exec()
		await Promise.all(orderedIds.map((id, i) => {
			const doc = chapters.find(ch => ch.id === id)
			if (doc) return doc.incrementalPatch({ order: i + 1 })
			return Promise.resolve()
		}))
	}

	chapters$(novelId: string): Observable<ChapterMeta[]> {
		return new Observable<ChapterMeta[]>(sub => {
			const s = this.db!.chapters.find({ selector: { novelId }, sort: [{ order: 'asc' }] }).$.subscribe(docs => {
				sub.next(docs.map(d => toChapterMeta(d)))
			})
			return () => s.unsubscribe()
		}).pipe(shareReplay(1))
	}

	// ─── ProgressPort ───
	async getProgress(novelId: string): Promise<ReadingProgress | null> {
		const doc = await this.db!.progress.findOne({ selector: { novelId } }).exec()
		if (!doc) return null
		return { novelId: doc.novelId, chaptersRead: doc.chaptersRead ?? {}, lastChapterId: doc.lastChapterId ?? null, updatedAt: doc.updatedAt }
	}

	async markChapterRead(novelId: string, chapterId: string): Promise<void> {
		const existing = await this.db!.progress.findOne({ selector: { novelId } }).exec()
		const now = new Date().toISOString()
		if (!existing) {
			await this.db!.progress.insert({ id: uid(), novelId, chaptersRead: { [chapterId]: now }, lastChapterId: chapterId, updatedAt: now })
		} else {
			const chaptersRead = { ...existing.chaptersRead }
			if (!chaptersRead[chapterId]) chaptersRead[chapterId] = now
			await existing.incrementalPatch({ chaptersRead, lastChapterId: chapterId, updatedAt: now })
		}
	}

	progress$(novelId: string): Observable<ReadingProgress | null> {
		return new Observable<ReadingProgress | null>(sub => {
			const s = this.db!.progress.findOne({ selector: { novelId } }).$.subscribe(doc => {
				sub.next(doc ? { novelId: doc.novelId, chaptersRead: doc.chaptersRead ?? {}, lastChapterId: doc.lastChapterId ?? null, updatedAt: doc.updatedAt } : null)
			})
			return () => s.unsubscribe()
		}).pipe(shareReplay(1))
	}
}

export function createRxDBAdapter(): DataPorts {
	const adapter = new RxDBAdapter()
	return { novels: adapter, chapters: adapter, progress: adapter }
}
