import {
	Alert,
	Button,
	Card,
	DataTable,
	Input,
	Pagination,
	Skeleton,
	StatusChip,
} from '@cosmonexus/nova-ui'
import type { Column } from '@cosmonexus/nova-ui'
import { useState } from 'react'

interface SampleRow extends Record<string, unknown> {
	id: string
	name: string
	status: string
	date: string
}

const sampleColumns: Column<SampleRow>[] = [
	{ key: 'id', label: 'ID' },
	{ key: 'name', label: 'Name' },
	{ key: 'status', label: 'Status' },
	{ key: 'date', label: 'Date' },
]

const sampleData: SampleRow[] = [
	{ id: 'REC-001', name: 'Annual Compliance Report', status: 'Active', date: '2024-01-15' },
	{ id: 'REC-002', name: 'Security Audit Q4', status: 'Pending', date: '2024-02-20' },
	{ id: 'REC-003', name: 'Data Retention Policy', status: 'Archived', date: '2023-11-08' },
]

const containerStyle: React.CSSProperties = {
	maxWidth: '960px',
	margin: '0 auto',
	padding: '2rem',
}

const sectionStyle: React.CSSProperties = {
	marginBottom: '3rem',
}

const rowStyle: React.CSSProperties = {
	display: 'flex',
	gap: '0.75rem',
	flexWrap: 'wrap',
	alignItems: 'center',
	marginBottom: '1rem',
}

const headingStyle: React.CSSProperties = {
	marginBottom: '1rem',
	fontSize: '1.25rem',
}

export function App() {
	const [currentPage, setCurrentPage] = useState(1)
	const [tableLoading, setTableLoading] = useState(false)

	return (
		<div style={containerStyle}>
			<h1 style={{ marginBottom: '2rem' }}>Nova UI Playground</h1>

			{/* Buttons */}
			<section style={sectionStyle}>
				<h2 style={headingStyle}>Button</h2>
				<div style={rowStyle}>
					<Button variant="primary">Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="primary" size="small">
						Small Primary
					</Button>
					<Button variant="secondary" size="small">
						Small Secondary
					</Button>
				</div>
				<div style={rowStyle}>
					<Button variant="primary" disabled>
						Disabled
					</Button>
					<Button variant="primary" loading>
						Loading
					</Button>
					<Button variant="primary" fullWidth>
						Full Width
					</Button>
				</div>
			</section>

			{/* Input */}
			<section style={sectionStyle}>
				<h2 style={headingStyle}>Input</h2>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '320px' }}>
					<Input label="Default Input" placeholder="Type something..." />
					<Input label="With Error" placeholder="Invalid value" error="This field is required" />
					<Input label="Disabled" placeholder="Cannot edit" disabled />
				</div>
			</section>

			{/* Alert */}
			<section style={sectionStyle}>
				<h2 style={headingStyle}>Alert</h2>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
					<Alert variant="success">Operation completed successfully.</Alert>
					<Alert variant="error">Something went wrong. Please try again.</Alert>
					<Alert variant="warning">This action cannot be undone.</Alert>
				</div>
			</section>

			{/* StatusChip */}
			<section style={sectionStyle}>
				<h2 style={headingStyle}>StatusChip</h2>
				<div style={rowStyle}>
					<StatusChip status="created" />
					<StatusChip status="accessed" />
					<StatusChip status="modified" />
					<StatusChip status="deleted" />
				</div>
			</section>

			{/* Pagination */}
			<section style={sectionStyle}>
				<h2 style={headingStyle}>Pagination</h2>
				<Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
				<p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
					Current page: {currentPage}
				</p>
			</section>

			{/* Card */}
			<section style={sectionStyle}>
				<h2 style={headingStyle}>Card</h2>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
					<Card title="Simple Card">
						<p>This is a card with a title and basic content.</p>
					</Card>
					<Card title="Another Card">
						<p>Cards can hold any content including other components.</p>
						<div style={{ marginTop: '0.75rem' }}>
							<Button variant="secondary" size="small">
								Action
							</Button>
						</div>
					</Card>
				</div>
			</section>

			{/* DataTable */}
			<section style={sectionStyle}>
				<h2 style={headingStyle}>DataTable</h2>
				<div style={{ marginBottom: '0.75rem' }}>
					<Button variant="secondary" size="small" onClick={() => setTableLoading((prev) => !prev)}>
						{tableLoading ? 'Show Data' : 'Toggle Loading'}
					</Button>
				</div>
				<DataTable
					columns={sampleColumns}
					data={tableLoading ? [] : sampleData}
					loading={tableLoading}
					onRowClick={(row) => alert(`Clicked: ${row.name}`)}
				/>
			</section>

			{/* Skeleton */}
			<section style={sectionStyle}>
				<h2 style={headingStyle}>Skeleton</h2>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
					<Skeleton variant="text" />
					<Skeleton variant="text" width="60%" />
					<Skeleton variant="row" />
					<Skeleton variant="row" height="4rem" />
				</div>
			</section>
		</div>
	)
}
