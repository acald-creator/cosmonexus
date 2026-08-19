# Requirements Document

## Introduction

Decouple the novel app's data layer from RxDB by introducing a ports/adapters (hexagonal) architecture. The data layer defines TypeScript interfaces (ports) for each data concern, with pluggable adapter implementations: RxDB for local-first authoring, an in-memory adapter for testing, and a future REST adapter for readers. The public API surface remains unchanged — existing consumers (novels.ts, chapters.ts, reading-progress.ts, reactive.ts) delegate to whichever adapter is active at runtime.

## Glossary

- **Port**: A TypeScript interface defining the contract for a data concern (reads, writes, observables).
- **Adapter**: A concrete implementation of a port backed by a specific storage mechanism.
- **Adapter_Registry**: A runtime registry that holds the active adapter instances and allows switching adapters per context.
- **NovelsPort**: Interface defining novel CRUD, sync reads from cache, and reactive observable queries.
- **ChaptersPort**: Interface defining chapter CRUD, content retrieval, reordering, and reactive chapter queries.
- **ProgressPort**: Interface defining reading progress tracking, marking chapters read, and reactive progress queries.
- **RxDB_Adapter**: Adapter implementation backed by RxDB with Dexie/IndexedDB storage, providing offline-first persistence and real-time subscriptions.
- **Memory_Adapter**: Adapter implementation backed by plain TypeScript objects in memory, requiring no browser APIs, for use in unit and integration tests.
- **REST_Adapter**: Future adapter implementation that fetches published content from a server API (interface only, not implemented).
- **Data_Layer**: The `src/lib/data/` module providing the public API for novel, chapter, and progress operations.
- **Observable**: An RxJS Observable stream that emits updated values when underlying data changes.
- **Seed_Data**: Demo/test data that can be loaded into any adapter without depending on adapter internals.
- **DocumentJSON**: ProseMirror JSON format used for chapter content.

## Requirements

### Requirement 1: NovelsPort Interface Definition

**User Story:** As a developer, I want a NovelsPort interface that defines all novel data operations, so that I can implement different storage backends without changing consumer code.

#### Acceptance Criteria

1. THE NovelsPort SHALL define a `listNovels()` method returning `NovelMeta[]` for synchronous cache reads.
2. THE NovelsPort SHALL define a `getNovel(id: string)` method returning `NovelMeta | null` for synchronous single-novel lookup.
3. THE NovelsPort SHALL define an async `createNovel(data)` method returning `Promise<NovelMeta>`.
4. THE NovelsPort SHALL define an async `updateNovel(id, updates)` method returning `Promise<NovelMeta | null>`.
5. THE NovelsPort SHALL define an async `deleteNovel(id)` method returning `Promise<void>`.
6. THE NovelsPort SHALL define a `novels$()` method returning `Observable<NovelMeta[]>` for reactive queries.
7. THE NovelsPort SHALL define a `novel$(id: string)` method returning `Observable<NovelMeta | null>` for single-novel reactive queries.
8. THE NovelsPort SHALL define an async `init()` method returning `Promise<void>` for adapter-specific initialization.

### Requirement 2: ChaptersPort Interface Definition

**User Story:** As a developer, I want a ChaptersPort interface that defines all chapter data operations, so that chapter storage can be swapped independently.

#### Acceptance Criteria

1. THE ChaptersPort SHALL define a `listChapters(novelId: string)` method returning `ChapterMeta[]` for synchronous cache reads.
2. THE ChaptersPort SHALL define a `getChapterMeta(novelId, chapterId)` method returning `ChapterMeta | null`.
3. THE ChaptersPort SHALL define an async `getChapterContent(novelId, chapterId)` method returning `Promise<DocumentJSON | null>`.
4. THE ChaptersPort SHALL define an async `createChapter(novelId, data)` method returning `Promise<ChapterMeta | null>`.
5. THE ChaptersPort SHALL define an async `saveChapterContent(novelId, chapterId, content, wordCount)` method returning `Promise<void>`.
6. THE ChaptersPort SHALL define a `updateChapter(novelId, chapterId, updates)` method returning `ChapterMeta | null`.
7. THE ChaptersPort SHALL define an async `deleteChapter(novelId, chapterId)` method returning `Promise<void>`.
8. THE ChaptersPort SHALL define an async `reorderChapters(novelId, orderedIds)` method returning `Promise<void>`.
9. THE ChaptersPort SHALL define a `chapters$(novelId: string)` method returning `Observable<ChapterMeta[]>`.

