import { darkTheme } from '@cosmonexus/design-tokens/themes/dark'
import { lightTheme } from '@cosmonexus/design-tokens/themes/light'
import '@cosmonexus/design-tokens/global'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// Export theme classes for the toggle
export { darkTheme, lightTheme }

// Default to dark
document.documentElement.classList.add(darkTheme)

const root = document.getElementById('root')!
createRoot(root).render(<App />)
