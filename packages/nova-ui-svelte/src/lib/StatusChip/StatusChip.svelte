<script lang="ts">
	import { statusChipRecipe } from './StatusChip.css'

	type RecordStatus = 'created' | 'accessed' | 'modified' | 'deleted'

	interface Props {
		status: RecordStatus
		label?: string
		class?: string
	}

	let { status, label, class: className }: Props = $props()

	let cls = $derived(statusChipRecipe({ status }))
	let displayText = $derived(label ?? status.charAt(0).toUpperCase() + status.slice(1))
</script>

<span class={className ? `${cls} ${className}` : cls}>
	{displayText}
</span>