### Requirement 3: ProgressPort Interface Definition

**User Story:** As a developer, I want a ProgressPort interface that defines reading progress operations, so that progress tracking is decoupled from the persistence mechanism.

#### Acceptance Criteria

1. THE ProgressPort SHALL define an async `getProgress(novelId: string)` method returning `Promise<ReadingProgress | null>`.
2. THE ProgressPort SHALL define an async `markChapterRead(novelId, chapterId)` method returning `Promise<void>`.
3. THE ProgressPort SHALL define a `progress$(novelId: string)` method returning `Observable<ReadingProgress | null>`.

### Requirement 4: RxDB Adapter Implementation

**User Story:** As an author using the app offline, I want the existing RxDB storage to continue functioning as before, so that my writing is persisted locally with real-time reactivity.

#### Acceptance Criteria

1. THE RxDB_Adapter SHALL implement NovelsPort, ChaptersPort, and ProgressPort interfaces.
2. THE RxDB_Adapter SHALL reside in an `adapters/rxdb/` directory within the data layer.
3. THE RxDB_Adapter SHALL preserve the current behavior of all existing data operations without regressions.
4. THE RxDB_Adapter SHALL emit reactive updates through RxDB's native `.$` subscription mechanism.
5. THE RxDB_Adapter SHALL initialize the database, run migrations, and seed data during its `init()` call.
6. WHEN the RxDB_Adapter `init()` is called and no novels exist, THE RxDB_Adapter SHALL seed the database with demo data.

### Requirement 5: In-Memory Adapter Implementation

**User Story:** As a developer writing tests, I want an in-memory adapter that requires no browser APIs, so that I can run data layer tests without IndexedDB or RxDB setup.

#### Acceptance Criteria

1. THE Memory_Adapter SHALL implement NovelsPort, ChaptersPort, and ProgressPort interfaces.
2. THE Memory_Adapter SHALL reside in an `adapters/memory/` directory within the data layer.
3. THE Memory_Adapter SHALL store all data in plain TypeScript Maps or objects within the process.
4. THE Memory_Adapter SHALL emit reactive updates via RxJS BehaviorSubjects when data is mutated.
5. THE Memory_Adapter SHALL require no browser APIs (no IndexedDB, no localStorage, no DOM).
6. THE Memory_Adapter SHALL support a `reset()` method that clears all stored data for test isolation.
7. THE Memory_Adapter SHALL support pre-loading data during `init()` via a configuration parameter.

### Requirement 6: Adapter Registry

**User Story:** As a developer, I want a runtime registry that selects and provides the active adapter, so that different parts of the application can use different storage backends.

#### Acceptance Criteria

1. THE Adapter_Registry SHALL provide a `getAdapter()` function returning the currently active port implementations.
2. THE Adapter_Registry SHALL provide a `registerAdapter(name, factory)` function to register adapter factories by name.
3. THE Adapter_Registry SHALL provide a `setActiveAdapter(name)` function to switch the active adapter at runtime.
4. THE Adapter_Registry SHALL support selecting different adapters based on context (author vs reader).
5. WHEN `getAdapter()` is called before any adapter is registered, THE Adapter_Registry SHALL throw a descriptive error.
6. THE Adapter_Registry SHALL call `init()` on an adapter the first time it is activated.
7. THE Adapter_Registry SHALL export a `DataPorts` type bundling NovelsPort, ChaptersPort, and ProgressPort.

### Requirement 7: Public API Delegation

**User Story:** As an existing consumer of the data layer, I want the public API (novels.ts, chapters.ts, reading-progress.ts) to continue working without changes to import paths, so that the refactoring is non-breaking.

#### Acceptance Criteria

