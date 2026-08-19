import type { DocumentJSON } from '@cosmonexus/nova-types'
import type { AppDatabase } from './database'

/**
 * Seeds demo data into RxDB collections if empty.
 * Called by initDataLayer() when no novels exist.
 */
export async function seedDatabase(db: AppDatabase): Promise<void> {
	const now = new Date().toISOString()

	const novels = [
		{ id: 'demo-last-horizon', title: 'The Last Horizon', coverUrl: 'https://picsum.photos/seed/last-horizon/400/600', author: 'A. Caldwell', genre: 'Sci-Fi', synopsis: 'In a world where the sun is dying, one astronaut must journey beyond the edge of known space to find a new home for humanity. But the further she goes, the more she realizes that the universe has secrets far stranger than darkness.', targetWordCount: 80000 },
		{ id: 'demo-ember-falls', title: 'Ember Falls', coverUrl: 'https://picsum.photos/seed/ember-falls/400/600', author: 'M. Torres', genre: 'Fantasy', synopsis: 'When the ancient wards protecting the city of Ember begin to crack, a young blacksmith discovers she can forge more than iron — she can forge fate itself. But every blade she creates demands a price paid in memory.', targetWordCount: 100000 },
		{ id: 'demo-salt-and-static', title: 'Salt & Static', coverUrl: 'https://picsum.photos/seed/salt-static/400/600', author: 'J. Okafor', genre: 'Literary', synopsis: 'A radio operator on a remote island begins receiving transmissions from a station that was decommissioned forty years ago. The voice on the other end claims to be her mother — who died when she was seven.', targetWordCount: 60000 },
		{ id: 'demo-hollow-season', title: 'The Hollow Season', coverUrl: 'https://picsum.photos/seed/hollow-season/400/600', author: 'R. Cheng', genre: 'Thriller', synopsis: "Every autumn, one resident of the small town of Vernal disappears without a trace. This year, detective Mara Song has returned to her hometown to stop the cycle — but she can't shake the feeling that the town itself doesn't want her to succeed.", targetWordCount: 75000 },
		{ id: 'demo-the-mapmakers-daughter', title: "The Mapmaker's Daughter", coverUrl: 'https://picsum.photos/seed/mapmaker/400/600', author: 'S. Abramov', genre: 'Fantasy', synopsis: "In a world where cartographers shape reality by drawing it, Lira inherits her father's forbidden atlas — a collection of maps to places that were never meant to exist. Now the Cartographers' Guild wants it back, and they'll erase anything in their path.", targetWordCount: 90000 },
		{ id: 'demo-neon-psalm', title: 'Neon Psalm', coverUrl: 'https://picsum.photos/seed/neon-psalm/400/600', author: 'D. Nakamura', genre: 'Sci-Fi', synopsis: "In a megacity where memories can be bought and sold, a disgraced priest discovers that someone is trafficking stolen prayers — and the buyers aren't human.", targetWordCount: 70000 },
	]

	await db.novels.bulkInsert(novels.map(n => ({ ...n, createdAt: now, updatedAt: now })))

	const chapters = [
		// The Last Horizon
		{ id: 'ch-1', novelId: 'demo-last-horizon', title: 'The Beginning', order: 1, status: 'final', wordCount: 4200, targetWordCount: 4000 },
		{ id: 'ch-2', novelId: 'demo-last-horizon', title: 'Rising Action', order: 2, status: 'final', wordCount: 3800, targetWordCount: 4000 },
		{ id: 'ch-3', novelId: 'demo-last-horizon', title: 'The Crisis', order: 3, status: 'draft', wordCount: 847, targetWordCount: 4000 },
		{ id: 'ch-4', novelId: 'demo-last-horizon', title: 'Convergence', order: 4, status: 'revision', wordCount: 3100, targetWordCount: 4000 },
		{ id: 'ch-5', novelId: 'demo-last-horizon', title: 'The Descent', order: 5, status: 'final', wordCount: 4500, targetWordCount: 5000 },
		// Ember Falls
		{ id: 'ef-1', novelId: 'demo-ember-falls', title: 'The Forge', order: 1, status: 'final', wordCount: 3200, targetWordCount: 4000 },
		{ id: 'ef-2', novelId: 'demo-ember-falls', title: 'First Sparks', order: 2, status: 'final', wordCount: 3800, targetWordCount: 4000 },
		{ id: 'ef-3', novelId: 'demo-ember-falls', title: 'Iron and Ash', order: 3, status: 'final', wordCount: 4100, targetWordCount: 4000 },
		{ id: 'ef-4', novelId: 'demo-ember-falls', title: 'The Ward-breaker', order: 4, status: 'final', wordCount: 3900, targetWordCount: 4000 },
		{ id: 'ef-5', novelId: 'demo-ember-falls', title: 'What Fire Remembers', order: 5, status: 'editing', wordCount: 4400, targetWordCount: 4500 },
		{ id: 'ef-6', novelId: 'demo-ember-falls', title: 'A Blade for Every Ghost', order: 6, status: 'draft', wordCount: 2100, targetWordCount: 4000 },
		// Salt & Static
		{ id: 'ss-1', novelId: 'demo-salt-and-static', title: 'Frequency', order: 1, status: 'final', wordCount: 3400, targetWordCount: 3500 },
		{ id: 'ss-2', novelId: 'demo-salt-and-static', title: 'Dead Air', order: 2, status: 'final', wordCount: 3100, targetWordCount: 3500 },
		{ id: 'ss-3', novelId: 'demo-salt-and-static', title: "The Keeper's Log", order: 3, status: 'final', wordCount: 3700, targetWordCount: 3500 },
		{ id: 'ss-4', novelId: 'demo-salt-and-static', title: 'Interference', order: 4, status: 'editing', wordCount: 2900, targetWordCount: 3500 },
		// The Hollow Season
		{ id: 'hs-1', novelId: 'demo-hollow-season', title: 'Homecoming', order: 1, status: 'final', wordCount: 4800, targetWordCount: 5000 },
		{ id: 'hs-2', novelId: 'demo-hollow-season', title: 'The Pattern', order: 2, status: 'final', wordCount: 4200, targetWordCount: 5000 },
		{ id: 'hs-3', novelId: 'demo-hollow-season', title: 'Missing Persons', order: 3, status: 'final', wordCount: 5100, targetWordCount: 5000 },
		// The Mapmaker's Daughter
		{ id: 'md-1', novelId: 'demo-the-mapmakers-daughter', title: 'Ink and Territory', order: 1, status: 'final', wordCount: 3600, targetWordCount: 4000 },
		{ id: 'md-2', novelId: 'demo-the-mapmakers-daughter', title: 'Uncharted', order: 2, status: 'final', wordCount: 4100, targetWordCount: 4000 },
		{ id: 'md-3', novelId: 'demo-the-mapmakers-daughter', title: 'The Blank Edge', order: 3, status: 'final', wordCount: 3900, targetWordCount: 4000 },
		{ id: 'md-4', novelId: 'demo-the-mapmakers-daughter', title: 'Here Be Dragons', order: 4, status: 'final', wordCount: 4300, targetWordCount: 4000 },
		{ id: 'md-5', novelId: 'demo-the-mapmakers-daughter', title: 'Borderlands', order: 5, status: 'editing', wordCount: 3800, targetWordCount: 4000 },
		{ id: 'md-6', novelId: 'demo-the-mapmakers-daughter', title: 'The Erasure', order: 6, status: 'draft', wordCount: 1200, targetWordCount: 4000 },
		{ id: 'md-7', novelId: 'demo-the-mapmakers-daughter', title: 'Terra Incognita', order: 7, status: 'draft', wordCount: 0, targetWordCount: 4000 },
		// Neon Psalm
		{ id: 'np-1', novelId: 'demo-neon-psalm', title: 'Confession', order: 1, status: 'final', wordCount: 3500, targetWordCount: 3500 },
		{ id: 'np-2', novelId: 'demo-neon-psalm', title: 'The Memory Market', order: 2, status: 'final', wordCount: 3800, targetWordCount: 3500 },
		{ id: 'np-3', novelId: 'demo-neon-psalm', title: 'Stolen Devotions', order: 3, status: 'final', wordCount: 3200, targetWordCount: 3500 },
		{ id: 'np-4', novelId: 'demo-neon-psalm', title: 'Signal and Noise', order: 4, status: 'final', wordCount: 3900, targetWordCount: 3500 },
		{ id: 'np-5', novelId: 'demo-neon-psalm', title: 'The Congregation', order: 5, status: 'draft', wordCount: 1800, targetWordCount: 3500 },
	]

	await db.chapters.bulkInsert(chapters.map(ch => ({ ...ch, createdAt: now, updatedAt: now })))

	// Seed chapter content for The Last Horizon
	const contents: Record<string, DocumentJSON> = {
		'ch-1': { type: 'doc', content: [
			{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'The Beginning' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: 'The morning the sun flickered, nobody noticed. It was Tuesday — unremarkable, ordinary, the kind of day that dissolves into memory the moment it ends. But Dr. Elena Vasquez noticed. She had been watching.' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: 'From her observatory perched on the shoulder of Mauna Kea, she had spent eleven years tracking solar output with the obsessive precision of someone who knows the numbers should never change. And for eleven years, they hadn\'t.' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: 'Until now.' }] },
		] },
		'ch-2': { type: 'doc', content: [
			{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Rising Action' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: 'Three weeks after the flicker, the world still hadn\'t noticed. The data was buried in academic journals, discussed in hushed tones at conferences attended by people whose names meant nothing to the public.' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: '"The sun isn\'t going to die, Dr. Vasquez. Not in our lifetimes, not in a million lifetimes."' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: 'But they were wrong.' }] },
		] },
		'ch-5': { type: 'doc', content: [
			{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'The Descent' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: 'Beyond the Kuiper Belt, the universe changed. Not gradually — not the slow dimming of familiar stars into unfamiliar ones. It changed the way a door changes a room.' }] },
			{ type: 'paragraph', content: [{ type: 'text', text: 'She pressed her face against the observation window and saw — nothing. Not blackness, not void. Nothing.' }] },
		] },
	}

	for (const [chId, content] of Object.entries(contents)) {
		const doc = await db.chapters.findOne(chId).exec()
		if (doc) await doc.incrementalPatch({ content })
	}
}

// Legacy exports for backward compat
export function isSeeded(): boolean { return true }
export function seed(): void { /* no-op — handled by initDataLayer */ }
