import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { NovelEditor } from '../editor'

// Setup DOM for ProseMirror
let dom: JSDOM
let container: HTMLElement

beforeEach(() => {
	dom = new JSDOM('<!DOCTYPE html><html><body><div id="editor"></div></body></html>')
	global.document = dom.window.document as any
	global.window = dom.window as any
	global.HTMLElement = dom.window.HTMLElement as any
	global.Element = dom.window.Element as any
	global.Node = dom.window.Node as any
	global.navigator = dom.window.navigator as any
	container = dom.window.document.getElementById('editor')!
})

afterEach(() => {
	dom.window.close()
})

describe('NovelEditor', () => {
	it('creates an editor instance', () => {
		const editor = new NovelEditor()
		expect(editor).toBeInstanceOf(NovelEditor)
		expect(editor.isDestroyed).toBe(true) // not mounted yet
	})

	it('mounts to a DOM element', () => {
		const editor = new NovelEditor()
		editor.mount(container)
		expect(editor.isDestroyed).toBe(false)
		expect(editor.view).not.toBeNull()
		editor.destroy()
	})

	it('destroys cleanly', () => {
		const editor = new NovelEditor()
		editor.mount(container)
		editor.destroy()
		expect(editor.isDestroyed).toBe(true)
		expect(editor.view).toBeNull()
	})

	it('returns empty text from unmounted editor', () => {
		const editor = new NovelEditor()
		expect(editor.getText()).toBe('')
		expect(editor.getJSON()).toEqual({})
	})

	it('mounts with initial content', () => {
		const content = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'Hello world' }],
				},
			],
		}

		const editor = new NovelEditor({ content })
		editor.mount(container)
		expect(editor.getText()).toBe('Hello world')
		editor.destroy()
	})

	it('clears content', () => {
		const content = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'Some content' }],
				},
			],
		}

		const editor = new NovelEditor({ content })
		editor.mount(container)
		editor.clear()
		expect(editor.getText()).toBe('')
		editor.destroy()
	})

	it('getWordCount returns counts', () => {
		const content = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'One two three' }],
				},
			],
		}

		const editor = new NovelEditor({ content })
		editor.mount(container)
		const count = editor.getWordCount()
		expect(count.words).toBe(3)
		expect(count.characters).toBe(13)
		editor.destroy()
	})

	it('getJSON returns serializable document', () => {
		const content = {
			type: 'doc',
			content: [
				{
					type: 'heading',
					attrs: { level: 1 },
					content: [{ type: 'text', text: 'Title' }],
				},
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'Body text' }],
				},
			],
		}

		const editor = new NovelEditor({ content })
		editor.mount(container)
		const json = editor.getJSON()
		expect(json.type).toBe('doc')
		expect((json as any).content).toHaveLength(2)
		expect((json as any).content[0].type).toBe('heading')
		editor.destroy()
	})

	it('fires onUpdate callback', () => {
		let updateCount = 0
		const editor = new NovelEditor({
			onUpdate: () => { updateCount++ },
		})
		editor.mount(container)

		// Simulate a doc change via transaction
		const { state, dispatch } = editor.view!
		const tr = state.tr.insertText('Hello')
		dispatch(tr)

		expect(updateCount).toBe(1)
		editor.destroy()
	})
})
