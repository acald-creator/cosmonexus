# Requirements Document

## Introduction

Replace the novel app's localStorage-based data layer (`src/lib/data/`) with RxDB — a local-first reactive database backed by IndexedDB. This provides typed schemas, reactive queries that push updates to Svelte components, versioned schema migrations, and a replication interface for future server sync. The existing function-level API surface (novels.ts, chapters.ts, reading-progress.ts) remains stable so consumers don't change.

## Glossary

- **Database**: The RxDB database instance, created lazily on first access and shared as a singleton
- **Collection**: An RxDB collection — a typed set of documents with a JSON Schema, analogous to a table
- **Novel_Document**: An RxDB document in the novels collection, representing novel metadata
- **Chapter_Document**: An RxDB document in the chapters collection, storing chapter content (ProseMirror JSON) and metadata
- **Progress_Document**: An RxDB document in the reading-progress collection, tracking which chapters a reader has completed
- **Author_Document**: An RxDB document in the authors collection, storing author profile information
- **Reactive_Query**: An RxDB query that emits an RxJS Observable, automatically re-emitting when underlying data changes
- **Schema**: An RxDB JSON Schema definition (based on JSON Schema draft-7) with a version number for migrations
- **Migration_Strategy**: A function that transforms documents from one schema version to the next
- **Replication_Contract**: The client-side interface definition for push/pull replication (protocol shape, not server implementation)
- **Data_Layer**: The set of modules in `src/lib/data/` that provide CRUD and query operations to the rest of the app
- **Seed_Module**: The module responsible for populating the database with demo data on first run
- **Storage_Adapter**: The RxDB storage plugin (Dexie-based IndexedDB adapter) that persists data to the browser

## Requirements

### Requirement 1: RxDB Database Singleton

**User Story:** As a developer, I want a single shared RxDB database instance created lazily on first access, so that all modules operate on the same data and the database is not initialized until needed.

#### Acceptance Criteria

1. WHEN the database is accessed for the first time, THE Database SHALL be created with the Dexie IndexedDB Storage_Adapter
2. WHEN the database is accessed after initial creation, THE Database SHALL return the same instance (singleton)
3. THE Database SHALL expose a typed `getDatabase()` function that returns a `Promise<RxDatabase>`
4. IF the IndexedDB storage is unavailable, THEN THE Database SHALL throw a descriptive error indicating the storage backend is inaccessible
5. THE Database SHALL not be created during server-side rendering (guard against non-browser environments)

### Requirement 2: Collection Schemas

**User Story:** As a developer, I want typed JSON Schemas for each collection (novels, chapters, reading-progress, authors), so that document shapes are validated at write time and provide TypeScript inference.

#### Acceptance Criteria

1. THE Database SHALL define a novels Collection with fields: id (primary key), title, author, genre, synopsis, coverUrl, targetWordCount, createdAt, updatedAt
2. THE Database SHALL define a chapters Collection with fields: id (primary key), novelId, title, order, status, wordCount, targetWordCount, content (DocumentJSON), createdAt, updatedAt
3. THE Database SHALL define a reading-progress Collection with fields: id (primary key), novelId, chaptersRead (object mapping chapterId to timestamp), lastChapterId, updatedAt
4. THE Database SHALL define an authors Collection with fields: id (primary key), name, bio, avatarUrl, createdAt, updatedAt
5. THE Database SHALL assign version 0 as the initial schema version for all collections
6. WHEN a document is inserted or updated with fields that do not conform to the Schema, THE Collection SHALL reject the write with a validation error

### Requirement 3: Collection Indexes

**User Story:** As a developer, I want proper indexes on collections, so that queries by genre, author, status, and novelId are fast even with large datasets.

#### Acceptance Criteria

1. THE novels Collection SHALL have indexes on: [genre], [author], [updatedAt]
2. THE chapters Collection SHALL have indexes on: [novelId, order], [novelId, status], [status]
3. THE reading-progress Collection SHALL have an index on: [novelId]
4. THE authors Collection SHALL have an index on: [name]

### Requirement 4: Novels CRUD Migration

**User Story:** As a developer, I want novels.ts to use RxDB collection operations instead of localStorage, so that novel data is stored in IndexedDB and benefits from reactive queries.

#### Acceptance Criteria

