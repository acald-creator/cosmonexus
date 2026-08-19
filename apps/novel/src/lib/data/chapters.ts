import type { ChapterMeta, ChapterStatus, DocumentJSON } from '@cosmonexus/nova-types'
import { getDatabase } from './database'
import { getNovelsCache } from './init'
import { uid } from './storage'

/** Get all chapters for a novel (from cache). */
export function listChapters(novelId: string): ChapterMeta[] {
	const novel = getNovelsCache().find(n => n.id === novelId)
	return novel?.chapters ?? []
}

/** Get a single chapter's metadata. */
export function getChapterMeta(novelId: string, chapterId: string): ChapterMeta | null {
	const novel = getNovelsCache().find(n => n.id === novelId)
	return novel?.chapters.find(ch => ch.id === chapterId) ?? null
}

/** Get chapter document content (ProseMirror JSON). Async. */
export async function getChapterContent(novelId: string, chapterId: string): Promise<DocumentJSON | null> {
	const db = await getDatabase()
	const doc = await db.chapters.findOne(chapterId).exec()
	if (!doc || doc.novelId !== novelId) return null
	return (doc.content as DocumentJSON) ?? null
}

/** Create a new chapter. */
export async function createChapter(novelId: string, data: { title: string; targetWordCount?: number }): Promise<ChapterMeta | null> {
	const db = await getDatabase()
	const existing = await db.chapters.find({ selector: { novelId } }).exec()
	const order = existing.length + 1
	const now = new Date().toISOString()
	const id = uid()

	await db.chapters.insert({
		id,
		novelId,
		title: data.title,
		order,
		status: 'draft',
		wordCount: 0,
		targetWordCount: data.targetWordCount,
		content: { type: 'doc', content: [{ type: 'paragraph' }] },
		createdAt: now,
		updatedAt: now,
	})

	const novel = await db.novels.findOne(novelId).exec()
	if (novel) await novel.incrementalPatch({ updatedAt: now })

	return { id, title: data.title, order, status: 'draft', wordCount: 0, targetWordCount: data.targetWordCount, createdAt: now, updatedAt: now }
}

/** Save chapter content and update word count. */
export async function saveChapterContent(novelId: string, chapterId: string, content: DocumentJSON, wordCount: number): Promise<void> {
	const db = await getDatabase()
	const doc = await db.chapters.findOne(chapterId).exec()
	if (!doc || doc.novelId !== novelId) return
	await doc.incrementalPatch({ content, wordCount, updatedAt: new Date().toISOString() })
}

/** Update chapter metadata. */
export function updateChapter(novelId: string, chapterId: string, updates: Partial<Pick<ChapterMeta, 'title' | 'status' | 'targetWordCount'>>): ChapterMeta | null {
	getDatabase().then(async db => {
		const doc = await db.chapters.findOne(chapterId).exec()
		if (!doc || doc.novelId !== novelId) return
		await doc.incrementalPatch({ ...updates, updatedAt: new Date().toISOString() })
	})
	return getChapterMeta(novelId, chapterId)
}

/** Delete a chapter and reorder remaining. */
export async function deleteChapter(novelId: string, chapterId: string): Promise<void> {
	const db = await getDatabase()
	const doc = await db.chapters.findOne(chapterId).exec()
	if (!doc || doc.novelId !== novelId) return
	await doc.remove()
	const remaining = await db.chapters.find({ selector: { novelId }, sort: [{ order: 'asc' }] }).exec()
	await Promise.all(remaining.map((ch, i) => ch.incrementalPatch({ order: i + 1 })))
}

/** Reorder chapters. */
export async function reorderChapters(novelId: string, orderedIds: string[]): Promise<void> {
	const db = await getDatabase()
	const chapters = await db.chapters.find({ selector: { novelId } }).exec()
	await Promise.all(orderedIds.map((id, i) => {
		const doc = chapters.find(ch => ch.id === id)
		if (doc) return doc.incrementalPatch({ order: i + 1 })
		return Promise.resolve()
	}))
}
