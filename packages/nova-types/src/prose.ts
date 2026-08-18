/**
 * Types for the Nova prose/novel editor system.
 * Used by @cosmonexus/prose and consuming applications.
 */

// === Document Structure ===

/** Unique identifier for a novel/book. */
export type NovelId = string

/** Unique identifier for a chapter. */
export type ChapterId = string

/** Status of a chapter in the writing workflow. */
export type ChapterStatus = 'draft' | 'revision' | 'editing' | 'final'

/** Metadata for a single chapter. */
export type ChapterMeta = {
	id: ChapterId
	title: string
	order: number
	status: ChapterStatus
	wordCount: number
	targetWordCount?: number
	createdAt: string
	updatedAt: string
}

/** Metadata for a novel/book project. */
export type NovelMeta = {
	id: NovelId
	title: string
	author: string
	synopsis?: string
	genre?: string
	targetWordCount?: number
	chapters: ChapterMeta[]
	createdAt: string
	updatedAt: string
}

// === Editor Content ===

/** A ProseMirror-compatible document as JSON. */
export type DocumentJSON = {
	type: 'doc'
	content?: NodeJSON[]
}

/** A ProseMirror-compatible node as JSON. */
export type NodeJSON = {
	type: string
	attrs?: Record<string, unknown>
	content?: NodeJSON[]
	marks?: MarkJSON[]
	text?: string
}

/** A ProseMirror-compatible mark as JSON. */
export type MarkJSON = {
	type: string
	attrs?: Record<string, unknown>
}

/** A chapter's full content (metadata + document). */
export type Chapter = {
	meta: ChapterMeta
	content: DocumentJSON
}

// === Word Count & Progress ===

/** Word and character count for a document or selection. */
export type WordCount = {
	words: number
	characters: number
}

/** Writing progress for a chapter or novel. */
export type WritingProgress = {
	current: number
	target: number
	/** Percentage 0–100. */
	percentage: number
}

/** Daily writing session stats. */
export type WritingSession = {
	date: string
	wordsWritten: number
	duration: number // minutes
	chaptersEdited: ChapterId[]
}

// === Editor Events ===

/** Events emitted by the novel editor. */
export type EditorEventMap = {
	/** Document content changed. */
	'content:change': { chapterId: ChapterId; wordCount: WordCount }
	/** Editor gained focus. */
	'editor:focus': { chapterId: ChapterId }
	/** Editor lost focus. */
	'editor:blur': { chapterId: ChapterId }
	/** Chapter was saved (locally or remotely). */
	'chapter:save': { chapterId: ChapterId; timestamp: string }
	/** Chapter status changed. */
	'chapter:status': { chapterId: ChapterId; from: ChapterStatus; to: ChapterStatus }
	/** Selection changed in the editor. */
	'selection:change': { from: number; to: number; empty: boolean }
	/** A mark (formatting) was toggled. */
	'mark:toggle': { mark: string; active: boolean }
}

/** Extract the payload type for a given editor event. */
export type EditorEventPayload<K extends keyof EditorEventMap> = EditorEventMap[K]

// === Author Annotations ===

/** An inline author comment/annotation. */
export type Annotation = {
	id: string
	chapterId: ChapterId
	from: number
	to: number
	note: string
	resolved: boolean
	createdAt: string
}

// === Export Formats ===

/** Supported export formats for novel output. */
export type ExportFormat = 'markdown' | 'html' | 'epub' | 'pdf' | 'docx' | 'plain'

/** Options for exporting a novel. */
export type ExportOptions = {
	format: ExportFormat
	includeAnnotations?: boolean
	chapterIds?: ChapterId[]
}
