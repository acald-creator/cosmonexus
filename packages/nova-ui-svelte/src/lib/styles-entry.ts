// This entry point is used by the Vite library build to process all
// vanilla-extract .css.ts files and produce a compiled CSS bundle.
// It includes the theme (which defines CSS variable values) alongside
// the component styles (which reference those variables).

// Theme — defines all CSS variable values (must come first)
import '../../../design-tokens/src/contract.css.ts'
import '../../../design-tokens/src/themes/dark.css.ts'
import '../../../design-tokens/src/themes/light.css.ts'

// Component styles
export { buttonRecipe } from './Button/Button.css'
export { alertRecipe } from './Alert/Alert.css'
export { badgeRecipe } from './Badge/Badge.css'
export { statusChipRecipe } from './StatusChip/StatusChip.css'
export { skeletonRecipe } from './Skeleton/Skeleton.css'
export { toastRecipe } from './Toast/Toast.css'
export * as inputStyles from './Input/Input.css'
export * as cardStyles from './Card/Card.css'
export * as paginationStyles from './Pagination/Pagination.css'
export * as dataTableStyles from './DataTable/DataTable.css'
export * as checkboxStyles from './Checkbox/Checkbox.css'
export * as selectStyles from './Select/Select.css'
export * as tabsStyles from './Tabs/Tabs.css'
export * as textareaStyles from './Textarea/Textarea.css'
export * as toastStyles from './Toast/Toast.css'

// Re-export theme class names so consumers can apply them
export { darkTheme } from '../../../design-tokens/src/themes/dark.css.ts'
export { lightTheme } from '../../../design-tokens/src/themes/light.css.ts'
