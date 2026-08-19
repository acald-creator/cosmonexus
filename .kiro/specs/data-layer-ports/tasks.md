# Implementation Plan: Data Layer Ports/Adapters

## Overview

Refactor the novel app's data layer (`apps/novel/src/lib/data/`) from hardwired RxDB to a hexagonal ports/adapters architecture. Port interfaces define contracts, adapter implementations provide storage backends, and the public API becomes thin delegation. All work is TypeScript; existing consumers see zero breaking changes.

## Tasks

- [ ] 1. Define port interfaces
  - [ ] 1.1 Create `ports/novels.port.ts` with `NovelsPort` interface, `CreateNovelData`, and `UpdateNovelData` types
    - Define `init()`, `listNovels()`, `getNovel(id)`, `createNovel(data)`, `updateNovel(id, updates)`, `deleteNovel(id)`, `novels$()`, `novel$(id)` with exact signatures from design
    - Import domain types from `@cosmonexus/nova-types` only
    - No RxDB or adapter-specific imports
    - _Requirements: 1.1–1.8, 12.2, 12.4, 12.5_

  - [ ] 1.2 Create `ports/chapters.port.ts` with `ChaptersPort` interface, `CreateChapterData`, and `UpdateChapterData` types
    - Define `listChapters(novelId)`, `getChapterMeta(novelId, chapterId)`, `getChapterContent(novelId, chapterId)`, `createChapter(novelId, data)`, `saveChapterContent(...)`, `updateChapter(...)`, `deleteChapter(...)`, `reorderChapters(...)`, `chapters$(novelId)` with exact signatures from design
    - Import `ChapterMeta`, `ChapterStatus`, `DocumentJSON` from `@cosmonexus/nova-types`
    - _Requirements: 2.1–2.9, 12.2, 12.4, 12.5_

  - [ ] 1.3 Create `ports/progress.port.ts` with `ProgressPort` interface
    - Define `getProgress(novelId)`, `markChapterRead(novelId, chapterId)`, `progress$(novelId)` with exact signatures from design
    - Import `ReadingProgress` type from local definition (will be re-exported from `reading-progress.ts`)
    - _Requirements: 3.1–3.3, 12.2, 12.4, 12.5_

  - [ ] 1.4 Create `ports/index.ts` barrel with `DataPorts` type bundling all three ports, and re-exports of all port interfaces and input types
    - Export `DataPorts`, `NovelsPort`, `ChaptersPort`, `ProgressPort`, `CreateNovelData`, `UpdateNovelData`, `CreateChapterData`, `UpdateChapterData`
    - _Requirements: 6.7, 12.2_

- [ ] 2. Implement adapter registry
  - [ ] 2.1 Create `registry.ts` with `registerAdapter`, `setActiveAdapter`, `getAdapter`, `getInitPromise`
    - `AdapterFactory` type: `() => DataPorts`
    - Internal `Map<string, AdapterFactory>` for factories, track `activeAdapter`, `activeName`, `initPromise`
    - `setActiveAdapter` calls `factory()` then `adapter.novels.init()`, is idempotent for same name
    - `getAdapter` throws descriptive error when no adapter active
    - `setActiveAdapter` throws when name not registered, listing available adapters
    - _Requirements: 6.1–6.6_

