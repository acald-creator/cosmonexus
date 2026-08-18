import { tokens } from '@cosmonexus/design-tokens/contract'
import { style } from '@vanilla-extract/css'

export const card = style({
	background: tokens.color.surface2,
	border: tokens.borderSubtle,
	borderRadius: tokens.radius.lg,
	padding: tokens.space[5],
})

export const cardTitle = style({
	fontSize: tokens.fontSize.lg,
	fontWeight: tokens.fontWeight.semibold,
	fontFamily: tokens.font.sans,
	color: tokens.color.text1,
	marginBottom: tokens.space[3],
})
