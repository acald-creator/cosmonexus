import type { NovelMeta } from '@cosmonexus/nova-types'
import { getAdapter } from './registry'
import type { CreateNovelData, UpdateNovelData } from './ports'

export function listNovels(): NovelMeta[] {
	return getAdapter().novels.listNovels()
}

export function getNovel(id: string): NovelMeta | null {
	return getAdapter().novels.getNovel(id)
}

export async function createNovel(data: CreateNovelData): Promise<NovelMeta> {
	return getAdapter().novels.createNovel(data)
}

export async function updateNovel(id: string, updates: UpdateNovelData): Promise<NovelMeta | null> {
	return getAdapter().novels.updateNovel(id, updates)
}

export async function deleteNovel(id: string): Promise<void> {
	return getAdapter().novels.deleteNovel(id)
}

export function getNovelWordCount(id: string): number {
	const novel = getNovel(id)
	if (!novel) return 0
	return novel.chapters.reduce((sum, ch) => sum + ch.wordCount, 0)
}

export function setNovelChapters(): void {
	// No-op: chapters are a separate collection
}
