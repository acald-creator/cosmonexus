import { tokens } from '@cosmonexus/design-tokens/contract'
import { keyframes, style } from '@vanilla-extract/css'

export const tableWrapper = style({
	background: tokens.color.surface2,
	border: tokens.borderSubtle,
	borderRadius: tokens.radius.lg,
	overflow: 'hidden',
})

export const table = style({
	width: '100%',
	borderCollapse: 'collapse',
	'@media': {
		'(max-width: 767px)': {
			display: 'block',
		},
	},
})

export const thead = style({
	'@media': {
		'(max-width: 767px)': {
			display: 'none',
		},
	},
})

export const th = style({
	background: tokens.color.surface3,
	fontSize: tokens.fontSize.sm,
	fontWeight: tokens.fontWeight.semibold,
	color: tokens.color.text2,
	fontFamily: tokens.font.sans,
	textAlign: 'left',
	padding: `${tokens.space[3]} ${tokens.space[4]}`,
})

export const tbody = style({
	'@media': {
		'(max-width: 767px)': {
			display: 'block',
		},
	},
})

export const row = style({
	borderBottom: tokens.borderSubtle,
	transition: `background ${tokens.transition.fast} ${tokens.easing.out}`,
	':hover': {
		background: tokens.color.surface3,
	},
	':focus-visible': {
		outline: 'none',
		boxShadow: tokens.focusRing,
	},
	'@media': {
		'(max-width: 767px)': {
			display: 'block',
			padding: tokens.space[4],
			marginBottom: tokens.space[2],
			borderRadius: tokens.radius.md,
			border: tokens.borderSubtle,
			background: tokens.color.surface2,
		},
	},
})

export const rowClickable = style({
	cursor: 'pointer',
})

export const td = style({
	padding: `${tokens.space[3]} ${tokens.space[4]}`,
	fontSize: tokens.fontSize.base,
	fontFamily: tokens.font.sans,
	color: tokens.color.text1,
	'@media': {
		'(max-width: 767px)': {
			display: 'block',
			padding: `${tokens.space[1]} 0`,
		},
	},
})

export const cellLabel = style({
	display: 'none',
	'@media': {
		'(max-width: 767px)': {
			display: 'inline-block',
			fontWeight: tokens.fontWeight.semibold,
			fontSize: tokens.fontSize.sm,
			color: tokens.color.text2,
			marginRight: tokens.space[2],
		},
	},
})

// Skeleton loading styles
const shimmer = keyframes({
	'0%': { backgroundPosition: '-200% 0' },
	'100%': { backgroundPosition: '200% 0' },
})

export const skeletonRow = style({
	borderBottom: tokens.borderSubtle,
	'@media': {
		'(max-width: 767px)': {
			display: 'block',
			padding: tokens.space[4],
			marginBottom: tokens.space[2],
			borderRadius: tokens.radius.md,
			border: tokens.borderSubtle,
		},
	},
})

export const skeletonCell = style({
	padding: `${tokens.space[3]} ${tokens.space[4]}`,
	'@media': {
		'(max-width: 767px)': {
			display: 'block',
			padding: `${tokens.space[1]} 0`,
		},
	},
})

export const skeleton = style({
	height: '1rem',
	width: '75%',
	borderRadius: tokens.radius.sm,
	background: `linear-gradient(90deg, ${tokens.color.surface3} 25%, ${tokens.color.surface4} 50%, ${tokens.color.surface3} 75%)`,
	backgroundSize: '200% 100%',
	animation: `${shimmer} 1.5s infinite`,
})

// Empty state styles
export const emptyState = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: `${tokens.space[10]} ${tokens.space[4]}`,
	fontFamily: tokens.font.sans,
	fontSize: tokens.fontSize.base,
	color: tokens.color.text3,
})
