import { describe, it, expect } from 'vitest'
import { novelSchema } from '../schema'

describe('novelSchema', () => {
	it('has the expected node types', () => {
		const nodeNames = Object.keys(novelSchema.nodes)
		expect(nodeNames).toContain('doc')
		expect(nodeNames).toContain('paragraph')
		expect(nodeNames).toContain('heading')
		expect(nodeNames).toContain('blockquote')
		expect(nodeNames).toContain('scene_break')
		expect(nodeNames).toContain('ordered_list')
		expect(nodeNames).toContain('bullet_list')
		expect(nodeNames).toContain('list_item')
		expect(nodeNames).toContain('text')
		expect(nodeNames).toContain('hard_break')
	})

	it('has the expected mark types', () => {
		const markNames = Object.keys(novelSchema.marks)
		expect(markNames).toContain('bold')
		expect(markNames).toContain('italic')
		expect(markNames).toContain('underline')
		expect(markNames).toContain('strikethrough')
		expect(markNames).toContain('code')
		expect(markNames).toContain('link')
		expect(markNames).toContain('comment')
	})

	it('creates a valid empty doc', () => {
		const doc = novelSchema.node('doc', null, [
			novelSchema.node('paragraph'),
		])
		expect(doc.type.name).toBe('doc')
		expect(doc.childCount).toBe(1)
		expect(doc.firstChild?.type.name).toBe('paragraph')
	})

	it('creates a heading with level attribute', () => {
		const heading = novelSchema.node('heading', { level: 2 }, [
			novelSchema.text('Chapter Title'),
		])
		expect(heading.attrs.level).toBe(2)
		expect(heading.textContent).toBe('Chapter Title')
	})

	it('creates text with marks', () => {
		const bold = novelSchema.mark('bold')
		const text = novelSchema.text('bold text', [bold])
		expect(text.marks.length).toBe(1)
		expect(text.marks[0].type.name).toBe('bold')
	})

	it('creates a link mark with href', () => {
		const link = novelSchema.mark('link', { href: 'https://example.com' })
		expect(link.attrs.href).toBe('https://example.com')
	})

	it('creates a comment mark with note', () => {
		const comment = novelSchema.mark('comment', { note: 'Fix this later' })
		expect(comment.attrs.note).toBe('Fix this later')
	})

	it('serializes and deserializes a document', () => {
		const doc = novelSchema.node('doc', null, [
			novelSchema.node('heading', { level: 1 }, [
				novelSchema.text('Chapter 1'),
			]),
			novelSchema.node('paragraph', null, [
				novelSchema.text('The story begins...'),
			]),
			novelSchema.node('scene_break'),
			novelSchema.node('paragraph', null, [
				novelSchema.text('A new scene.'),
			]),
		])

		const json = doc.toJSON()
		const restored = novelSchema.nodeFromJSON(json)

		expect(restored.childCount).toBe(4)
		expect(restored.child(0).type.name).toBe('heading')
		expect(restored.child(0).textContent).toBe('Chapter 1')
		expect(restored.child(2).type.name).toBe('scene_break')
	})
})
