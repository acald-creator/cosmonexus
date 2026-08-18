<script lang="ts">
	import { CodeEditor, fromObservable, fromSignal, getTheme } from '@cosmonexus/nova-svelte'
	import { createSignal } from '@cosmonexus/nova-store'
	import { BehaviorSubject } from 'rxjs'

	const theme = getTheme()

	// Demo: fromSignal - a counter backed by Nova signals
	const countSignal = createSignal(0)
	const count = fromSignal(countSignal)

	// Demo: fromObservable - an RxJS timer
	const ticker$ = new BehaviorSubject(0)
	const ticker = fromObservable(ticker$, 0)

	let tickInterval: ReturnType<typeof setInterval> | undefined
	$: {
		// Start ticking on mount (client-side only)
		if (typeof window !== 'undefined' && !tickInterval) {
			tickInterval = setInterval(() => {
				ticker$.next($ticker + 1)
			}, 1000)
		}
	}

	// Demo: CodeEditor
	let editorContent = `// Welcome to the Nova Svelte Playground!
// This editor is powered by @cosmonexus/nova-svelte + stellate + CodeMirror 6.

function greet(name: string): string {
  return \`Hello, \${name}! Welcome to Cosmonexus.\`
}

const result = greet('World')
console.log(result)
`

	let charCount = editorContent.length
	let lineCount = editorContent.split('\n').length

	function handleChange(event: CustomEvent<{ content: string }>) {
		editorContent = event.detail.content
		charCount = editorContent.length
		lineCount = editorContent.split('\n').length
	}

	function increment() {
		$count = $count + 1
	}

	function decrement() {
		$count = $count - 1
	}

	function resetCounter() {
		$count = 0
	}
</script>

<main>
	<header>
		<h1>Nova Svelte Playground</h1>
		<p class="subtitle">
			Demonstrating <code>@cosmonexus/nova-svelte</code> — reactive stores, signals, and the CodeMirror editor component.
		</p>
	</header>

	<section class="demos">
		<div class="card">
			<h2>CodeEditor</h2>
			<p class="description">A full CodeMirror 6 editor wrapped as a Svelte component via <code>stellate</code>.</p>
			<div class="editor-wrapper">
				<CodeEditor
					content={editorContent}
					on:change={handleChange}
					class="demo-editor"
				/>
			</div>
			<div class="editor-stats">
				<span>{lineCount} lines</span>
				<span>{charCount} characters</span>
			</div>
		</div>

		<div class="sidebar">
			<div class="card">
				<h2>fromSignal</h2>
				<p class="description">Nova reactive signal → Svelte writable store. Two-way bound.</p>
				<div class="counter">
					<button on:click={decrement} aria-label="Decrement">-</button>
					<span class="counter-value">{$count}</span>
					<button on:click={increment} aria-label="Increment">+</button>
				</div>
				<button class="reset-btn" on:click={resetCounter}>Reset</button>
			</div>

			<div class="card">
				<h2>fromObservable</h2>
				<p class="description">RxJS BehaviorSubject → Svelte readable store. Auto-subscribes.</p>
				<div class="ticker">
					<span class="ticker-label">Elapsed</span>
					<span class="ticker-value">{$ticker}s</span>
				</div>
			</div>

			<div class="card">
				<h2>Theme Context</h2>
				<p class="description">Theme set via <code>setTheme()</code> in layout, consumed with <code>getTheme()</code>.</p>
				<div class="color-swatches">
					{#each Object.entries($theme.colors ?? {}) as [name, color]}
						<div class="swatch">
							<div class="swatch-color" style:background-color={color}></div>
							<span class="swatch-name">{name}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #565f89;
		font-size: 1rem;
	}

	code {
		background: #24283b;
		padding: 0.15em 0.4em;
		border-radius: 4px;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.9em;
	}

	.demos {
		display: grid;
		grid-template-columns: 1fr 360px;
		gap: 1.5rem;
		align-items: start;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.card {
		background: #24283b;
		border: 1px solid #414868;
		border-radius: 12px;
		padding: 1.5rem;
	}

	.card h2 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #7aa2f7;
	}

	.description {
		color: #565f89;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.editor-wrapper {
		height: 320px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #414868;
	}

	.editor-stats {
		display: flex;
		gap: 1rem;
		margin-top: 0.75rem;
		font-size: 0.8rem;
		color: #565f89;
	}

	.counter {
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: center;
	}

	.counter button {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		border: 1px solid #414868;
		background: #1a1b26;
		color: #c0caf5;
		font-size: 1.2rem;
		cursor: pointer;
		transition: background 0.15s;
	}

	.counter button:hover {
		background: #414868;
	}

	.counter-value {
		font-size: 2rem;
		font-weight: 700;
		font-family: 'JetBrains Mono', monospace;
		min-width: 3ch;
		text-align: center;
	}

	.reset-btn {
		display: block;
		margin: 0.75rem auto 0;
		padding: 0.4rem 1rem;
		border-radius: 6px;
		border: 1px solid #414868;
		background: transparent;
		color: #565f89;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.reset-btn:hover {
		border-color: #7aa2f7;
		color: #7aa2f7;
	}

	.ticker {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: #1a1b26;
		border-radius: 8px;
	}

	.ticker-label {
		color: #565f89;
		font-size: 0.85rem;
	}

	.ticker-value {
		font-size: 1.5rem;
		font-weight: 700;
		font-family: 'JetBrains Mono', monospace;
		color: #7dcfff;
	}

	.color-swatches {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}

	.swatch {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.swatch-color {
		width: 20px;
		height: 20px;
		border-radius: 4px;
		border: 1px solid #414868;
	}

	.swatch-name {
		font-size: 0.75rem;
		color: #565f89;
		font-family: 'JetBrains Mono', monospace;
	}

	@media (max-width: 800px) {
		.demos {
			grid-template-columns: 1fr;
		}
	}
</style>
