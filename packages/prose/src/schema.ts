import { Schema, type NodeSpec, type MarkSpec } from 'prosemirror-model'

/**
 * Node specifications for a novel document structure.
 */
const nodes: Record<string, NodeSpec> = {
	/** Top-level document node containing chapters or blocks. */
	doc: {
		content: 'block+',
	},

	/** A paragraph of prose — the default text container. */
	paragraph: {
		content: 'inline*',
		group: 'block',
		parseDOM: [{ tag: 'p' }],
		toDOM() {
			return ['p', 0]
		},
	},

	/** Headings for chapter titles and section breaks (levels 1–3). */
	heading: {
		attrs: { level: { default: 1, validate: 'number' } },
		content: 'inline*',
		group: 'block',
		defining: true,
		parseDOM: [
			{ tag: 'h1', attrs: { level: 1 } },
			{ tag: 'h2', attrs: { level: 2 } },
			{ tag: 'h3', attrs: { level: 3 } },
		],
		toDOM(node) {
			return [`h${node.attrs.level}`, 0]
		},
	},

	/** Block quote — for dialogue, epigraphs, or quoted passages. */
	blockquote: {
		content: 'block+',
		group: 'block',
		defining: true,
		parseDOM: [{ tag: 'blockquote' }],
		toDOM() {
			return ['blockquote', 0]
		},
	},

	/** Horizontal rule — scene break / section divider. */
	scene_break: {
		group: 'block',
		parseDOM: [{ tag: 'hr' }],
		toDOM() {
			return ['hr']
		},
	},

	/** Ordered list. */
	ordered_list: {
		content: 'list_item+',
		group: 'block',
		attrs: { order: { default: 1, validate: 'number' } },
		parseDOM: [
			{
				tag: 'ol',
				getAttrs(dom) {
					return {
						order: (dom as HTMLElement).hasAttribute('start')
							? Number((dom as HTMLElement).getAttribute('start'))
							: 1,
					}
				},
			},
		],
		toDOM(node) {
			return node.attrs.order === 1 ? ['ol', 0] : ['ol', { start: node.attrs.order }, 0]
		},
	},

	/** Bullet list. */
	bullet_list: {
		content: 'list_item+',
		group: 'block',
		parseDOM: [{ tag: 'ul' }],
		toDOM() {
			return ['ul', 0]
		},
	},

	/** List item. */
	list_item: {
		content: 'paragraph block*',
		parseDOM: [{ tag: 'li' }],
		toDOM() {
			return ['li', 0]
		},
	},

	/** Inline text node. */
	text: {
		group: 'inline',
	},

	/** Hard line break within a paragraph. */
	hard_break: {
		inline: true,
		group: 'inline',
		selectable: false,
		parseDOM: [{ tag: 'br' }],
		toDOM() {
			return ['br']
		},
	},
}

/**
 * Mark specifications for inline formatting.
 */
const marks: Record<string, MarkSpec> = {
	/** Bold / strong emphasis. */
	bold: {
		parseDOM: [
			{ tag: 'strong' },
			{ tag: 'b', getAttrs: (node) => (node as HTMLElement).style.fontWeight !== 'normal' && null },
			{
				style: 'font-weight=400',
				clearMark: (m) => m.type.name === 'bold',
			},
			{ style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null },
		],
		toDOM() {
			return ['strong', 0]
		},
	},

	/** Italic / emphasis. */
	italic: {
		parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
		toDOM() {
			return ['em', 0]
		},
	},

	/** Underline — sometimes used for emphasis in manuscripts. */
	underline: {
		parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
		toDOM() {
			return ['u', 0]
		},
	},

	/** Strikethrough — for revision/editing marks. */
	strikethrough: {
		parseDOM: [{ tag: 's' }, { tag: 'del' }, { style: 'text-decoration=line-through' }],
		toDOM() {
			return ['s', 0]
		},
	},

	/** Inline code — for technical notes or annotations in manuscripts. */
	code: {
		parseDOM: [{ tag: 'code' }],
		toDOM() {
			return ['code', 0]
		},
	},

	/** Hyperlink. */
	link: {
		attrs: {
			href: { validate: 'string' },
			title: { default: null, validate: 'string|null' },
		},
		inclusive: false,
		parseDOM: [
			{
				tag: 'a[href]',
				getAttrs(dom) {
					return {
						href: (dom as HTMLElement).getAttribute('href'),
						title: (dom as HTMLElement).getAttribute('title'),
					}
				},
			},
		],
		toDOM(node) {
			const { href, title } = node.attrs
			return ['a', { href, title, rel: 'noopener noreferrer' }, 0]
		},
	},

	/** Author comment/annotation — inline note that doesn't appear in final output. */
	comment: {
		attrs: {
			note: { default: '', validate: 'string' },
		},
		inclusive: false,
		parseDOM: [
			{
				tag: 'span[data-comment]',
				getAttrs(dom) {
					return { note: (dom as HTMLElement).getAttribute('data-comment') ?? '' }
				},
			},
		],
		toDOM(node) {
			return ['span', { class: 'novel-comment', 'data-comment': node.attrs.note }, 0]
		},
	},
}

/**
 * The novel document schema.
 * Supports chapters (via headings), prose paragraphs, block quotes for dialogue,
 * scene breaks, lists, and rich inline formatting including author comments.
 */
export const novelSchema = new Schema({ nodes, marks })

export type NovelSchema = typeof novelSchema
