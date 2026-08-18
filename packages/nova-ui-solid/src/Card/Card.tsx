import { type JSX, splitProps } from 'solid-js'
import { card, cardTitle } from './Card.css'

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string
}

/**
 * Simple container card with optional title.
 */
export function Card(props: CardProps) {
	const [local, rest] = splitProps(props, ['title', 'children', 'class'])

	return (
		<div {...rest} class={local.class ? `${card} ${local.class}` : card}>
			{local.title && <h3 class={cardTitle}>{local.title}</h3>}
			{local.children}
		</div>
	)
}