- [ ] 3. Implement RxDB adapter
  - [ ] 3.1 Move `database.ts` → `adapters/rxdb/database.ts` and `schemas.ts` → `adapters/rxdb/schemas.ts`
    - Relocate files preserving existing logic
    - Update internal imports between them
    - Keep `getDatabase()` and `AppDatabase` exports intact from the new location
    - _Requirements: 4.2_

  - [ ] 3.2 Create `adapters/rxdb/rxdb-novels.ts` implementing `NovelsPort`
    - Class `RxDBNovelsAdapter implements NovelsPort`
    - `init()` creates database (via relocated `database.ts`), runs migration, seeds if empty (delegates to adapter-agnostic seed), primes internal cache via RxDB subscriptions
    - `listNovels()` / `getNovel(id)` read from primed cache (sync)
    - `createNovel`, `updateNovel`, `deleteNovel` use RxDB operations (existing logic from `novels.ts`)
    - `novels$()` / `novel$(id)` return observables from RxDB `.` subscriptions (existing logic from `reactive.ts`)
    - `deleteNovel` cascades to chapters (existing behavior)
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.6_

  - [ ] 3.3 Create `adapters/rxdb/rxdb-chapters.ts` implementing `ChaptersPort`
    - Class `RxDBChaptersAdapter implements ChaptersPort`
    - Port existing `chapters.ts` logic for all CRUD methods
    - `chapters$(novelId)` via RxDB subscription (existing logic from `reactive.ts`)
    - _Requirements: 4.1, 4.3, 4.4_

  - [ ] 3.4 Create `adapters/rxdb/rxdb-progress.ts` implementing `ProgressPort`
    - Class `RxDBProgressAdapter implements ProgressPort`
    - Port existing `reading-progress.ts` async logic for `getProgress`, `markChapterRead`
    - `progress$(novelId)` via RxDB subscription (existing logic from `reactive.ts`)
    - _Requirements: 4.1, 4.3, 4.4_

  - [ ] 3.5 Create `adapters/rxdb/index.ts` with `createRxDBAdapter()` factory returning `DataPorts`
    - Instantiate `RxDBNovelsAdapter`, `RxDBChaptersAdapter`, `RxDBProgressAdapter`
    - Return bundled `{ novels, chapters, progress }`
    - _Requirements: 4.1_

- [ ] 4. Implement memory adapter
  - [ ] 4.1 Create `adapters/memory/memory-novels.ts` implementing `NovelsPort`
    - Use `Map<string, StoredNovel>` for storage, `BehaviorSubject<NovelMeta[]>` for reactivity
    - `init()` optionally pre-loads data from config, emits initial state
    - All mutations synchronously update the BehaviorSubject after Map changes
    - `reset()` clears Map and resets BehaviorSubject to `[]`
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.7, 8.7_

  - [ ] 4.2 Create `adapters/memory/memory-chapters.ts` implementing `ChaptersPort`
    - Use `Map<string, StoredChapter>` for metadata, `Map<string, DocumentJSON>` for content
    - Use `Map<string, BehaviorSubject<ChapterMeta[]>>` for per-novel reactivity
    - Synchronous BehaviorSubject emission on every mutation
    - `reset()` clears all Maps and subjects
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 8.7_

  - [ ] 4.3 Create `adapters/memory/memory-progress.ts` implementing `ProgressPort`
    - Use `Map<string, ReadingProgress>` for storage
    - Use `Map<string, BehaviorSubject<ReadingProgress | null>>` for per-novel reactivity
    - Synchronous emission after mutations
    - `reset()` clears all state
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 8.7_

  - [ ] 4.4 Create `adapters/memory/index.ts` with `createMemoryAdapter(config?)` factory
    - Accept optional `MemoryAdapterConfig` with `initialData`
    - Wire cross-references (chapters adapter needs novel adapter for cascade checks)
    - Return `DataPorts & { reset(): void }` with reset method for test isolation
    - _Requirements: 5.6, 5.7_

