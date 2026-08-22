/**
 * Side-effect entry: load Cosmonexus CSS custom properties.
 *
 * `:root` gets the light token set. Import this once at app startup, then set
 * `data-theme="dark"` on `<html>` to apply the dark sheet.
 *
 * Bind the imports so CJS emit cannot drop them as unused requires.
 */
import tokensCss from '@cosmonexus/design-tokens/css'
import tokensDarkCss from '@cosmonexus/design-tokens/css/dark'

export const tokenSheets = [tokensCss, tokensDarkCss] as const
