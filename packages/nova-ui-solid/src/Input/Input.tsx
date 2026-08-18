import { type JSX, Show, createUniqueId, splitProps } from 'solid-js'
import * as styles from './Input.css'

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
}

export function Input(props: InputProps) {
	const [local, inputAttrs] = splitProps(props, ['label', 'error', 'id', 'class'])
	const id = () => local.id ?? createUniqueId()

	return (
		<div class={styles.wrapper}>
			<Show when={local.label}>
				<label class={styles.label} for={id()}>
					{local.label}
				</label>
			</Show>
			<input
				id={id()}
				class={`${styles.input}${local.error ? ` ${styles.inputError}` : ''}${local.class ? ` ${local.class}` : ''}`}
				aria-invalid={local.error ? true : undefined}
				aria-describedby={local.error ? `${id()}-error` : undefined}
				{...inputAttrs}
			/>
			<Show when={local.error}>
				<span id={`${id()}-error`} class={styles.errorMessage} role="alert">
					{local.error}
				</span>
			</Show>
		</div>
	)
}
