import { keymap } from 'prosemirror-keymap'
import { history, undo, redo } from 'prosemirror-history'
import { baseKeymap, toggleMark, setBlockType, wrapIn } from 'prosemirror-commands'
import {
	inputRules,
	wrappingInputRule,
	textblockTypeInputRule,
	smartQuotes,
	emDash,
	ellipsis,
} from 'prosemirror-inputrules'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { Schema } from 'prosemirror-model'
import { wrapInList, splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list'
import { novelSchema } from './schema'

// === Input Rules ===

/**
 * Creates input rules for novel writing:
 * - Smart quotes ("" '' — → –)
 * - Headings via markdown-style `# `, `## `, `### `
 * - Block quotes via `> `
 * - Bullet lists via `- ` or `* `
 * - Ordered lists via `1. `
 * - Scene break via `---`
 */
export function novelInputRules(schema: Schema) {
	const rules = [...smartQuotes, ellipsis, emDash]

	// # Heading 1
	if (schema.nodes.heading) {
		rules.push(
			textblockTypeInputRule(/^(#{1,3})\s$/, schema.nodes.heading, (match) => ({
				level: match[1].length,
			})),
		)
	}

	// > Block quote
	if (schema.nodes.blockquote) {
		rules.push(wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote))
	}

	// - or * for bullet list
	if (schema.nodes.bullet_list) {
		rules.push(wrappingInputRule(/^\s*[-*]\s$/, schema.nodes.bullet_list))
	}

	// 1. for ordered list
	if (schema.nodes.ordered_list) {
		rules.push(
			wrappingInputRule(/^\s*(\d+)\.\s$/, schema.nodes.ordered_list, (match) => ({
				order: Number(match[1]),
			}), (match, node) => node.childCount + node.attrs.order === Number(match[1])),
		)
	}

	return inputRules({ rules })
}

// === Keymap ===

/**
 * Key bindings for novel writing:
 * - Mod-b: bold
 * - Mod-i: italic
 * - Mod-u: underline
 * - Mod-z/y: undo/redo
 * - Enter in list: split list item
 * - Tab/Shift-Tab: indent/outdent list
 * - Shift-Mod-7: ordered list
 * - Shift-Mod-8: bullet list
 */
export function novelKeymap(schema: Schema) {
	const bindings: Record<string, any> = {}

	// Formatting
	if (schema.marks.bold) {
		bindings['Mod-b'] = toggleMark(schema.marks.bold)
	}
	if (schema.marks.italic) {
		bindings['Mod-i'] = toggleMark(schema.marks.italic)
	}
	if (schema.marks.underline) {
		bindings['Mod-u'] = toggleMark(schema.marks.underline)
	}
	if (schema.marks.strikethrough) {
		bindings['Mod-Shift-x'] = toggleMark(schema.marks.strikethrough)
	}
	if (schema.marks.code) {
		bindings['Mod-e'] = toggleMark(schema.marks.code)
	}

	// History
	bindings['Mod-z'] = undo
	bindings['Mod-y'] = redo
	bindings['Mod-Shift-z'] = redo

	// Headings
	if (schema.nodes.heading) {
		bindings['Mod-Alt-1'] = setBlockType(schema.nodes.heading, { level: 1 })
		bindings['Mod-Alt-2'] = setBlockType(schema.nodes.heading, { level: 2 })
		bindings['Mod-Alt-3'] = setBlockType(schema.nodes.heading, { level: 3 })
		bindings['Mod-Alt-0'] = setBlockType(schema.nodes.paragraph)
	}

	// Block quote
	if (schema.nodes.blockquote) {
		bindings['Mod-Shift-b'] = wrapIn(schema.nodes.blockquote)
	}

	// Lists
	if (schema.nodes.bullet_list) {
		bindings['Mod-Shift-8'] = wrapInList(schema.nodes.bullet_list)
	}
	if (schema.nodes.ordered_list) {
		bindings['Mod-Shift-7'] = wrapInList(schema.nodes.ordered_list)
	}
	if (schema.nodes.list_item) {
		bindings['Enter'] = splitListItem(schema.nodes.list_item)
		bindings['Tab'] = sinkListItem(schema.nodes.list_item)
		bindings['Shift-Tab'] = liftListItem(schema.nodes.list_item)
	}

	return keymap(bindings)
}

// === Word Count Plugin ===

export const wordCountPluginKey = new PluginKey<{ words: number; characters: number }>('wordCount')

export type WordCount = {
	words: number
	characters: number
}

/**
 * Plugin that tracks word and character counts.
 * Access via `wordCountPluginKey.getState(editorState)`.
 */
export function wordCountPlugin() {
	function count(doc: any): WordCount {
		let text = ''
		doc.descendants((node: any) => {
			if (node.isText) {
				text += node.text
			} else if (node.isBlock && text.length > 0) {
				text += ' '
			}
		})
		text = text.trim()
		const words = text.length === 0 ? 0 : text.split(/\s+/).length
		return { words, characters: text.length }
	}

	return new Plugin({
		key: wordCountPluginKey,
		state: {
			init(_, state) {
				return count(state.doc)
			},
			apply(tr, value) {
				if (tr.docChanged) {
					return count(tr.doc)
				}
				return value
			},
		},
	})
}

// === Placeholder Plugin ===

export const placeholderPluginKey = new PluginKey('placeholder')

/**
 * Shows placeholder text when the document is empty.
 */
export function placeholderPlugin(text: string) {
	return new Plugin({
		key: placeholderPluginKey,
		props: {
			decorations(state) {
				const { doc } = state
				if (doc.childCount === 1 && doc.firstChild?.isTextblock && doc.firstChild.content.size === 0) {
					const { Decoration, DecorationSet } = require('prosemirror-view')
					const placeholder = Decoration.node(0, doc.firstChild.nodeSize, {
						class: 'novel-placeholder',
						'data-placeholder': text,
					})
					return DecorationSet.create(doc, [placeholder])
				}
				return null
			},
		},
	})
}

// === Build all plugins ===

export type NovelPluginOptions = {
	/** Placeholder text shown in empty document. */
	placeholder?: string
	/** Whether to enable smart typography (quotes, em dash, ellipsis). */
	smartTypography?: boolean
}

/**
 * Returns the full set of plugins for the novel editor.
 */
export function createNovelPlugins(options: NovelPluginOptions = {}) {
	const { placeholder = 'Start writing...', smartTypography = true } = options

	return [
		novelInputRules(novelSchema),
		novelKeymap(novelSchema),
		keymap(baseKeymap),
		history(),
		wordCountPlugin(),
		placeholderPlugin(placeholder),
	]
}
