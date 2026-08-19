const AUTHOR_BIOS: Record<string, string> = {
	'A. Caldwell': 'Writes speculative fiction exploring what happens when humanity confronts the edges of the knowable universe. Their work blends hard science with intimate character studies.',
	'M. Torres': 'Fantasy novelist drawn to stories about craft, creation, and the hidden costs of power. When not writing, they teach metalworking workshops.',
	'J. Okafor': 'Literary fiction author exploring memory, distance, and the strange frequencies that connect the living to the lost. Based on the coast.',
	'R. Cheng': 'Thriller writer specializing in small-town mysteries where the landscape is as much a character as the people. Former investigative journalist.',
	'S. Abramov': 'Writes fantasy that asks: what if the act of imagination had physical consequences? Their work blends cartography, linguistics, and world-building.',
	'D. Nakamura': 'Cyberpunk and neo-noir author fascinated by faith, consciousness, and commerce in post-human cities. Debut novel forthcoming in print.',
}

/** Get author bio text. Returns a default if not found. */
export function getAuthorBio(name: string): string {
	return AUTHOR_BIOS[name] ?? 'An independent author publishing serialized fiction.'
}
