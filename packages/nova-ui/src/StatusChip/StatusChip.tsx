import { statusChipRecipe } from './StatusChip.css'

export type RecordStatus = 'created' | 'accessed' | 'modified' | 'deleted'

export interface StatusChipProps {
	status: RecordStatus
	label?: string
	className?: string
}

/**
 * Displays a record status value as a colored pill chip.
 * Capitalizes the status value as default text if no label is provided.
 */
export function StatusChip({ status, label, className }: StatusChipProps) {
	const displayText = label ?? status.charAt(0).toUpperCase() + status.slice(1)
	const cls = statusChipRecipe({ status })

	return <span className={className ? `${cls} ${className}` : cls}>{displayText}</span>
}
