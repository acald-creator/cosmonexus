<script lang="ts">
	interface Props {
		genres: string[]
		selected: string | null
		onSelect: (genre: string | null) => void
	}

	let { genres, selected, onSelect }: Props = $props()
</script>

<div class="genre-filter" role="group" aria-label="Filter by genre">
	<button
		class="chip"
		class:active={selected === null}
		aria-pressed={selected === null}
		onclick={() => onSelect(null)}
	>All</button>
	{#each genres as genre}
		<button
			class="chip"
			class:active={selected === genre}
			aria-pressed={selected === genre}
			onclick={() => onSelect(genre)}
		>{genre}</button>
	{/each}
</div>

<style>
	.genre-filter {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
	}

	.chip {
		padding: var(--spacing-1-5) var(--spacing-4);
		border-radius: var(--radius-full);
		border: 1px solid var(--border-light);
		background: transparent;
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		cursor: pointer;
		transition: border-color var(--duration-100) ease, color var(--duration-100) ease, background-color var(--duration-100) ease;
	}

	.chip:hover {
		border-color: var(--color-accent-main);
		color: var(--color-accent-main);
	}

	.chip:focus-visible {
		outline: 2px solid var(--color-accent-main);
		outline-offset: 2px;
	}

	.chip.active {
		background: var(--color-accent-main);
		border-color: var(--color-accent-main);
		color: var(--background-body);
	}
</style>
