import type { DataPorts } from '../../ports'
import type { NovelsPort, CreateNovelData, UpdateNovelData } from '../../ports/novels.port'
import type { ChaptersPort, CreateChapterData, UpdateChapterData } from '../../ports/chapters.port'
import type { ProgressPort, ReadingProgress } from '../../ports/progress.port'
import type { NovelMeta, ChapterMeta, DocumentJSON } from '@cosmonexus/nova-types'
import { Observable, BehaviorSubject } from 'rxjs'
import { uid } from '../../storage'

class MemoryNovelsAdapter implements NovelsPort {
	private novels = new Map<string, NovelMeta>()
	private subject = new BehaviorSubject<NovelMeta[]>([])
	private chaptersAdapter: MemoryChaptersAdapter | null = null

	setChaptersAdapter(chapters: MemoryChaptersAdapter) { this.chaptersAdapter = chapters }

	async init(): Promise<void> {}

	private emit() {
		const list = [...this.novels.values()].map(n => ({
			...n,
			chapters: this.chaptersAdapter?.listChapters(n.id) ?? [],
		}))
		this.subject.next(list)
	}

	listNovels(): NovelMeta[] { return this.subject.getValue() }
	getNovel(id: string): NovelMeta | null {
		const n = this.novels.get(id)
		if (!n) return null
		return { ...n, chapters: this.chaptersAdapter?.listChapters(id) ?? [] }
	}

	async createNovel(data: CreateNovelData): Promise<NovelMeta> {
		const now = new Date().toISOString()
		const novel: NovelMeta = { id: uid(), ...data, chapters: [], createdAt: now, updatedAt: now }
		this.novels.set(novel.id, novel)
		this.emit()
		return this.getNovel(novel.id)!
	}

	async updateNovel(id: string, updates: UpdateNovelData): Promise<NovelMeta | null> {
		const existing = this.novels.get(id)
		if (!existing) return null
		const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() }
		this.novels.set(id, updated)
		this.emit()
		return this.getNovel(id)
	}

	async deleteNovel(id: string): Promise<void> {
		this.novels.delete(id)
		this.chaptersAdapter?.deleteAllForNovel(id)
		this.emit()
	}

	novels$(): Observable<NovelMeta[]> { return this.subject.asObservable() }
	novel$(id: string): Observable<NovelMeta | null> {
		return new Observable(sub => {
			const s = this.subject.subscribe(() => sub.next(this.getNovel(id)))
			return () => s.unsubscribe()
		})
	}

	reset() { this.novels.clear(); this.subject.next([]) }
}

class MemoryChaptersAdapter implements ChaptersPort {
	private chapters = new Map<string, ChapterMeta & { novelId: string }>()
	private content = new Map<string, DocumentJSON>()
	private subjects = new Map<string, BehaviorSubject<ChapterMeta[]>>()
	private novelsAdapter: MemoryNovelsAdapter | null = null

	setNovelsAdapter(novels: MemoryNovelsAdapter) { this.novelsAdapter = novels }

	private getSubject(novelId: string): BehaviorSubject<ChapterMeta[]> {
		if (!this.subjects.has(novelId)) this.subjects.set(novelId, new BehaviorSubject<ChapterMeta[]>([]))
		return this.subjects.get(novelId)!
	}

	private emit(novelId: string) {
		this.getSubject(novelId).next(this.listChapters(novelId))
	}

	listChapters(novelId: string): ChapterMeta[] {
		return [...this.chapters.values()]
			.filter(ch => ch.novelId === novelId)
			.sort((a, b) => a.order - b.order)
			.map(({ novelId: _, ...rest }) => rest)
	}

	getChapterMeta(novelId: string, chapterId: string): ChapterMeta | null {
		const ch = this.chapters.get(chapterId)
		if (!ch || ch.novelId !== novelId) return null
		const { novelId: _, ...rest } = ch
		return rest
	}

	async getChapterContent(novelId: string, chapterId: string): Promise<DocumentJSON | null> {
		const ch = this.chapters.get(chapterId)
		if (!ch || ch.novelId !== novelId) return null
		return this.content.get(chapterId) ?? null
	}

