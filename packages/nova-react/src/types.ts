/**
 * UI/Component types for the Nova React system.
 * Originally from @cosmonexus/nova-types, moved here as the primary consumer.
 */

// === Utility Types ===

/** Generic string-keyed record. */
export type Dict<T = unknown> = Record<string, T>

// === Direction & Layout ===

export type Direction = 'ltr' | 'rtl'

export type Orientation = 'horizontal' | 'vertical'

export type DirectionProperty = {
	dir?: Direction
}

// === Component Properties ===

export type CommonProperties = {
	id: string
	getRootNode?: () => ShadowRoot | Document | Node
}

export type RootProperties = {
	doc?: Document
	rootNode?: ShadowRoot
	pointerdownNode?: HTMLElement | undefined
}

/** Merges a context type T with root DOM properties. */
export type Context<T> = T & RootProperties

type PropTypesKeys =
	| 'button'
	| 'label'
	| 'input'
	| 'img'
	| 'output'
	| 'element'
	| 'select'
	| 'style'

export type PropTypes<T = Dict> = Record<PropTypesKeys, T>

// === Machine Types ===

export type MachineContextType = Record<string, unknown>

export type MachineStateType = Record<string, unknown>
