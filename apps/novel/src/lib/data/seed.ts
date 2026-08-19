import type { NovelMeta, DocumentJSON } from '@cosmonexus/nova-types'
import * as storage from './storage'

const SEEDED_KEY = 'seeded'

export function isSeeded(): boolean {
	return storage.get<boolean>(SEEDED_KEY) === true
}

export function seed(): void {
	if (isSeeded()) return

	const now = new Date().toISOString()

	const novels: NovelMeta[] = [
		{
			id: 'demo-last-horizon',
			title: 'The Last Horizon',
			coverUrl: 'https://picsum.photos/seed/last-horizon/400/600',
			author: 'A. Caldwell',
			genre: 'Sci-Fi',
			synopsis: 'In a world where the sun is dying, one astronaut must journey beyond the edge of known space to find a new home for humanity. But the further she goes, the more she realizes that the universe has secrets far stranger than darkness.',
			targetWordCount: 80000,
			chapters: [
				{ id: 'ch-1', title: 'The Beginning', order: 1, status: 'final', wordCount: 4200, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'ch-2', title: 'Rising Action', order: 2, status: 'final', wordCount: 3800, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'ch-3', title: 'The Crisis', order: 3, status: 'draft', wordCount: 847, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'ch-4', title: 'Convergence', order: 4, status: 'revision', wordCount: 3100, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'ch-5', title: 'The Descent', order: 5, status: 'final', wordCount: 4500, targetWordCount: 5000, createdAt: now, updatedAt: now },
			],
			createdAt: now,
			updatedAt: now,
		},
		{
			id: 'demo-ember-falls',
			title: 'Ember Falls',
			coverUrl: 'https://picsum.photos/seed/ember-falls/400/600',
			author: 'M. Torres',
			genre: 'Fantasy',
			synopsis: 'When the ancient wards protecting the city of Ember begin to crack, a young blacksmith discovers she can forge more than iron — she can forge fate itself. But every blade she creates demands a price paid in memory.',
			targetWordCount: 100000,
			chapters: [
				{ id: 'ef-1', title: 'The Forge', order: 1, status: 'final', wordCount: 3200, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'ef-2', title: 'First Sparks', order: 2, status: 'final', wordCount: 3800, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'ef-3', title: 'Iron and Ash', order: 3, status: 'final', wordCount: 4100, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'ef-4', title: 'The Ward-breaker', order: 4, status: 'final', wordCount: 3900, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'ef-5', title: 'What Fire Remembers', order: 5, status: 'editing', wordCount: 4400, targetWordCount: 4500, createdAt: now, updatedAt: now },
				{ id: 'ef-6', title: 'A Blade for Every Ghost', order: 6, status: 'draft', wordCount: 2100, targetWordCount: 4000, createdAt: now, updatedAt: now },
			],
			createdAt: now,
			updatedAt: now,
		},
		{
			id: 'demo-salt-and-static',
			title: 'Salt & Static',
			coverUrl: 'https://picsum.photos/seed/salt-static/400/600',
			author: 'J. Okafor',
			genre: 'Literary',
			synopsis: 'A radio operator on a remote island begins receiving transmissions from a station that was decommissioned forty years ago. The voice on the other end claims to be her mother — who died when she was seven.',
			targetWordCount: 60000,
			chapters: [
				{ id: 'ss-1', title: 'Frequency', order: 1, status: 'final', wordCount: 3400, targetWordCount: 3500, createdAt: now, updatedAt: now },
				{ id: 'ss-2', title: 'Dead Air', order: 2, status: 'final', wordCount: 3100, targetWordCount: 3500, createdAt: now, updatedAt: now },
				{ id: 'ss-3', title: 'The Keeper\'s Log', order: 3, status: 'final', wordCount: 3700, targetWordCount: 3500, createdAt: now, updatedAt: now },
				{ id: 'ss-4', title: 'Interference', order: 4, status: 'editing', wordCount: 2900, targetWordCount: 3500, createdAt: now, updatedAt: now },
			],
			createdAt: now,
			updatedAt: now,
		},
		{
			id: 'demo-hollow-season',
			title: 'The Hollow Season',
			coverUrl: 'https://picsum.photos/seed/hollow-season/400/600',
			author: 'R. Cheng',
			genre: 'Thriller',
			synopsis: 'Every autumn, one resident of the small town of Vernal disappears without a trace. This year, detective Mara Song has returned to her hometown to stop the cycle — but she can\'t shake the feeling that the town itself doesn\'t want her to succeed.',
			targetWordCount: 75000,
			chapters: [
				{ id: 'hs-1', title: 'Homecoming', order: 1, status: 'final', wordCount: 4800, targetWordCount: 5000, createdAt: now, updatedAt: now },
				{ id: 'hs-2', title: 'The Pattern', order: 2, status: 'final', wordCount: 4200, targetWordCount: 5000, createdAt: now, updatedAt: now },
				{ id: 'hs-3', title: 'Missing Persons', order: 3, status: 'final', wordCount: 5100, targetWordCount: 5000, createdAt: now, updatedAt: now },
			],
			createdAt: now,
			updatedAt: now,
		},
		{
			id: 'demo-the-mapmakers-daughter',
			title: 'The Mapmaker\'s Daughter',
			coverUrl: 'https://picsum.photos/seed/mapmaker/400/600',
			author: 'S. Abramov',
			genre: 'Fantasy',
			synopsis: 'In a world where cartographers shape reality by drawing it, Lira inherits her father\'s forbidden atlas — a collection of maps to places that were never meant to exist. Now the Cartographers\' Guild wants it back, and they\'ll erase anything in their path.',
			targetWordCount: 90000,
			chapters: [
				{ id: 'md-1', title: 'Ink and Territory', order: 1, status: 'final', wordCount: 3600, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'md-2', title: 'Uncharted', order: 2, status: 'final', wordCount: 4100, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'md-3', title: 'The Blank Edge', order: 3, status: 'final', wordCount: 3900, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'md-4', title: 'Here Be Dragons', order: 4, status: 'final', wordCount: 4300, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'md-5', title: 'Borderlands', order: 5, status: 'editing', wordCount: 3800, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'md-6', title: 'The Erasure', order: 6, status: 'draft', wordCount: 1200, targetWordCount: 4000, createdAt: now, updatedAt: now },
				{ id: 'md-7', title: 'Terra Incognita', order: 7, status: 'draft', wordCount: 0, targetWordCount: 4000, createdAt: now, updatedAt: now },
			],
			createdAt: now,
			updatedAt: now,
		},
		{
			id: 'demo-neon-psalm',
			title: 'Neon Psalm',
			coverUrl: 'https://picsum.photos/seed/neon-psalm/400/600',
			author: 'D. Nakamura',
			genre: 'Sci-Fi',
			synopsis: 'In a megacity where memories can be bought and sold, a disgraced priest discovers that someone is trafficking stolen prayers — and the buyers aren\'t human.',
			targetWordCount: 70000,
			chapters: [
				{ id: 'np-1', title: 'Confession', order: 1, status: 'final', wordCount: 3500, targetWordCount: 3500, createdAt: now, updatedAt: now },
				{ id: 'np-2', title: 'The Memory Market', order: 2, status: 'final', wordCount: 3800, targetWordCount: 3500, createdAt: now, updatedAt: now },
				{ id: 'np-3', title: 'Stolen Devotions', order: 3, status: 'final', wordCount: 3200, targetWordCount: 3500, createdAt: now, updatedAt: now },
				{ id: 'np-4', title: 'Signal and Noise', order: 4, status: 'final', wordCount: 3900, targetWordCount: 3500, createdAt: now, updatedAt: now },
				{ id: 'np-5', title: 'The Congregation', order: 5, status: 'draft', wordCount: 1800, targetWordCount: 3500, createdAt: now, updatedAt: now },
			],
			createdAt: now,
			updatedAt: now,
		},
	]

	storage.set('novels', novels)

	// Seed chapter content for the first novel only
	const chapterContents: Record<string, DocumentJSON> = {
		'ch-1': {
			type: 'doc',
			content: [
				{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'The Beginning' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'The morning the sun flickered, nobody noticed. It was Tuesday — unremarkable, ordinary, the kind of day that dissolves into memory the moment it ends. But Dr. Elena Vasquez noticed. She had been watching.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'From her observatory perched on the shoulder of Mauna Kea, she had spent eleven years tracking solar output with the obsessive precision of someone who knows the numbers should never change. And for eleven years, they hadn\'t.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Until now.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: '"Run it again," she said to the empty room, though the computer needed no instruction. It was already running the diagnostics for the third time. The result would be the same. She knew it in her bones the way sailors know storms — not from instruments, but from the quality of the silence before.' }] },
			],
		},
		'ch-2': {
			type: 'doc',
			content: [
				{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Rising Action' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Three weeks after the flicker, the world still hadn\'t noticed. The data was buried in academic journals, discussed in hushed tones at conferences attended by people whose names meant nothing to the public.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Elena had tried to raise the alarm. She\'d called the department head, then the university president, then her senator\'s office. Each conversation ended the same way — with the polite, practiced dismissal reserved for those who cry wolf about the sky falling.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: '"The sun isn\'t going to die, Dr. Vasquez. Not in our lifetimes, not in a million lifetimes."' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'But they were wrong. And by the time they realized it, there would be no time left to run.' }] },
			],
		},
		'ch-5': {
			type: 'doc',
			content: [
				{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'The Descent' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Beyond the Kuiper Belt, the universe changed. Not gradually — not the slow dimming of familiar stars into unfamiliar ones. It changed the way a door changes a room. One moment you\'re in the hallway; the next, somewhere else entirely.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Elena had read about the theoretical boundary — the heliopause, where solar wind gives way to interstellar medium. But no paper had prepared her for the silence. True silence. The absence of the sun\'s constant whisper against the hull.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'She pressed her face against the observation window and saw — nothing. Not blackness, not void. Nothing. The distinction mattered more than she could explain.' }] },
			],
		},
	}

	for (const [chId, content] of Object.entries(chapterContents)) {
		storage.set(`chapter:demo-last-horizon:${chId}`, content)
	}

	storage.set(SEEDED_KEY, true)
}