	async createChapter(novelId: string, data: CreateChapterData): Promise<ChapterMeta | null> {
		const existing = this.listChapters(novelId)
		const now = new Date().toISOString()
		const ch = {
			id: uid(), novelId, title: data.title, order: existing.length + 1,
			status: 'draft' as const, wordCount: 0, targetWordCount: data.targetWordCount,
			createdAt: now, updatedAt: now,
		}
		this.chapters.set(ch.id, ch)
		this.content.set(ch.id, { type: 'doc', content: [{ type: 'paragraph' }] })
		this.emit(novelId)
		const { novelId: _, ...meta } = ch
		return meta
	}

	async saveChapterContent(novelId: string, chapterId: string, content: DocumentJSON, wordCount: number): Promise<void> {
		const ch = this.chapters.get(chapterId)
		if (!ch || ch.novelId !== novelId) return
		this.content.set(chapterId, content)
		ch.wordCount = wordCount
		ch.updatedAt = new Date().toISOString()
		this.emit(novelId)
	}

	updateChapter(novelId: string, chapterId: string, updates: UpdateChapterData): ChapterMeta | null {
		const ch = this.chapters.get(chapterId)
		if (!ch || ch.novelId !== novelId) return null
		Object.assign(ch, updates, { updatedAt: new Date().toISOString() })
		this.emit(novelId)
		const { novelId: _, ...rest } = ch
		return rest
	}

	async deleteChapter(novelId: string, chapterId: string): Promise<void> {
		const ch = this.chapters.get(chapterId)
		if (!ch || ch.novelId !== novelId) return
		this.chapters.delete(chapterId)
		this.content.delete(chapterId)
		// Reorder remaining
		const remaining = [...this.chapters.values()].filter(c => c.novelId === novelId).sort((a, b) => a.order - b.order)
		remaining.forEach((c, i) => { c.order = i + 1 })
		this.emit(novelId)
	}

	async reorderChapters(novelId: string, orderedIds: string[]): Promise<void> {
		orderedIds.forEach((id, i) => {
			const ch = this.chapters.get(id)
			if (ch && ch.novelId === novelId) ch.order = i + 1
		})
		this.emit(novelId)
	}

	chapters$(novelId: string): Observable<ChapterMeta[]> {
		return this.getSubject(novelId).asObservable()
	}

	deleteAllForNovel(novelId: string) {
		for (const [id, ch] of this.chapters) {
			if (ch.novelId === novelId) { this.chapters.delete(id); this.content.delete(id) }
		}
		this.getSubject(novelId).next([])
	}

	reset() { this.chapters.clear(); this.content.clear(); this.subjects.forEach(s => s.next([])); this.subjects.clear() }
}

class MemoryProgressAdapter implements ProgressPort {
	private progress = new Map<string, ReadingProgress>()
	private subjects = new Map<string, BehaviorSubject<ReadingProgress | null>>()

	private getSubject(novelId: string): BehaviorSubject<ReadingProgress | null> {
		if (!this.subjects.has(novelId)) this.subjects.set(novelId, new BehaviorSubject<ReadingProgress | null>(null))
		return this.subjects.get(novelId)!
	}

	async getProgress(novelId: string): Promise<ReadingProgress | null> {
		return this.progress.get(novelId) ?? null
	}

	async markChapterRead(novelId: string, chapterId: string): Promise<void> {
		const now = new Date().toISOString()
		const existing = this.progress.get(novelId)
		if (!existing) {
			const p: ReadingProgress = { novelId, chaptersRead: { [chapterId]: now }, lastChapterId: chapterId, updatedAt: now }
			this.progress.set(novelId, p)
		} else {
			if (!existing.chaptersRead[chapterId]) existing.chaptersRead[chapterId] = now
			existing.lastChapterId = chapterId
			existing.updatedAt = now
		}
		this.getSubject(novelId).next(this.progress.get(novelId)!)
	}

	progress$(novelId: string): Observable<ReadingProgress | null> {
		return this.getSubject(novelId).asObservable()
	}

	reset() { this.progress.clear(); this.subjects.forEach(s => s.next(null)); this.subjects.clear() }
}

export type MemoryAdapterWithReset = DataPorts & { reset(): void }

export function createMemoryAdapter(): MemoryAdapterWithReset {
	const novels = new MemoryNovelsAdapter()
	const chapters = new MemoryChaptersAdapter()
	const progress = new MemoryProgressAdapter()

	novels.setChaptersAdapter(chapters)
	chapters.setNovelsAdapter(novels)

	return {
		novels,
		chapters,
		progress,
		reset() { novels.reset(); chapters.reset(); progress.reset() },
	}
}
