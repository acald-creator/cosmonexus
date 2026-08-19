<script lang="ts">
	import { Button, Input, Alert, StatusChip, Card, Pagination, DataTable, Skeleton } from '@cosmonexus/nova-ui-svelte'
	import Header from '$lib/components/Header.svelte'

	let currentPage = $state(1)
	let inputValue = $state('')
	let loading = $state(false)

	function handlePageChange(page: number) {
		currentPage = page
	}

	function simulateLoading() {
		loading = true
		setTimeout(() => { loading = false }, 2000)
	}

	const tableColumns = [
		{ key: 'title', label: 'Title' },
		{ key: 'status', label: 'Status' },
		{ key: 'words', label: 'Words' },
	]

	const tableData = [
		{ title: 'The Beginning', status: 'final', words: '4,200' },
		{ title: 'Rising Action', status: 'draft', words: '3,800' },
		{ title: 'The Crisis', status: 'revision', words: '2,847' },
	]
</script>

<Header variant="reader" />

<main class="components-page">
	<h1>Component Library</h1>
	<p class="subtitle">@cosmonexus/nova-ui-svelte — all 8 components with design tokens</p>

	<section class="section">
		<h2>Button</h2>
		<div class="demo-row">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="primary" size="small">Small</Button>
			<Button variant="primary" loading={true}>Loading</Button>
			<Button variant="primary" disabled={true}>Disabled</Button>
		</div>
	</section>

	<section class="section">
		<h2>Input</h2>
		<div class="demo-col">
			<Input label="Novel Title" placeholder="Enter your novel title..." bind:value={inputValue} />
			<Input label="Email" error="This field is required" placeholder="author@example.com" />
		</div>
	</section>

	<section class="section">
		<h2>Alert</h2>
		<div class="demo-col">
			<Alert variant="success">Chapter published successfully!</Alert>
			<Alert variant="error">Failed to save. Please try again.</Alert>
			<Alert variant="warning">You have unsaved changes.</Alert>
		</div>
	</section>

	<section class="section">
		<h2>StatusChip</h2>
		<div class="demo-row">
			<StatusChip status="created" />
			<StatusChip status="accessed" />
			<StatusChip status="modified" />
			<StatusChip status="deleted" />
			<StatusChip status="created" label="Published" />
		</div>
	</section>

	<section class="section">
		<h2>Card</h2>
		<div class="demo-row">
			<Card title="Chapter Stats">
				<p>2,847 words written today. Keep going!</p>
			</Card>
			<Card>
				<p>A card without a title — just content.</p>
			</Card>
		</div>
	</section>

	<section class="section">
		<h2>Pagination</h2>
		<Pagination currentPage={currentPage} totalPages={12} onPageChange={handlePageChange} />
		<p class="demo-note">Current page: {currentPage}</p>
	</section>

	<section class="section">
		<h2>DataTable</h2>
		<Button variant="secondary" size="small" onclick={simulateLoading}>Toggle Loading</Button>
		<div class="demo-table">
			<DataTable columns={tableColumns} data={tableData} loading={loading} onRowClick={(row) => alert(`Clicked: ${row.title}`)} />
		</div>
	</section>

	<section class="section">
		<h2>Skeleton</h2>
		<div class="demo-col">
			<Skeleton variant="text" />
			<Skeleton variant="text" width="50%" />
			<Skeleton variant="row" />
		</div>
	</section>
</main>

<style>
	.components-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 800;
		margin-bottom: 0.25rem;
	}

	.subtitle {
		color: var(--muted);
		margin-bottom: 2rem;
	}

	.section {
		margin-bottom: 3rem;
	}

	.section h2 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--primary);
	}

	.demo-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.demo-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
	}

	.demo-note {
		margin-top: 0.5rem;
		font-size: 0.8rem;
		color: var(--muted);
		font-family: var(--font-mono);
	}

	.demo-table {
		margin-top: 1rem;
	}
</style>