1. THE Data_Layer SHALL maintain the same exported function signatures in novels.ts, chapters.ts, and reading-progress.ts.
2. THE Data_Layer public functions SHALL delegate to the active adapter obtained from the Adapter_Registry.
3. THE Data_Layer reactive exports (novels$, chapters$, progress$) SHALL delegate to the active adapter's observable methods.
4. WHEN a consumer calls a public API function, THE Data_Layer SHALL not require the consumer to know which adapter is active.
5. THE Data_Layer SHALL maintain the same index.ts export surface.

### Requirement 8: Reactive Observable Compatibility

**User Story:** As a UI developer, I want reactive observables (novels$, chapters$, progress$) to work identically regardless of which adapter is active, so that components remain adapter-agnostic.

#### Acceptance Criteria

1. THE NovelsPort `novels$()` method SHALL return an Observable that emits the current list of novels upon subscription.
2. THE NovelsPort `novels$()` method SHALL emit updated values when novels are created, updated, or deleted.
3. THE ChaptersPort `chapters$(novelId)` method SHALL return an Observable that emits chapters for the given novel upon subscription.
4. THE ChaptersPort `chapters$(novelId)` method SHALL emit updated values when chapters are mutated.
5. THE ProgressPort `progress$(novelId)` method SHALL return an Observable that emits current progress upon subscription.
6. THE ProgressPort `progress$(novelId)` method SHALL emit updated values when progress changes.
7. WHEN the active adapter is the Memory_Adapter, THE observables SHALL emit synchronously after mutations for deterministic test assertions.

### Requirement 9: Seed Data Decoupling

**User Story:** As a developer, I want seed data to be adapter-agnostic, so that any adapter can be initialized with the same demo content.

#### Acceptance Criteria

1. THE Data_Layer SHALL define seed data as plain TypeScript objects independent of any adapter.
2. THE Data_Layer seed module SHALL export a function accepting a DataPorts instance and persisting seed data through the port interfaces.
3. WHEN the seed function is called with any adapter, THE seed function SHALL use only port interface methods (createNovel, createChapter, etc.) to persist data.
4. THE seed data SHALL include novel metadata, chapter metadata, and chapter content as currently defined in seed.ts.

### Requirement 10: REST Adapter Interface Specification

**User Story:** As a developer planning the reader experience, I want the REST adapter interface defined now, so that a future implementation can be added without changing the port contracts.

#### Acceptance Criteria

1. THE Data_Layer SHALL include a `adapters/rest/` directory containing type definitions for the REST adapter.
2. THE REST adapter types SHALL define the expected server API shape (endpoints, request/response types).
3. THE REST adapter type definitions SHALL implement NovelsPort and ChaptersPort as read-only (no write methods required).
4. THE REST adapter type definitions SHALL implement ProgressPort with both read and write capabilities.
5. THE REST adapter SHALL NOT be functionally implemented — only the type skeleton and interface conformance.

### Requirement 11: Initialization and Lifecycle

**User Story:** As a developer, I want a clear initialization lifecycle for the data layer, so that adapters are initialized before any data access occurs.

#### Acceptance Criteria

1. THE Data_Layer `initDataLayer()` function SHALL accept an optional adapter name parameter to select which adapter to activate.
2. WHEN `initDataLayer()` is called without a parameter, THE Data_Layer SHALL default to the RxDB adapter.
3. THE Data_Layer `initDataLayer()` function SHALL call the active adapter's `init()` method.
4. THE Data_Layer `initDataLayer()` function SHALL prime caches so that synchronous reads return data immediately after initialization completes.
5. IF `initDataLayer()` is called more than once, THE Data_Layer SHALL be idempotent and not re-initialize.

### Requirement 12: Type Safety and Contracts

**User Story:** As a developer, I want strict TypeScript types enforcing port contracts, so that adapter implementations are validated at compile time.

#### Acceptance Criteria

1. THE port interfaces SHALL use TypeScript generics where appropriate to maintain type safety across adapters.
2. THE port interfaces SHALL be exported from a dedicated `ports/` directory within the data layer.
3. WHEN an adapter implementation does not satisfy a port interface, THE TypeScript compiler SHALL produce a compile-time error.
4. THE port interfaces SHALL import domain types (NovelMeta, ChapterMeta, DocumentJSON, ChapterStatus) from @cosmonexus/nova-types.
5. THE port interfaces SHALL not reference RxDB types, IndexedDB types, or any adapter-specific types.