- [ ] 5. Rewrite seed data to be adapter-agnostic
  - [ ] 5.1 Rewrite `seed.ts` to accept `DataPorts` parameter and use only port interface methods
    - Export `seedDatabase(ports: DataPorts): Promise<void>` 
    - Call `ports.novels.createNovel(...)` for each novel instead of `db.novels.bulkInsert`
    - Call `ports.chapters.createChapter(...)` then `ports.chapters.saveChapterContent(...)` for chapter content
    - Preserve all existing demo novel/chapter data and content
    - Keep legacy exports (`isSeeded`, `seed`) for backward compat
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 6. Rewrite public API to delegate through registry
  - [ ] 6.1 Rewrite `novels.ts` as thin delegator to `getAdapter().novels`
    - Keep identical function signatures: `listNovels`, `getNovel`, `createNovel`, `updateNovel`, `deleteNovel`, `getNovelWordCount`, `setNovelChapters`
    - Each function body calls `getAdapter().novels.methodName(...)`
    - `getNovelWordCount` and `setNovelChapters` remain local (they don't map to port methods)
    - Remove direct `getDatabase()` and `getNovelsCache()` imports
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ] 6.2 Rewrite `chapters.ts` as thin delegator to `getAdapter().chapters`
    - Keep identical function signatures: `listChapters`, `getChapterMeta`, `getChapterContent`, `createChapter`, `saveChapterContent`, `updateChapter`, `deleteChapter`, `reorderChapters`
    - Each function body calls `getAdapter().chapters.methodName(...)`
    - Remove direct `getDatabase()` and `getNovelsCache()` imports
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ] 6.3 Rewrite `reading-progress.ts` to delegate async operations to `getAdapter().progress`
    - Keep identical exports: `ReadingProgress` type, `getProgress`, `getProgressAsync`, `markChapterRead`, `getNextUnread`, `getSmartCTAState`
    - `getProgressAsync` delegates to `getAdapter().progress.getProgress(...)`
    - `markChapterRead` delegates to `getAdapter().progress.markChapterRead(...)`
    - `getNextUnread` and `getSmartCTAState` remain local pure functions (no port needed)
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ] 6.4 Rewrite `reactive.ts` to delegate observables to `getAdapter()` methods
    - `novels$()` → `getAdapter().novels.novels$()`
    - `novel$(id)` → `getAdapter().novels.novel$(id)`
    - `chapters$(novelId)` → `getAdapter().chapters.chapters$(novelId)`
    - `progress$(novelId)` → `getAdapter().progress.progress$(novelId)`
    - Keep mapping helpers (`toNovelMeta`, `toChapterMeta`, `toProgress`) exported for RxDB adapter internal use
    - _Requirements: 7.3_

  - [ ] 6.5 Rewrite `init.ts` to use registry-based initialization
    - `initDataLayer(adapterName?: string)` defaults to `'rxdb'`
    - Register built-in adapters (`rxdb`, optionally `memory`)
    - Call `setActiveAdapter(adapterName)` which triggers `init()` internally
    - Keep `getNovelsCache()` / `getChaptersCache()` delegating to active adapter's sync reads
    - Maintain idempotence flag
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 6.6 Update `index.ts` barrel exports to preserve the public API surface
    - Maintain all existing exports unchanged
    - Add exports for `DataPorts` type and registry functions for advanced consumers
    - Ensure `getDatabase` / `AppDatabase` still exported (now from `adapters/rxdb/database`)
    - _Requirements: 7.5_

- [ ] 7. Create REST adapter type skeleton
  - [ ] 7.1 Create `adapters/rest/types.ts` with REST API endpoint/response type definitions
    - Define `RestEndpoints` type covering novels list/get, chapters list/get/content, progress get/markRead
    - Use domain types from `@cosmonexus/nova-types`
    - _Requirements: 10.1, 10.2_

  - [ ] 7.2 Create `adapters/rest/index.ts` with type skeleton implementing ports as read-only
    - `NovelsPort` and `ChaptersPort` as read-only (write methods throw `Error('Not supported in read-only mode')`)
    - `ProgressPort` with full read-write capability (type-level only)
    - Export placeholder `createRestAdapter` factory (throws "not implemented" at runtime)
    - Ensure TypeScript compiles the interface conformance without errors
    - _Requirements: 10.3, 10.4, 10.5_

- [ ] 8. Checkpoint - Verify compilation and non-breaking API
  - Ensure all tests pass, ask the user if questions arise.
  - Run `tsc --noEmit` to verify all port/adapter/registry code compiles
  - Verify `index.ts` exports haven't changed (same public surface)

