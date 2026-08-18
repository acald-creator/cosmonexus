import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import { card, cardTitle } from './Card.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	title?: string
	children: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ title, children, className, ...rest }, ref) => {
		return (
			<div ref={ref} className={className ? `${card} ${className}` : card} {...rest}>
				{title && <h3 className={cardTitle}>{title}</h3>}
				{children}
			</div>
		)
	},
)

Card.displayName = 'Card'
