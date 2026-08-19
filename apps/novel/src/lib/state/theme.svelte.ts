/**
 * Theme state — manages light/dark mode.
 * Persists preference to localStorage.
 */

let current = $state<'light' | 'dark'>('dark')

export function getTheme() {
	return current
}

export function setTheme(theme: 'light' | 'dark') {
	current = theme
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
	}
}

export function toggleTheme() {
	setTheme(current === 'dark' ? 'light' : 'dark')
}

export function initTheme() {
	if (typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
		setTheme(saved ?? 'dark')
	}
}
