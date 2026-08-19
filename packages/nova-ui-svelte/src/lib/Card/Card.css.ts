import { tokens } from '@cosmonexus/design-tokens/contract'
import { style } from '@vanilla-extract/css'

export const card = style({
	background: tokens.color.surface2,
	border: tokens.borderSubtle,
	borderRadius: tokens.radius.lg,
	padding: tokens.space[6],
})

export const cardTitle = style({
	margin: 0,
	marginBottom: tokens.space[4],
	fontSize: tokens.fontSize.lg,
	fontWeight: tokens.fontWeight.semibold,
	color: tokens.color.text1,
	fontFamily: tokens.font.sans,
})