1. WHEN `listNovels()` is called, THE Data_Layer SHALL query the novels Collection and return all Novel_Documents as `NovelMeta[]`
2. WHEN `getNovel(id)` is called, THE Data_Layer SHALL find the Novel_Document by primary key and return it as `NovelMeta | null`
3. WHEN `createNovel(data)` is called, THE Data_Layer SHALL insert a new Novel_Document with a generated id and return the created `NovelMeta`
4. WHEN `updateNovel(id, updates)` is called, THE Data_Layer SHALL atomically patch the Novel_Document and return the updated `NovelMeta | null`
5. WHEN `deleteNovel(id)` is called, THE Data_Layer SHALL remove the Novel_Document and all associated Chapter_Documents
6. WHEN `getNovelWordCount(id)` is called, THE Data_Layer SHALL sum wordCount from all Chapter_Documents with matching novelId
7. THE Data_Layer SHALL maintain the same function signatures as the current novels.ts module

### Requirement 5: Chapters CRUD Migration

**User Story:** As a developer, I want chapters.ts to use RxDB collection operations instead of localStorage, so that chapter data and content are stored in IndexedDB with reactive capabilities.

#### Acceptance Criteria

1. WHEN `listChapters(novelId)` is called, THE Data_Layer SHALL query the chapters Collection filtering by novelId and ordering by the order field
2. WHEN `getChapterMeta(novelId, chapterId)` is called, THE Data_Layer SHALL find the Chapter_Document by primary key and return metadata fields as `ChapterMeta | null`
3. WHEN `getChapterContent(novelId, chapterId)` is called, THE Data_Layer SHALL return the content field of the Chapter_Document as `DocumentJSON | null`
4. WHEN `createChapter(novelId, data)` is called, THE Data_Layer SHALL insert a new Chapter_Document with order set to (max existing order + 1) and empty content
5. WHEN `saveChapterContent(novelId, chapterId, content, wordCount)` is called, THE Data_Layer SHALL atomically update the content and wordCount fields of the Chapter_Document
6. WHEN `deleteChapter(novelId, chapterId)` is called, THE Data_Layer SHALL remove the Chapter_Document and reorder remaining chapters sequentially
7. WHEN `reorderChapters(novelId, orderedIds)` is called, THE Data_Layer SHALL update the order field of each Chapter_Document to match its position in the provided array
8. THE Data_Layer SHALL maintain the same function signatures as the current chapters.ts module

### Requirement 6: Reading Progress Migration

**User Story:** As a developer, I want reading-progress.ts to use RxDB collection operations instead of localStorage, so that reader progress is stored in IndexedDB.

#### Acceptance Criteria

1. WHEN `getProgress(novelId)` is called, THE Data_Layer SHALL query the reading-progress Collection by novelId and return a `ReadingProgress | null`
2. WHEN `markChapterRead(novelId, chapterId)` is called, THE Data_Layer SHALL upsert the Progress_Document adding the chapterId to chaptersRead with a timestamp (idempotent — existing timestamps are preserved)
3. WHEN `markChapterRead` is called and no Progress_Document exists for the novelId, THE Data_Layer SHALL create a new Progress_Document
4. THE Data_Layer SHALL maintain the same function signatures as the current reading-progress.ts module

### Requirement 7: Reactive Queries

**User Story:** As a developer, I want to subscribe to live query results that auto-update when underlying data changes, so that Svelte components reflect data changes without manual refetching.

#### Acceptance Criteria

1. THE Data_Layer SHALL expose a `novels$()` function that returns an RxJS Observable emitting the current list of Novel_Documents, re-emitting on any change to the novels Collection
2. THE Data_Layer SHALL expose a `novel$(id)` function that returns an Observable emitting the Novel_Document for a given id, re-emitting when that document changes
3. THE Data_Layer SHALL expose a `chapters$(novelId)` function that returns an Observable emitting the list of Chapter_Documents for a novel, ordered by the order field, re-emitting on changes
4. THE Data_Layer SHALL expose a `progress$(novelId)` function that returns an Observable emitting the Progress_Document for a novel, re-emitting on changes
5. WHEN the underlying data is modified by any write operation, THE Reactive_Query SHALL emit the updated result within the same microtask or the next event loop tick

### Requirement 8: Svelte Integration

**User Story:** As a developer, I want a Svelte-friendly way to consume reactive queries, so that components can bind to live data using existing patterns (fromObservable or Svelte 5 runes).

#### Acceptance Criteria

