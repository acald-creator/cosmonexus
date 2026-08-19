import type { DataPorts } from './ports'
import type { DocumentJSON } from '@cosmonexus/nova-types'

/** Seed demo data using only port interface methods. Adapter-agnostic. */
export async function seedWithPorts(ports: DataPorts): Promise<void> {
	const novels = [
		{ title: 'The Last Horizon', author: 'A. Caldwell', genre: 'Sci-Fi', coverUrl: 'https://picsum.photos/seed/last-horizon/400/600', synopsis: 'In a world where the sun is dying, one astronaut must journey beyond the edge of known space to find a new home for humanity.', targetWordCount: 80000 },
		{ title: 'Ember Falls', author: 'M. Torres', genre: 'Fantasy', coverUrl: 'https://picsum.photos/seed/ember-falls/400/600', synopsis: 'When the ancient wards protecting the city of Ember begin to crack, a young blacksmith discovers she can forge more than iron.', targetWordCount: 100000 },
		{ title: 'Salt & Static', author: 'J. Okafor', genre: 'Literary', coverUrl: 'https://picsum.photos/seed/salt-static/400/600', synopsis: 'A radio operator on a remote island begins receiving transmissions from a station decommissioned forty years ago.', targetWordCount: 60000 },
		{ title: 'The Hollow Season', author: 'R. Cheng', genre: 'Thriller', coverUrl: 'https://picsum.photos/seed/hollow-season/400/600', synopsis: 'Every autumn, one resident of the small town of Vernal disappears without a trace.', targetWordCount: 75000 },
		{ title: "The Mapmaker's Daughter", author: 'S. Abramov', genre: 'Fantasy', coverUrl: 'https://picsum.photos/seed/mapmaker/400/600', synopsis: "In a world where cartographers shape reality by drawing it, Lira inherits her father's forbidden atlas.", targetWordCount: 90000 },
		{ title: 'Neon Psalm', author: 'D. Nakamura', genre: 'Sci-Fi', coverUrl: 'https://picsum.photos/seed/neon-psalm/400/600', synopsis: "In a megacity where memories can be bought and sold, a disgraced priest discovers stolen prayers.", targetWordCount: 70000 },
	]

	const chapterSets: Record<string, Array<{ title: string; status: string; wordCount: number }>> = {
		'The Last Horizon': [
			{ title: 'The Beginning', status: 'final', wordCount: 4200 },
			{ title: 'Rising Action', status: 'final', wordCount: 3800 },
			{ title: 'The Crisis', status: 'draft', wordCount: 847 },
			{ title: 'Convergence', status: 'revision', wordCount: 3100 },
			{ title: 'The Descent', status: 'final', wordCount: 4500 },
		],
		'Ember Falls': [
			{ title: 'The Forge', status: 'final', wordCount: 3200 },
			{ title: 'First Sparks', status: 'final', wordCount: 3800 },
			{ title: 'Iron and Ash', status: 'final', wordCount: 4100 },
			{ title: 'The Ward-breaker', status: 'final', wordCount: 3900 },
			{ title: 'What Fire Remembers', status: 'editing', wordCount: 4400 },
		],
		'Salt & Static': [
			{ title: 'Frequency', status: 'final', wordCount: 3400 },
			{ title: 'Dead Air', status: 'final', wordCount: 3100 },
			{ title: "The Keeper's Log", status: 'final', wordCount: 3700 },
			{ title: 'Interference', status: 'editing', wordCount: 2900 },
		],
		'The Hollow Season': [
			{ title: 'Homecoming', status: 'final', wordCount: 4800 },
			{ title: 'The Pattern', status: 'final', wordCount: 4200 },
			{ title: 'Missing Persons', status: 'final', wordCount: 5100 },
		],
		"The Mapmaker's Daughter": [
			{ title: 'Ink and Territory', status: 'final', wordCount: 3600 },
			{ title: 'Uncharted', status: 'final', wordCount: 4100 },
			{ title: 'The Blank Edge', status: 'final', wordCount: 3900 },
			{ title: 'Here Be Dragons', status: 'final', wordCount: 4300 },
			{ title: 'Borderlands', status: 'editing', wordCount: 3800 },
		],
		'Neon Psalm': [
			{ title: 'Confession', status: 'final', wordCount: 3500 },
			{ title: 'The Memory Market', status: 'final', wordCount: 3800 },
			{ title: 'Stolen Devotions', status: 'final', wordCount: 3200 },
			{ title: 'Signal and Noise', status: 'final', wordCount: 3900 },
		],
	}

	for (const novelData of novels) {
		const novel = await ports.novels.createNovel(novelData)
		const chapters = chapterSets[novelData.title] ?? []
		for (const ch of chapters) {
			await ports.chapters.createChapter(novel.id, { title: ch.title })
			// Update status and wordCount
			const meta = ports.chapters.listChapters(novel.id)
			const created = meta[meta.length - 1]
			if (created) {
				ports.chapters.updateChapter(novel.id, created.id, { status: ch.status as any })
				await ports.chapters.saveChapterContent(novel.id, created.id, { type: 'doc', content: [{ type: 'paragraph' }] }, ch.wordCount)
			}
		}
	}
}
