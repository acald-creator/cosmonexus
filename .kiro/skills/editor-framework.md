---
name: Cosmonexus Editor Framework
description: Architecture and patterns for @cosmonexus/cm and @cosmonexus/stellate editor packages
tags: [editor, codemirror, extensions, stellate]
inclusion: manual
---

## When to Apply

- Creating or modifying editor extensions in stellate
- Adding new CodeMirror language modes to cm
- Building editor features that integrate with the extension system
- Working on the Editor class lifecycle

## Architecture

```
@cosmonexus/cm (CodeMirror wrappers)
  ├── /core      → re-exports from codemirror
  ├── /state     → re-exports from @codemirror/state
  ├── /view      → re-exports from @codemirror/view
  ├── /language  → re-exports from @codemirror/language
  ├── /lint      → re-exports from @codemirror/lint
  └── /langpack  → re-exports from @codemirror/legacy-modes

@cosmonexus/stellate (Extension framework)
  ├── Editor           → wraps EditorView, high-level API
  ├── Extension<Opts>  → base class for plugins
  ├── ExtensionManager → registry for extensions
  └── EventEmitter<T>  → type-safe event system
```

## Key Classes

### Editor
- Wraps CodeMirror `EditorView`
- Provides: `getContent()`, `setContent(str)`, `destroy()`, `state`, `isDestroyed`
- Extends `EventEmitter<EditorEvents>` for lifecycle events
- Access storage per-extension via `extensionStorage`

### Extension<Options>
- Base class: subclass and override `extension()` to return CodeMirror extensions
- Has `type` ('language' | 'theme' | 'keymap' | 'plugin') and `name`
- Receives options from `ExtensionConfig.defaultOptions`

### ExtensionManager
- `register(extension)` — adds an extension
- `getAll()` — returns all registered extensions
- `getByName(name)` — lookup by name

### EventEmitter<T>
- Type-safe: `T` maps event names to handler signatures
- Methods: `on(event, listener)`, `off(event, listener)`, `emit(event, ...args)`

## Import Pattern

```typescript
// From consuming code:
import { EditorState } from '@cosmonexus/cm/state'
import { EditorView } from '@cosmonexus/cm/view'
import { Editor, Extension, ExtensionManager } from '@cosmonexus/stellate'
```

## Creating an Extension

```typescript
import { Extension } from '@cosmonexus/stellate'
import type { Extension as CMExtension } from '@cosmonexus/cm/state'
import { keymap } from '@cosmonexus/cm/view'

interface MyOptions { keybinding: string }

class MyExtension extends Extension<MyOptions> {
  constructor() {
    super({ name: 'my-extension', defaultOptions: { keybinding: 'Ctrl-S' } })
    this.type = 'keymap'
  }

  extension(): CMExtension {
    return keymap.of([{ key: this.options.keybinding, run: () => true }])
  }
}
```

## References

- `packages/cm/src/` — sub-path source files
- `packages/stellate/src/Editor.ts` — Editor class
- `packages/stellate/src/Extension.ts` — Extension base class
- CodeMirror 6 docs: https://codemirror.net/docs/
