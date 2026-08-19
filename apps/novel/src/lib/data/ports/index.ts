export type { NovelsPort, CreateNovelData, UpdateNovelData } from './novels.port'
export type { ChaptersPort, CreateChapterData, UpdateChapterData } from './chapters.port'
export type { ProgressPort, ReadingProgress } from './progress.port'

import type { NovelsPort } from './novels.port'
import type { ChaptersPort } from './chapters.port'
import type { ProgressPort } from './progress.port'

export type DataPorts = {
	novels: NovelsPort
	chapters: ChaptersPort
	progress: ProgressPort
}
