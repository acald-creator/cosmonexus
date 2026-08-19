# Implementation Plan: RxDB Integration

## Overview

Replace the localStorage-based data layer in `apps/novel/src/lib/data/` with RxDB backed by Dexie.js (IndexedDB). The migration introduces typed collections, reactive queries via RxJS Observables, a sync API surface backed by an in-memory cache, one-time localStorage migration, and a replication contract stub. All existing consumers remain unchanged.

## Tasks

- [ ] 1. Install dependencies and set up project structure
  - [ ] 1.1 Install RxDB packages and test utilities
    - Install `rxdb` as a dependency in `apps/novel`
    - Install `fake-indexeddb` as a dev dependency for tests
    - Verify `rxjs` is already present; if not, install it
    - _Requirements: 1.1, 12.1_

  - [ ] 1.2 Create collection schemas and TypeScript types (`schemas.ts`)
    - Create `apps/novel/src/lib/data/schemas.ts`
    - Define `NovelDocType`, `ChapterDocType`, `ProgressDocType`, `AuthorDocType` types
    - Define `novelSchema`, `chapterSchema`, `progressSchema`, `authorSchema` with JSON Schema definitions
    - Include all indexes as specified in the design (genre, author, updatedAt for novels; novelId+order, novelId+status, status for chapters; novelId for progress; name for authors)
    - Export collection types (`NovelCollection`, `ChapterCollection`, `ProgressCollection`, `AuthorCollection`)
    - Export document types (`NovelDocument`, `ChapterDocument`, `ProgressDocument`, `AuthorDocument`)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4_

- [ ] 2. Implement database singleton and migration
  - [ ] 2.1 Create the database singleton module (`database.ts`)
    - Create `apps/novel/src/lib/data/database.ts`
    - Implement `getDatabase()` as a lazy singleton returning `Promise<AppDatabase>`
    - Use `getRxStorageDexie()` storage adapter
    - Add SSR guard (throw if `window` is undefined)
    - Register `RxDBMigrationSchemaPlugin`
    - Add all four collections with their schemas
    - Call `migrateFromLocalStorage(db)` during init
    - Call `seedIfEmpty(db)` after migration
    - Export `AppDatabase` type
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.1, 10.2, 10.3_

  - [ ] 2.2 Create the localStorage migration module (`migrate-localstorage.ts`)
    - Create `apps/novel/src/lib/data/migrate-localstorage.ts`
    - Implement `migrateFromLocalStorage(db)` that reads existing localStorage data
    - Bulk-insert novels (without nested chapters) into novels collection
    - Flatten and bulk-insert chapters into chapters collection (including content from separate localStorage keys)
    - Migrate reading progress documents
    - Clear migrated localStorage keys on success
    - Set a migration-done flag to prevent re-running
    - Handle partial failures gracefully (log and skip failed documents)
    - _Requirements: 1.1, 10.4, 14.1, 14.2_

  - [ ]* 2.3 Write property test for schema validation (Property 6)
    - **Property 6: Schema Validation Rejects Invalid Documents**
    - Generate objects missing required fields and verify insertion throws validation errors
    - Test novels missing id/title/author and chapters missing id/novelId/title/order/status/wordCount
    - Use `fake-indexeddb/auto` for in-memory IndexedDB
    - **Validates: Requirements 2.6**

- [ ] 3. Checkpoint - Ensure database foundation works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement reactive query surface
  - [ ] 4.1 Create the reactive queries module (`reactive.ts`)
    - Create `apps/novel/src/lib/data/reactive.ts`
    - Implement `fromDb` helper that lazily resolves the database and switches into a collection observable
    - Implement `novels$()` returning `Observable<NovelMeta[]>` with mapping from RxDB docs
    - Implement `novel$(id)` returning `Observable<NovelMeta | null>`
    - Implement `chapters$(novelId)` returning `Observable<ChapterMeta[]>` ordered by `order`
    - Implement `progress$(novelId)` returning `Observable<ReadingProgress | null>`
    - Use `shareReplay(1)` for efficient multicasting
    - Implement `toNovelMeta`, `toChapterMeta`, `toProgress` mapping functions
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2_

  - [ ]* 4.2 Write property test for reactive query emission (Property 9)
    - **Property 9: Reactive Query Emission on Write**
    - For any write operation, verify the corresponding reactive observable emits an updated result
    - Test insert, patch, and remove operations
    - **Validates: Requirements 7.5**

