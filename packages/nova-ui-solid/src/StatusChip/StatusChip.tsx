import { statusChipRecipe } from './StatusChip.css'

export type RecordStatus = 'created' | 'accessed' | 'modified' | 'deleted'

export interface StatusChipProps {
	status: RecordStatus
	label?: string
}

/**
 * Displays a record status value as a colored pill chip.
 * Capitalizes the status value as default text if no label is provided.
 */
export function StatusChip(props: StatusChipProps) {
	const displayText = () =>
		props.label ?? props.status.charAt(0).toUpperCase() + props.status.slice(1)

	return <span class={statusChipRecipe({ status: props.status })}>{displayText()}</span>
}
