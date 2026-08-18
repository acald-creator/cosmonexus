import { darkTheme } from '@cosmonexus/design-tokens/themes/dark'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import '@cosmonexus/design-tokens/global'

const root = document.getElementById('root')!
root.classList.add(darkTheme)
createRoot(root).render(<App />)
