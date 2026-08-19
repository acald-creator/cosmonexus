import type { ChapterMeta, ChapterStatus, DocumentJSON } from '@cosmonexus/nova-types'
import * as storage from './storage'
import { getNovel, setNovelChapters } from './novels'

/** Get all chapters for a novel (metadata from novel record). */
export function listChapters(novelId: string): ChapterMeta[] {
	const novel = getNovel(novelId)
	return novel?.chapters ?? []
}

/** Get a single chapter's metadata. */
export function getChapterMeta(novelId: string, chapterId: string): ChapterMeta | null {
	const chapters = listChapters(novelId)
	return chapters.find((ch) => ch.id === chapterId) ?? null
}

/** Get chapter document content (the ProseMirror JSON). */
export function getChapterContent(novelId: string, chapterId: string): DocumentJSON | null {
	return storage.get<DocumentJSON>(`chapter:${novelId}:${chapterId}`)
}

/** Create a new chapter. Returns the created chapter metadata. */
export function createChapter(novelId: string, data: { title: string; targetWordCount?: number }): ChapterMeta | null {
	const novel = getNovel(novelId)
	if (!novel) return null

	const now = new Date().toISOString()
	const order = novel.chapters.length + 1

	const chapter: ChapterMeta = {
		id: storage.uid(),
		title: data.title,
		order,
		status: 'draft',
		wordCount: 0,
		targetWordCount: data.targetWordCount,
		createdAt: now,
		updatedAt: now,
	}

	const chapters = [...novel.chapters, chapter]
	setNovelChapters(novelId, chapters)

	// Initialize empty content
	const emptyDoc: DocumentJSON = {
		type: 'doc',
		content: [{ type: 'paragraph' }],
	}
	storage.set(`chapter:${novelId}:${chapter.id}`, emptyDoc)

	return chapter
}

/** Save chapter content and update word count. */
export function saveChapterContent(novelId: string, chapterId: string, content: DocumentJSON, wordCount: number): void {
	storage.set(`chapter:${novelId}:${chapterId}`, content)

	// Update the chapter metadata
	const chapters = listChapters(novelId)
	const idx = chapters.findIndex((ch) => ch.id === chapterId)
	if (idx === -1) return

	chapters[idx] = {
		...chapters[idx],
		wordCount,
		updatedAt: new Date().toISOString(),
	}

	setNovelChapters(novelId, chapters)
}

/** Update chapter metadata (title, status, targetWordCount). */
export function updateChapter(novelId: string, chapterId: string, updates: Partial<Pick<ChapterMeta, 'title' | 'status' | 'targetWordCount'>>): ChapterMeta | null {
	const chapters = listChapters(novelId)
	const idx = chapters.findIndex((ch) => ch.id === chapterId)
	if (idx === -1) return null

	chapters[idx] = {
		...chapters[idx],
		...updates,
		updatedAt: new Date().toISOString(),
	}

	setNovelChapters(novelId, chapters)
	return chapters[idx]
}

/** Delete a chapter. */
export function deleteChapter(novelId: string, chapterId: string): void {
	const chapters = listChapters(novelId)
	const filtered = chapters
		.filter((ch) => ch.id !== chapterId)
		.map((ch, i) => ({ ...ch, order: i + 1 }))

	setNovelChapters(novelId, filtered)
	storage.remove(`chapter:${novelId}:${chapterId}`)
}

/** Reorder chapters. Pass the full ordered array of chapter IDs. */
export function reorderChapters(novelId: string, orderedIds: string[]): void {
	const chapters = listChapters(novelId)
	const reordered = orderedIds
		.map((id, i) => {
			const ch = chapters.find((c) => c.id === id)
			return ch ? { ...ch, order: i + 1 } : null
		})
		.filter(Boolean) as ChapterMeta[]

	setNovelChapters(novelId, reordered)
}