- [ ] 5. Migrate CRUD modules to RxDB
  - [ ] 5.1 Migrate `novels.ts` to use RxDB
    - Rewrite `apps/novel/src/lib/data/novels.ts` to use `getDatabase()` for all operations
    - Implement `_primeCache` for the sync API (`listNovels`, `getNovel`)
    - Implement async `createNovel`, `updateNovel`, `deleteNovel` (with cascade to chapters), `getNovelWordCount`
    - Maintain identical function signatures and exports
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 13.1, 13.2, 13.4_

  - [ ]* 5.2 Write property tests for novels (Properties 1, 4, 7)
    - **Property 1: Novel CRUD Round Trip** — insert then query returns identical fields
    - **Property 4: Delete Novel Cascades** — after delete, no chapters exist for that novelId
    - **Property 7: Word Count Aggregation** — `getNovelWordCount` returns sum of chapter wordCounts
    - **Validates: Requirements 4.3, 4.2, 4.5, 4.6, 14.4**

  - [ ] 5.3 Migrate `chapters.ts` to use RxDB
    - Rewrite `apps/novel/src/lib/data/chapters.ts` to use `getDatabase()` for all operations
    - Implement `_primeCache` for the sync API (`listChapters`, `getChapterMeta`)
    - Implement async `getChapterContent`, `saveChapterContent`, `createChapter`, `deleteChapter`, `reorderChapters`
    - Ensure `deleteChapter` reorders remaining chapters sequentially
    - Ensure `createChapter` assigns order = max existing + 1
    - Maintain identical function signatures and exports
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 13.1, 13.2, 14.1, 14.2, 14.3_

  - [ ]* 5.4 Write property tests for chapters (Properties 2, 3)
    - **Property 2: Chapter Ordering Invariant** — after any sequence of create/delete/reorder, orders form contiguous 1..N
    - **Property 3: Chapter Content Round Trip** — save then read content returns structurally equivalent document
    - **Validates: Requirements 5.1, 5.3, 5.5, 5.6, 5.7**

  - [ ] 5.5 Migrate `reading-progress.ts` to use RxDB
    - Rewrite `apps/novel/src/lib/data/reading-progress.ts` to use `getDatabase()` for all operations
    - Implement `getProgress`, `markChapterRead` with upsert logic
    - Ensure `markChapterRead` is idempotent (preserves original timestamps)
    - Maintain identical function signatures and exports
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 13.1, 13.2_

  - [ ]* 5.6 Write property test for reading progress (Property 5)
    - **Property 5: Mark Chapter Read Idempotence** — calling markChapterRead multiple times preserves original timestamp
    - **Validates: Requirements 6.2**

- [ ] 6. Checkpoint - Ensure CRUD migrations work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement seed, init, and replication modules
  - [ ] 7.1 Rewrite the seed module (`seed.ts`)
    - Rewrite `apps/novel/src/lib/data/seed.ts` to use RxDB collections
    - Implement `seedIfEmpty(db)` that checks novel count and inserts demo data if empty
    - Insert same demo content as current seed (6 novels with chapters and chapter content for demo-last-horizon)
    - Split existing nested novel data into separate novel and chapter inserts
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 7.2 Write property test for seed idempotence (Property 8)
    - **Property 8: Seed Idempotence** — calling seed on a non-empty database does not change document counts
    - **Validates: Requirements 9.2**

  - [ ] 7.3 Create the initialization module (`init.ts`)
    - Create `apps/novel/src/lib/data/init.ts`
    - Implement `initDataLayer()` that calls `getDatabase()` and sets up cache-priming subscriptions
    - Subscribe to novels and chapters collections to keep sync caches up to date
    - Guard against double initialization
    - _Requirements: 8.1, 8.2, 13.2_

  - [ ] 7.4 Create the replication contract stub (`replication.ts`)
    - Create `apps/novel/src/lib/data/replication.ts`
    - Define and export `ReplicationContract` interface with push, pull, and conflictHandler types
    - Define and export `ReplicationCheckpoint`, `PushRow`, `PullResponse`, `ConflictResult`, `ReplicationState` types
    - Implement `setupReplication()` stub that logs a warning and returns idle state observable
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 8. Wire into application and update exports
  - [ ] 8.1 Update `src/lib/data/index.ts` barrel exports
    - Add exports for new modules: `reactive.ts`, `database.ts`, `replication.ts`, `init.ts`
    - Maintain all existing exports from novels.ts, chapters.ts, reading-progress.ts
    - Remove or deprecate `storage.ts` exports (no longer needed for novel/chapter/progress data)
    - _Requirements: 13.3_

  - [ ] 8.2 Integrate `initDataLayer()` into root layout
    - Update `apps/novel/src/routes/+layout.svelte` to import and call `initDataLayer()` in `onMount`
    - Ensure it runs only in browser context (ssr=false already handles this)
    - _Requirements: 8.1, 8.3, 1.5_

  - [ ]* 8.3 Write integration test for localStorage migration
    - Seed localStorage with known novel/chapter/progress data in the old format
    - Initialize the database and verify all data migrated to RxDB collections
    - Verify localStorage keys were cleaned up
    - Verify migration does not run again on subsequent init
    - _Requirements: 1.1, 10.4, 14.1_

  - [ ]* 8.4 Write integration test for reactive subscription lifecycle
    - Subscribe to a reactive query, perform a write, verify emission
    - Unsubscribe, perform another write, verify no further emissions (no leaks)
    - _Requirements: 7.5, 8.4_

- [ ] 9. Property test for chapter separation (Property 10)
  - [ ]* 9.1 Write property test for novel queries excluding content
    - **Property 10: Chapter Separation — Novel Queries Exclude Content**
    - Verify that `listNovels()` and `novels$()` results do not include chapter `content` (DocumentJSON)
    - **Validates: Requirements 14.3**

- [ ] 10. Final checkpoint - Full verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The design uses TypeScript throughout — all implementations should be in TypeScript
- All test files should use `fake-indexeddb/auto` for in-memory IndexedDB and create isolated database instances per test
- The `fromObservable` utility from `@cosmonexus/nova-svelte` is the integration point for Svelte components

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["2.3", "4.1"] },
    { "id": 3, "tasks": ["4.2", "5.1", "5.3", "5.5"] },
    { "id": 4, "tasks": ["5.2", "5.4", "5.6", "7.1"] },
    { "id": 5, "tasks": ["7.2", "7.3", "7.4"] },
    { "id": 6, "tasks": ["8.1", "8.2"] },
    { "id": 7, "tasks": ["8.3", "8.4", "9.1"] }
  ]
}
```
