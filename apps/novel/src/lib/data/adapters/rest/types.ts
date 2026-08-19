import type { NovelMeta, ChapterMeta, DocumentJSON } from '@cosmonexus/nova-types'
import type { ReadingProgress } from '../../ports/progress.port'

/** REST API endpoint definitions for the novel platform. */
export type RestEndpoints = {
	novels: {
		list: { method: 'GET'; path: '/api/novels'; response: NovelMeta[] }
		get: { method: 'GET'; path: '/api/novels/:id'; response: NovelMeta }
		byGenre: { method: 'GET'; path: '/api/novels?genre=:genre'; response: NovelMeta[] }
		byAuthor: { method: 'GET'; path: '/api/novels?author=:author'; response: NovelMeta[] }
	}
	chapters: {
		list: { method: 'GET'; path: '/api/novels/:novelId/chapters'; response: ChapterMeta[] }
		get: { method: 'GET'; path: '/api/novels/:novelId/chapters/:id'; response: ChapterMeta }
		content: { method: 'GET'; path: '/api/novels/:novelId/chapters/:id/content'; response: DocumentJSON }
	}
	progress: {
		get: { method: 'GET'; path: '/api/progress/:novelId'; response: ReadingProgress }
		markRead: { method: 'POST'; path: '/api/progress/:novelId/chapters/:chapterId'; response: void }
	}
}

export type RestConfig = {
	baseUrl: string
	headers?: Record<string, string>
}