- [ ] 9. Write property-based and unit tests
  - [ ]* 9.1 Write property tests for novel CRUD round-trip (Property 1)
    - **Property 1: Novel CRUD Round-Trip**
    - Use `fast-check` arbitraries for novel creation data (title, author, genre, synopsis, targetWordCount)
    - Test against memory adapter: create → getNovel → verify field equality
    - Minimum 100 iterations
    - **Validates: Requirements 1.1, 1.2, 1.3, 7.2, 11.4**

  - [ ]* 9.2 Write property tests for chapter CRUD round-trip (Property 2) and content round-trip (Property 3)
    - **Property 2: Chapter CRUD Round-Trip**
    - **Property 3: Chapter Content Round-Trip**
    - Test create chapter → get chapter meta → verify fields
    - Test save content → get content → verify identical DocumentJSON and updated wordCount
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 7.2**

  - [ ]* 9.3 Write property tests for observable emission on mutation (Property 4)
    - **Property 4: Observable Emission on Mutation**
    - Subscribe to `novels$()` / `chapters$(novelId)` / `progress$(novelId)` before mutations
    - Verify observable emits updated state after each create/update/delete
    - Memory adapter emits synchronously (no timers needed)
    - **Validates: Requirements 8.1–8.7, 4.4, 5.4**

  - [ ]* 9.4 Write property tests for registry activation (Property 5) and initialization idempotence (Property 8)
    - **Property 5: Registry Activation Correctness**
    - **Property 8: Initialization Idempotence**
    - Test register → activate → getAdapter returns correct ports
    - Test unregistered name throws descriptive error
    - Test double-init produces same state as single init
    - **Validates: Requirements 6.1, 6.3, 6.5, 11.5**

  - [ ]* 9.5 Write property tests for memory adapter reset (Property 6) and chapter reorder (Property 9)
    - **Property 6: Memory Adapter Reset Clears State**
    - **Property 9: Chapter Reorder Preserves Set**
    - Test reset → all reads return empty
    - Test reorder with permutation → same chapters with correct order values
    - **Validates: Requirements 5.6, 2.8**

  - [ ]* 9.6 Write property test for seed consistency (Property 7) and delete cascade (Property 10)
    - **Property 7: Seed Consistency Across Adapters**
    - **Property 10: Delete Novel Cascades to Chapters**
    - Test seeding memory adapter produces expected novel/chapter titles
    - Test deleting a novel with chapters → listChapters returns [], getNovel returns null
    - **Validates: Requirements 9.3, 1.5, 4.3**

  - [ ]* 9.7 Write unit tests for public API delegation and RxDB integration
    - Test `novels.ts`, `chapters.ts`, `reading-progress.ts` delegate to active adapter
    - Test RxDB adapter initialization with `fake-indexeddb` (smoke test: init → seed → listNovels)
    - Test REST adapter write methods throw expected errors
    - **Validates: Requirements 7.2, 7.3, 4.3, 10.5**

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Run full Vitest suite for the novel app
  - Verify no regressions in existing functionality

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The RxDB adapter is existing code relocated and wrapped — minimal rewrite
- The memory adapter is entirely new code for test infrastructure
- Public API files (`novels.ts`, `chapters.ts`, `reading-progress.ts`, `reactive.ts`) become thin wrappers — identical signatures, different implementation
- `toNovelMeta`, `toChapterMeta`, `toProgress` mapping helpers stay exported from `reactive.ts` for the RxDB adapter's internal use

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4", "7.1"] },
    { "id": 2, "tasks": ["2.1", "3.1", "4.1", "4.2", "4.3", "7.2"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4", "4.4", "5.1"] },
    { "id": 4, "tasks": ["3.5", "6.1", "6.2", "6.3", "6.4"] },
    { "id": 5, "tasks": ["6.5", "6.6"] },
    { "id": 6, "tasks": ["9.1", "9.2", "9.3", "9.4", "9.5", "9.6", "9.7"] }
  ]
}
```
