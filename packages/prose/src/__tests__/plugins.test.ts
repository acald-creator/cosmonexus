import { describe, it, expect } from 'vitest'
import { EditorState } from 'prosemirror-state'
import { novelSchema } from '../schema'
import { createNovelPlugins, wordCountPluginKey } from '../plugins'

function createState(content?: string) {
	const doc = content
		? novelSchema.node('doc', null, [
				novelSchema.node('paragraph', null, content ? [novelSchema.text(content)] : undefined),
		  ])
		: undefined

	return EditorState.create({
		schema: novelSchema,
		doc,
		plugins: createNovelPlugins(),
	})
}

describe('createNovelPlugins', () => {
	it('returns an array of plugins', () => {
		const plugins = createNovelPlugins()
		expect(Array.isArray(plugins)).toBe(true)
		expect(plugins.length).toBeGreaterThan(0)
	})

	it('creates a valid editor state', () => {
		const state = createState('Hello world')
		expect(state.doc.textContent).toBe('Hello world')
	})

	it('supports custom placeholder text', () => {
		const plugins = createNovelPlugins({ placeholder: 'Write here...' })
		expect(plugins.length).toBeGreaterThan(0)
	})
})

describe('wordCountPlugin', () => {
	it('counts words in document', () => {
		const state = createState('The quick brown fox jumps over the lazy dog')
		const count = wordCountPluginKey.getState(state)
		expect(count?.words).toBe(9)
	})

	it('counts characters', () => {
		const state = createState('Hello')
		const count = wordCountPluginKey.getState(state)
		expect(count?.characters).toBe(5)
	})

	it('returns zero for empty document', () => {
		const state = createState()
		const count = wordCountPluginKey.getState(state)
		expect(count?.words).toBe(0)
		expect(count?.characters).toBe(0)
	})

	it('updates count after transaction', () => {
		let state = createState('One two three')
		let count = wordCountPluginKey.getState(state)
		expect(count?.words).toBe(3)

		// Insert text via transaction
		const tr = state.tr.insertText(' four five', state.doc.content.size - 1)
		state = state.apply(tr)
		count = wordCountPluginKey.getState(state)
		expect(count?.words).toBe(5)
	})
})
