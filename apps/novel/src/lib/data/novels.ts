import type { NovelMeta } from '@cosmonexus/nova-types'
import { getDatabase } from './database'
import { getNovelsCache } from './init'
import { uid } from './storage'

/** Get all novels (metadata only). Reads from cache (sync). */
export function listNovels(): NovelMeta[] {
	return getNovelsCache()
}

/** Get a single novel by ID. Reads from cache (sync). */
export function getNovel(id: string): NovelMeta | null {
	return getNovelsCache().find(n => n.id === id) ?? null
}

/** Create a new novel. */
export async function createNovel(data: {
	title: string
	author: string
	genre?: string
	synopsis?: string
	targetWordCount?: number
}): Promise<NovelMeta> {
	const db = await getDatabase()
	const now = new Date().toISOString()
	const id = uid()

	await db.novels.insert({
		id,
		title: data.title,
		author: data.author,
		genre: data.genre,
		synopsis: data.synopsis,
		targetWordCount: data.targetWordCount,
		createdAt: now,
		updatedAt: now,
	})

	return {
		id,
		title: data.title,
		author: data.author,
		genre: data.genre,
		synopsis: data.synopsis,
		targetWordCount: data.targetWordCount,
		chapters: [],
		createdAt: now,
		updatedAt: now,
	}
}

/** Update a novel's metadata. */
export async function updateNovel(
	id: string,
	updates: Partial<Omit<NovelMeta, 'id' | 'createdAt' | 'chapters'>>,
): Promise<NovelMeta | null> {
	const db = await getDatabase()
	const doc = await db.novels.findOne(id).exec()
	if (!doc) return null
	await doc.incrementalPatch({
		...updates,
		updatedAt: new Date().toISOString(),
	})
	return getNovel(id)
}

/** Delete a novel and all its chapters. */
export async function deleteNovel(id: string): Promise<void> {
	const db = await getDatabase()
	const chapters = await db.chapters.find({ selector: { novelId: id } }).exec()
	await Promise.all(chapters.map(ch => ch.remove()))
	const novel = await db.novels.findOne(id).exec()
	if (novel) await novel.remove()
}

/** Get total word count for a novel. */
export function getNovelWordCount(id: string): number {
	const novel = getNovel(id)
	if (!novel) return 0
	return novel.chapters.reduce((sum, ch) => sum + ch.wordCount, 0)
}

/** Update the chapters array within a novel (used by chapter CRUD). */
export function setNovelChapters(): void {
	// No-op: chapters are now a separate collection.
	// This function exists for backward compat with publishing.ts
}
