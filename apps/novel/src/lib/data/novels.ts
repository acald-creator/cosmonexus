import type { NovelMeta, ChapterMeta } from '@cosmonexus/nova-types'
import * as storage from './storage'

const NOVELS_INDEX_KEY = 'novels'

/** Get all novels (metadata only). */
export function listNovels(): NovelMeta[] {
	return storage.get<NovelMeta[]>(NOVELS_INDEX_KEY) ?? []
}

/** Get a single novel by ID. */
export function getNovel(id: string): NovelMeta | null {
	const novels = listNovels()
	return novels.find((n) => n.id === id) ?? null
}

/** Create a new novel. Returns the created novel. */
export function createNovel(data: { title: string; author: string; genre?: string; synopsis?: string; targetWordCount?: number }): NovelMeta {
	const novels = listNovels()
	const now = new Date().toISOString()

	const novel: NovelMeta = {
		id: storage.uid(),
		title: data.title,
		author: data.author,
		genre: data.genre,
		synopsis: data.synopsis,
		targetWordCount: data.targetWordCount,
		chapters: [],
		createdAt: now,
		updatedAt: now,
	}

	novels.push(novel)
	storage.set(NOVELS_INDEX_KEY, novels)
	return novel
}

/** Update a novel's metadata. */
export function updateNovel(id: string, updates: Partial<Omit<NovelMeta, 'id' | 'createdAt'>>): NovelMeta | null {
	const novels = listNovels()
	const idx = novels.findIndex((n) => n.id === id)
	if (idx === -1) return null

	novels[idx] = {
		...novels[idx],
		...updates,
		updatedAt: new Date().toISOString(),
	}

	storage.set(NOVELS_INDEX_KEY, novels)
	return novels[idx]
}

/** Delete a novel and all its chapter content. */
export function deleteNovel(id: string): void {
	const novels = listNovels()
	const novel = novels.find((n) => n.id === id)
	if (!novel) return

	// Remove all chapter content
	for (const ch of novel.chapters) {
		storage.remove(`chapter:${id}:${ch.id}`)
	}

	storage.set(NOVELS_INDEX_KEY, novels.filter((n) => n.id !== id))
}

/** Update the chapters array within a novel (used by chapter CRUD). */
export function setNovelChapters(novelId: string, chapters: ChapterMeta[]): void {
	const novels = listNovels()
	const idx = novels.findIndex((n) => n.id === novelId)
	if (idx === -1) return

	novels[idx].chapters = chapters
	novels[idx].updatedAt = new Date().toISOString()
	storage.set(NOVELS_INDEX_KEY, novels)
}

/** Get total word count for a novel. */
export function getNovelWordCount(id: string): number {
	const novel = getNovel(id)
	if (!novel) return 0
	return novel.chapters.reduce((sum, ch) => sum + ch.wordCount, 0)
}