1. THE Data_Layer SHALL provide reactive query results that are compatible with the existing `fromObservable` utility in `@cosmonexus/nova-svelte`
2. WHEN a component subscribes to a reactive query via `fromObservable`, THE Data_Layer SHALL provide an initial value (empty array or null) before the first emission
3. THE Data_Layer SHALL document the recommended pattern for consuming reactive queries in Svelte 5 components
4. IF a component unsubscribes from a reactive query (unmounts), THEN THE Data_Layer SHALL not leak subscriptions or memory

### Requirement 9: Seed Data Support

**User Story:** As a developer, I want the seed module to populate RxDB collections with demo data on first run, so that the app has content to display immediately after initialization.

#### Acceptance Criteria

1. WHEN the database is initialized and no novels exist, THE Seed_Module SHALL insert demo Novel_Documents, Chapter_Documents, and Author_Documents into their respective collections
2. WHEN the database already contains data, THE Seed_Module SHALL not re-insert demo data (idempotent)
3. THE Seed_Module SHALL insert the same demo content as the current seed.ts module (6 novels with chapters and chapter content for demo-last-horizon)
4. THE Seed_Module SHALL be async-compatible (return a Promise that resolves when seeding is complete)

### Requirement 10: Schema Migrations

**User Story:** As a developer, I want versioned schema migrations so that changes to document shape in future releases are handled gracefully without data loss.

#### Acceptance Criteria

1. THE Database SHALL use RxDB's built-in schema versioning (integer version field on each schema)
2. WHEN a schema version is incremented, THE Database SHALL provide a Migration_Strategy function that transforms existing documents from the previous version to the new version
3. THE Database SHALL run pending migrations automatically when the database is opened with a newer schema version
4. IF a migration fails for a specific document, THEN THE Database SHALL log the error with the document id and skip that document without crashing the entire migration

### Requirement 11: Replication Contract

**User Story:** As a developer, I want the replication interface defined (client-side contract only), so that future server sync can be added without restructuring the data layer.

#### Acceptance Criteria

1. THE Database SHALL export a `ReplicationContract` TypeScript interface defining: push handler type, pull handler type, conflict resolution strategy type, and replication state type
2. THE Database SHALL export a `setupReplication(options: ReplicationContract)` function stub that accepts the contract and returns a replication state observable
3. THE Replication_Contract SHALL define push as a function receiving changed documents and returning a server acknowledgment
4. THE Replication_Contract SHALL define pull as a function receiving a checkpoint and returning new/changed documents since that checkpoint
5. THE `setupReplication` function SHALL not implement actual network calls (stub only — logs a warning that replication is not yet configured)

### Requirement 12: Offline-First Writes

**User Story:** As a developer, I want all writes to persist immediately to the local database regardless of network state, so that authors never lose work due to connectivity issues.

#### Acceptance Criteria

1. WHEN a write operation is performed, THE Data_Layer SHALL persist the change to IndexedDB immediately without waiting for any network response
2. WHEN the browser is offline, THE Data_Layer SHALL continue to accept and persist writes normally
3. THE Data_Layer SHALL not depend on network connectivity for any read or write operation in the current implementation (replication is a future addition)

### Requirement 13: API Surface Stability

**User Story:** As a developer, I want the existing exported function signatures from novels.ts, chapters.ts, and reading-progress.ts to remain unchanged, so that consuming components do not need modification.

#### Acceptance Criteria

1. THE Data_Layer SHALL export the same function names and TypeScript signatures as the current localStorage-based modules
2. WHEN an existing function returns a value synchronously in the current implementation, THE Data_Layer SHALL either maintain synchronous return or provide a synchronous wrapper that returns cached data (reactive queries handle freshness)
3. THE Data_Layer SHALL maintain the re-export structure in `src/lib/data/index.ts`
4. IF a function must become asynchronous due to RxDB's async nature, THEN THE Data_Layer SHALL provide both an async version and a synchronous reactive alternative (observable) so components can choose

### Requirement 14: Chapters as Separate Collection

**User Story:** As a developer, I want chapters stored as their own collection rather than nested inside novel documents, so that large chapter content (ProseMirror JSON) does not bloat novel queries and chapters can be queried independently.

#### Acceptance Criteria

1. THE Database SHALL store chapters in a separate chapters Collection, not as a nested array within Novel_Documents
2. THE chapters Collection SHALL reference the parent novel via a novelId field
3. WHEN a novel is queried for listing purposes, THE Data_Layer SHALL not load chapter content (DocumentJSON), only chapter metadata
4. WHEN `getNovelWordCount` is called, THE Data_Layer SHALL aggregate wordCount from the chapters Collection by novelId without loading content
