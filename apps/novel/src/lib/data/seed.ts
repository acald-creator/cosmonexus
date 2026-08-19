import type { NovelMeta, DocumentJSON } from '@cosmonexus/nova-types'
import * as storage from './storage'

const SEEDED_KEY = 'seeded'

/** Check if demo data has been seeded already. */
export function isSeeded(): boolean {
	return storage.get<boolean>(SEEDED_KEY) === true
}

/** Seed demo data for first-time visitors. */
export function seed(): void {
	if (isSeeded()) return

	const now = new Date().toISOString()
	const novelId = 'demo-last-horizon'

	const chapters = [
		{ id: 'ch-1', title: 'The Beginning', order: 1, status: 'final' as const, wordCount: 4200, targetWordCount: 4000 },
		{ id: 'ch-2', title: 'Rising Action', order: 2, status: 'final' as const, wordCount: 3800, targetWordCount: 4000 },
		{ id: 'ch-3', title: 'The Crisis', order: 3, status: 'draft' as const, wordCount: 847, targetWordCount: 4000 },
		{ id: 'ch-4', title: 'Convergence', order: 4, status: 'revision' as const, wordCount: 3100, targetWordCount: 4000 },
		{ id: 'ch-5', title: 'The Descent', order: 5, status: 'final' as const, wordCount: 4500, targetWordCount: 5000 },
	].map((ch) => ({ ...ch, createdAt: now, updatedAt: now }))

	const novel: NovelMeta = {
		id: novelId,
		title: 'The Last Horizon',
		author: 'A. Caldwell',
		genre: 'Sci-Fi',
		synopsis: 'In a world where the sun is dying, one astronaut must journey beyond the edge of known space to find a new home for humanity. But the further she goes, the more she realizes that the universe has secrets far stranger than darkness.',
		targetWordCount: 80000,
		chapters,
		createdAt: now,
		updatedAt: now,
	}

	// Save novel index
	storage.set('novels', [novel])

	// Save chapter contents
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
		'ch-3': {
			type: 'doc',
			content: [
				{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'The Crisis' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'The storm had been building for hours. Dark clouds rolled across the valley like a tide of ink, swallowing the last traces of afternoon light.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: '"We need to leave," she said, her voice barely above a whisper.' }] },
			],
		},
		'ch-4': {
			type: 'doc',
			content: [
				{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Convergence' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'The ship hummed beneath her feet. Not the mechanical drone of engines — this was something else. Something alive.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Elena placed her palm flat against the bulkhead and felt the vibration travel up her arm, settle into her chest like a second heartbeat. The navigation display painted her face in soft blue light as coordinates scrolled past — numbers that made no sense, pointing to a place that shouldn\'t exist.' }] },
			],
		},
		'ch-5': {
			type: 'doc',
			content: [
				{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'The Descent' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Beyond the Kuiper Belt, the universe changed. Not gradually — not the slow dimming of familiar stars into unfamiliar ones. It changed the way a door changes a room. One moment you\'re in the hallway; the next, somewhere else entirely.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Elena had read about the theoretical boundary — the heliopause, where solar wind gives way to interstellar medium. But no paper had prepared her for the silence. True silence. The absence of the sun\'s constant whisper against the hull.' }] },
			],
		},
	}

	for (const [chId, content] of Object.entries(chapterContents)) {
		storage.set(`chapter:${novelId}:${chId}`, content)
	}

	storage.set(SEEDED_KEY, true)
}
