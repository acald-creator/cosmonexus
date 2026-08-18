import { darkTheme } from '@cosmonexus/design-tokens/themes/dark'
import '@cosmonexus/design-tokens/global'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// Apply theme to html element so body and all descendants inherit the variables
document.documentElement.classList.add(darkTheme)

const root = document.getElementById('root')!
createRoot(root).render(<App />)
