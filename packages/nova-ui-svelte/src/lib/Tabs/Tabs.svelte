<script lang="ts">
	import * as styles from './Tabs.css'
	import type { Snippet } from 'svelte'

	interface Tab {
		id: string
		label: string
	}

	interface Props {
		tabs: Tab[]
		active: string
		onchange?: (id: string) => void
		class?: string
		children?: Snippet
	}

	let { tabs, active, onchange, class: className, children }: Props = $props()

	function handleClick(id: string) {
		onchange?.(id)
	}

	function handleKeydown(e: KeyboardEvent, index: number) {
		let nextIndex: number | undefined
		if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
		if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length

		if (nextIndex !== undefined) {
			e.preventDefault()
			const nextTab = tabs[nextIndex]
			onchange?.(nextTab.id)
			const el = e.currentTarget as HTMLElement
			const parent = el.parentElement
			const buttons = parent?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
			buttons?.[nextIndex]?.focus()
		}
	}
</script>

<div class={className}>
	<div class={styles.tabList} role="tablist">
		{#each tabs as tab, i}
			<button
				role="tab"
				id={`tab-${tab.id}`}
				aria-selected={active === tab.id}
				aria-controls={`panel-${tab.id}`}
				tabindex={active === tab.id ? 0 : -1}
				class={active === tab.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
				onclick={() => handleClick(tab.id)}
				onkeydown={(e) => handleKeydown(e, i)}
			>
				{tab.label}
			</button>
		{/each}
	</div>
	{#if children}
		<div
			class={styles.panel}
			role="tabpanel"
			id={`panel-${active}`}
			aria-labelledby={`tab-${active}`}
		>
			{@render children()}
		</div>
	{/if}
</div>
