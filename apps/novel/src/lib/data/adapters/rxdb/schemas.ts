import type { RxCollection, RxDocument, RxJsonSchema } from 'rxdb'
import type { DocumentJSON } from '@cosmonexus/nova-types'

// ─── Novel ───

export type NovelDocType = {
	id: string
	title: string
	author: string
	genre?: string
	synopsis?: string
	coverUrl?: string
	targetWordCount?: number
	createdAt: string
	updatedAt: string
}

export type NovelDocument = RxDocument<NovelDocType>
export type NovelCollection = RxCollection<NovelDocType>

export const novelSchema: RxJsonSchema<NovelDocType> = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		title: { type: 'string', maxLength: 500 },
		author: { type: 'string', maxLength: 200 },
		genre: { type: 'string', maxLength: 100 },
		synopsis: { type: 'string', maxLength: 5000 },
		coverUrl: { type: 'string', maxLength: 1000 },
		targetWordCount: { type: 'number' },
		createdAt: { type: 'string', maxLength: 30 },
		updatedAt: { type: 'string', maxLength: 30 },
	},
	required: ['id', 'title', 'author', 'createdAt', 'updatedAt'],
	indexes: [['author'], ['updatedAt']],
}

// ─── Chapter ───

export type ChapterDocType = {
	id: string
	novelId: string
	title: string
	order: number
	status: string
	wordCount: number
	targetWordCount?: number
	content?: DocumentJSON
	createdAt: string
	updatedAt: string
}

export type ChapterDocument = RxDocument<ChapterDocType>
export type ChapterCollection = RxCollection<ChapterDocType>

export const chapterSchema: RxJsonSchema<ChapterDocType> = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		novelId: { type: 'string', maxLength: 100 },
		title: { type: 'string', maxLength: 500 },
		order: { type: 'integer', minimum: 0, maximum: 10000, multipleOf: 1 },
		status: { type: 'string', maxLength: 20 },
		wordCount: { type: 'integer', minimum: 0, maximum: 10000000, multipleOf: 1 },
		targetWordCount: { type: 'integer', minimum: 0, maximum: 10000000, multipleOf: 1 },
		content: { type: 'object' },
		createdAt: { type: 'string', maxLength: 30 },
		updatedAt: { type: 'string', maxLength: 30 },
	},
	required: ['id', 'novelId', 'title', 'order', 'status', 'wordCount', 'createdAt', 'updatedAt'],
	indexes: [['novelId', 'order'], ['novelId', 'status'], ['status']],
}

// ─── Reading Progress ───

export type ProgressDocType = {
	id: string
	novelId: string
	chaptersRead: Record<string, string>
	lastChapterId?: string
	updatedAt: string
}

export type ProgressDocument = RxDocument<ProgressDocType>
export type ProgressCollection = RxCollection<ProgressDocType>

export const progressSchema: RxJsonSchema<ProgressDocType> = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		novelId: { type: 'string', maxLength: 100 },
		chaptersRead: { type: 'object' },
		lastChapterId: { type: 'string', maxLength: 100 },
		updatedAt: { type: 'string', maxLength: 30 },
	},
	required: ['id', 'novelId', 'chaptersRead', 'updatedAt'],
	indexes: [['novelId']],
}

// ─── Author ───

export type AuthorDocType = {
	id: string
	name: string
	bio?: string
	avatarUrl?: string
	createdAt: string
	updatedAt: string
}

export type AuthorDocument = RxDocument<AuthorDocType>
export type AuthorCollection = RxCollection<AuthorDocType>

export const authorSchema: RxJsonSchema<AuthorDocType> = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		name: { type: 'string', maxLength: 200 },
		bio: { type: 'string', maxLength: 5000 },
		avatarUrl: { type: 'string', maxLength: 1000 },
		createdAt: { type: 'string', maxLength: 30 },
		updatedAt: { type: 'string', maxLength: 30 },
	},
	required: ['id', 'name', 'createdAt', 'updatedAt'],
	indexes: [['name']],
}
