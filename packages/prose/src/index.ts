// Schema
export { novelSchema, type NovelSchema } from './schema'

// Editor
export { NovelEditor, type NovelEditorOptions } from './editor'

// Plugins
export {
	createNovelPlugins,
	novelInputRules,
	novelKeymap,
	wordCountPlugin,
	wordCountPluginKey,
	placeholderPlugin,
	placeholderPluginKey,
	type NovelPluginOptions,
	type WordCount,
} from './plugins'

// Re-export essential ProseMirror types for consumers
export { EditorState, type Transaction, Plugin, PluginKey } from 'prosemirror-state'
export { EditorView, type DirectEditorProps } from 'prosemirror-view'
export { Schema, Node as ProsemirrorNode, type Mark } from 'prosemirror-model'
