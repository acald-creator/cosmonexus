import type { NovelMeta } from '@cosmonexus/nova-types'
import { getPublishedWordCount } from './reading-time'

/** Novels updated within the last 7 days, sorted by most recent. */
export function getNewThisWeek(novels: NovelMeta[]): NovelMeta[] {
	const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
	return novels
		.filter(n => new Date(n.updatedAt).getTime() > sevenDaysAgo)
		.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

/** Top 4 novels by total published word count. */
export function getStaffPicks(novels: NovelMeta[]): NovelMeta[] {
	return [...novels]
		.sort((a, b) => getPublishedWordCount(b) - getPublishedWordCount(a))
		.slice(0, 4)
}

/** Novels where every chapter has status 'final'. */
export function getCompletedSeries(novels: NovelMeta[]): NovelMeta[] {
	return novels.filter(n =>
		n.chapters.length > 0 && n.chapters.every(ch => ch.status === 'final')
	)
}

/** Novels with more draft/revision chapters than final (actively writing). */
export function getRisingAuthors(novels: NovelMeta[]): NovelMeta[] {
	return novels.filter(n => {
		const finalCount = n.chapters.filter(ch => ch.status === 'final').length
		const activeCount = n.chapters.filter(ch => ch.status === 'draft' || ch.status === 'revision').length
		return activeCount > finalCount
	})
}

/** Up to 4 related novels by genre, then author, then fill. */
export function getRelatedNovels(current: NovelMeta, allNovels: NovelMeta[]): NovelMeta[] {
	const others = allNovels.filter(n => n.id !== current.id)

	const sameGenre = others.filter(n => n.genre === current.genre)
	if (sameGenre.length >= 4) return sameGenre.slice(0, 4)

	const sameAuthor = others.filter(
		n => n.author === current.author && n.genre !== current.genre
	)
	const combined = [...sameGenre, ...sameAuthor]
	if (combined.length >= 2) return combined.slice(0, 4)

	const remaining = others.filter(
		n => n.genre !== current.genre && n.author !== current.author
	)
	return [...combined, ...remaining].slice(0, 4)
}
