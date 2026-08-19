import type { NovelMeta } from '@cosmonexus/nova-types'

const WPM = 250

/**
 * Format a word count as human-readable reading time.
 * Uses 250 words per minute as average reading speed.
 */
export function formatReadingTime(wordCount: number): string {
	const minutes = Math.ceil(wordCount / WPM)
	if (minutes < 1) return '< 1 min'
	if (minutes < 60) return `${minutes} min`
	const hours = Math.floor(minutes / 60)
	const remaining = minutes % 60
	if (remaining === 0) return `${hours} hr`
	return `${hours} hr ${remaining} min`
}

/**
 * Get total word count from published chapters only (final + editing).
 */
export function getPublishedWordCount(novel: NovelMeta): number {
	return novel.chapters
		.filter(ch => ch.status === 'final' || ch.status === 'editing')
		.reduce((sum, ch) => sum + ch.wordCount, 0)
}

/**
 * Compute update frequency from chapter timestamps.
 * Returns null if fewer than 2 published chapters.
 */
export function computeUpdateFrequency(novel: NovelMeta): string | null {
	const published = novel.chapters
		.filter(ch => ch.status === 'final' || ch.status === 'editing')
	if (published.length < 2) return null

	const timestamps = published.map(ch => new Date(ch.updatedAt).getTime()).sort()
	const intervals = timestamps.slice(1).map((t, i) => t - timestamps[i])
	const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
	const days = avgInterval / (1000 * 60 * 60 * 24)

	if (days <= 7) return 'Updated weekly'
	if (days <= 14) return 'Updated biweekly'
	if (days <= 35) return 'Updated monthly'
	return 'Updated occasionally'
}
