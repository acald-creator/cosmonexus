# Implementation Plan: Novel Landing Pages

## Overview

Expand the Library page (`/`) and Novel Landing page (`/novel/[id]`) into a full editorial discovery experience. Implementation proceeds in layers: data utilities first, then reusable components, then page integration, and finally tests. All work is in `apps/novel/` using SvelteKit with Svelte 5 runes, localStorage data, and the existing design token system.

## Tasks

- [ ] 1. Create data utility modules
  - [ ] 1.1 Create `src/lib/data/reading-time.ts`
    - Implement `formatReadingTime(wordCount: number): string` — divides by 250 WPM, formats as "X hr Y min" or "Y min"
    - Implement `getPublishedWordCount(novel: NovelMeta): number` — sums wordCount for chapters with status `'final'` or `'editing'`
    - Implement `computeUpdateFrequency(novel: NovelMeta): string | null` — returns null for <2 published chapters, otherwise computes average interval and returns human-readable label
    - _Requirements: 5.3, 8.1, 8.2, 8.3_

  - [ ] 1.2 Create `src/lib/data/reading-progress.ts`
    - Define `ReadingProgress` type with `novelId`, `chaptersRead: Record<string, string>`, `lastChapterId`, `updatedAt`
    - Implement `getProgress(novelId: string): ReadingProgress | null` — reads from `reading-progress:{novelId}` key via storage module
    - Implement `markChapterRead(novelId: string, chapterId: string): void` — creates or updates progress, sets timestamp only if not already set (idempotent)
    - Implement `getNextUnread(novel: NovelMeta, progress: ReadingProgress | null): ChapterMeta | null` — finds first published chapter not in chaptersRead
    - Implement `getSmartCTAState(novel: NovelMeta, progress: ReadingProgress | null): { label: string; targetChapterId: string | null }` — returns "Start Reading", "Continue Reading", or "Read Again" with target chapter
    - _Requirements: 11.2, 13.1, 13.2, 13.3, 13.4_

  - [ ] 1.3 Create `src/lib/data/collections.ts`
    - Implement `getNewThisWeek(novels: NovelMeta[]): NovelMeta[]` — novels with updatedAt within 7 days, sorted desc
    - Implement `getStaffPicks(novels: NovelMeta[]): NovelMeta[]` — top 4 by total published word count
    - Implement `getCompletedSeries(novels: NovelMeta[]): NovelMeta[]` — novels where every chapter has status `'final'`
    - Implement `getRisingAuthors(novels: NovelMeta[]): NovelMeta[]` — novels with more draft/revision chapters than final
    - Implement `getRelatedNovels(current: NovelMeta, allNovels: NovelMeta[]): NovelMeta[]` — up to 4 related by genre, then author, then fill
    - _Requirements: 2.1, 4.1, 10.1, 10.2, 10.3_

  - [ ] 1.4 Create `src/lib/data/authors.ts`
    - Define static `AUTHOR_BIOS: Record<string, string>` map with bio text for each seeded author
    - Export `getAuthorBio(name: string): string` — returns bio or a default placeholder string
    - _Requirements: 9.2_

- [ ] 2. Create reusable UI components
  - [ ] 2.1 Create `src/lib/components/NovelCard.svelte`
    - Props: `novel: NovelMeta`, `size?: 'sm' | 'md' | 'lg'`
    - Renders cover thumbnail (image or letter placeholder at 2:3 ratio), title, author, reading time estimate
    - Links to `/novel/{novel.id}`
    - Uses design tokens for all spacing, color, typography
    - Provides `alt` text on cover image: "{title} cover"
    - _Requirements: 2.2, 4.2, 5.1, 6.4, 6.6, 15.1, 18.4_

  - [ ] 2.2 Create `src/lib/components/GenreFilter.svelte`
    - Props: `genres: string[]`, `selected: string | null`, `onSelect: (genre: string | null) => void`
    - Renders horizontal row of genre chips with an "All" option
    - Active chip styled with accent color, uses `aria-pressed` for accessibility
    - Keyboard navigable, `focus-visible` styling
    - _Requirements: 3.1, 3.4, 16.3, 18.5, 18.6_

  - [ ] 2.3 Create `src/lib/components/CollectionShelf.svelte`
    - Props: `title: string`, `novels: NovelMeta[]`
    - Renders section heading + horizontal scrollable row of NovelCard components
    - Overflow scroll on x-axis when content exceeds viewport
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ] 2.4 Create `src/lib/components/CoverGrid.svelte`
    - Props: `novels: NovelMeta[]`
    - Responsive grid: 2-col below 768px, 3-5 col at 768px+
    - Each item: cover at 2:3 ratio with title below, links to novel page
    - Uses container queries for responsive behavior
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 16.4_

  - [ ] 2.5 Create `src/lib/components/AuthorSection.svelte`
    - Props: `author: string`, `novelId: string`
    - Renders circular avatar placeholder, author name, bio text from `getAuthorBio()`
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 2.6 Create `src/lib/components/RelatedNovels.svelte`
    - Props: `currentNovel: NovelMeta`, `allNovels: NovelMeta[]`
    - Uses `getRelatedNovels()` to compute recommendations, renders as row of NovelCards
    - Each card links to the related novel's landing page
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 2.7 Create `src/lib/components/SocialProof.svelte`
    - Props: `novelId: string`
    - Renders static mock data: star rating (4.2), reader count, review count
    - Styled as complete component with design tokens, ready for future data wiring
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 2.8 Create `src/lib/components/ChapterProgressIndicator.svelte`
    - Props: `read: boolean`
    - Small dot/icon: muted styling when unread, accent styling when read
    - _Requirements: 11.3, 11.4_

  - [ ] 2.9 Create `src/lib/components/SmartCTA.svelte`
    - Props: `novel: NovelMeta`, `progress: ReadingProgress | null`
    - Uses `getSmartCTAState()` to determine label and target
    - Renders as styled link/button with appropriate href
    - _Requirements: 13.1, 13.2, 13.3_

- [ ] 3. Checkpoint
  - Ensure all data modules and components compile without errors, ask the user if questions arise.

- [ ] 4. Integrate Library page (`src/routes/+page.svelte`)
  - [ ] 4.1 Rewrite Library page with featured hero section
    - Display first novel as full hero: cover, title, author, genre, synopsis (truncated 3 lines), chapter count, reading time estimate
    - Link hero to novel landing page
    - Show empty state with link to `/author` when no novels exist
    - Use semantic heading hierarchy: single `h1`, sections with `h2`
    - _Requirements: 1.1, 1.2, 1.3, 5.1, 18.1, 18.3_

  - [ ] 4.2 Add New This Week section to Library page
    - Use `getNewThisWeek()` to compute novel list
    - Render as horizontal row of NovelCards
    - Hide section entirely when no novels qualify
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 4.3 Add genre filtering to Library page
    - Derive available genres from stored novels
    - Wire GenreFilter component with local `$state` for selection
    - Filter Cover Grid and novel lists based on selection
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 4.4 Add Collection Shelves to Library page
    - Render "Staff Picks", "Completed Series", "Rising Authors" shelves using CollectionShelf component
    - Each shelf computed from `collections.ts` functions
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 4.5 Add Cover Grid section to Library page
    - Render CoverGrid component with all novels (respecting genre filter)
    - Responsive layout via container queries
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ] 4.6 Add author call-to-action section to Library page
    - Subtle CTA inviting authors to write, linking to `/author`
    - Visually subdued using muted design tokens
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 4.7 Apply responsive layout and modern CSS to Library page
    - Single-column below 768px, multi-column at 768px+
    - Logical properties, `focus-visible`, container queries, `dvh` where applicable
    - CSS-only transitions with `prefers-reduced-motion` respect
    - No hard-coded colors outside tokens
    - _Requirements: 14.1, 14.2, 14.5, 15.1, 15.3, 16.1, 16.2, 16.3, 16.4, 16.5, 17.1, 17.2, 17.3_

- [ ] 5. Integrate Novel Landing page (`src/routes/novel/[id]/+page.svelte`)
  - [ ] 5.1 Expand novel statistics section
    - Display total published word count, reading time estimate, published chapter count, update frequency
    - Omit update frequency when <2 published chapters
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ] 5.2 Add Author Section to Novel Landing page
    - Insert AuthorSection component below synopsis, above chapter list
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 5.3 Add Social Proof section to Novel Landing page
    - Insert SocialProof component between statistics and chapter list
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 5.4 Enhance chapter list with progress indicators and reading time
    - Show per-chapter reading time (wordCount / 250 WPM)
    - Add ChapterProgressIndicator using reading progress from localStorage
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ] 5.5 Replace static CTA with SmartCTA component
    - Wire SmartCTA with reading progress state
    - Persist reading progress when navigating to chapter page (via `markChapterRead`)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ] 5.6 Add Related Novels section to Novel Landing page
    - Insert RelatedNovels component below chapter list
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 5.7 Apply responsive layout and modern CSS to Novel Landing page
    - Stack cover above info below 768px, side-by-side at 768px+
    - Logical properties, `focus-visible`, container queries, `dvh` where applicable
    - CSS-only transitions with `prefers-reduced-motion` respect
    - Valid heading hierarchy (h1 = novel title), semantic landmarks
    - No hard-coded colors outside tokens
    - _Requirements: 14.3, 14.4, 14.5, 15.2, 15.3, 15.4, 16.1, 16.2, 16.3, 16.4, 16.5, 17.1, 17.2, 17.3, 18.2, 18.3, 18.4, 18.5_

- [ ] 6. Checkpoint
  - Ensure all pages render correctly with seeded data, all components compile, ask the user if questions arise.

- [ ] 7. Write unit tests for data modules
  - [ ]* 7.1 Write unit tests for `reading-time.ts`
    - Test `formatReadingTime`: 0 words, 249 words (→ "1 min"), 250 words (→ "1 min"), 15000 words (→ "1 hr"), edge formatting
    - Test `getPublishedWordCount`: mixed chapter statuses, all draft, all final
    - Test `computeUpdateFrequency`: <2 chapters → null, weekly intervals, monthly intervals
    - _Requirements: 5.3, 8.1, 8.2, 8.3_

  - [ ]* 7.2 Write unit tests for `reading-progress.ts`
    - Test `getProgress`: missing key returns null, existing key returns data
    - Test `markChapterRead`: creates new progress, adds to existing, idempotent (doesn't overwrite timestamp)
    - Test `getSmartCTAState`: no progress → "Start Reading", partial → "Continue Reading", all read → "Read Again"
    - _Requirements: 11.2, 13.1, 13.2, 13.3, 13.4_

  - [ ]* 7.3 Write unit tests for `collections.ts`
    - Test `getNewThisWeek`: recent novels included, old novels excluded, sorted desc
    - Test `getStaffPicks`: returns top 4 by published word count
    - Test `getCompletedSeries`: only fully-final novels
    - Test `getRisingAuthors`: novels with more draft/revision than final
    - Test `getRelatedNovels`: genre match priority, exclusion of current novel, max 4, minimum 2 guarantee
    - _Requirements: 2.1, 4.1, 10.1, 10.2, 10.3_

- [ ] 8. Write property-based tests
  - [ ]* 8.1 Property test for reading time round-trip consistency
    - **Property 1: Reading time round-trip consistency**
    - For any non-negative word count, `formatReadingTime(wordCount)` produces a string parseable to within ±1 minute of `Math.ceil(wordCount / 250)`
    - Use fast-check with `fc.nat()` generator
    - **Validates: Requirements 5.3**

  - [ ]* 8.2 Property test for published word count filtering
    - **Property 2: Published word count only includes qualifying chapters**
    - For any novel with mixed chapter statuses, result equals sum of wordCount for `'final'` or `'editing'` chapters only
    - **Validates: Requirements 5.3, 8.1**

  - [ ]* 8.3 Property test for genre filter subset
    - **Property 3: Genre filter is a pure subset**
    - For any novels array and selected genre, filtered result is a subset where every novel has matching genre
    - **Validates: Requirements 3.2, 3.3**

  - [ ]* 8.4 Property test for Smart CTA exhaustive states
    - **Property 4: Smart CTA state is exhaustive and deterministic**
    - For any novel with published chapters and any progress record, returns exactly one of the three labels with correct conditions
    - **Validates: Requirements 13.1, 13.2, 13.3**

  - [ ]* 8.5 Property test for related novels exclusion invariant
    - **Property 5: Related novels exclusion invariant**
    - For any novel and catalog, result never includes current novel, result has at most 4 items
    - **Validates: Requirements 10.1, 10.2**

  - [ ]* 8.6 Property test for related novels minimum guarantee
    - **Property 6: Related novels minimum guarantee**
    - For any catalog with ≥3 novels, result has at least 2 items
    - **Validates: Requirements 10.3**

  - [ ]* 8.7 Property test for Completed Series correctness
    - **Property 7: Collection "Completed Series" correctness**
    - Result only contains novels where every chapter has `status === 'final'`
    - **Validates: Requirements 4.1**

  - [ ]* 8.8 Property test for New This Week recency bound
    - **Property 8: New This Week recency bound**
    - Result only contains novels with `updatedAt` within 7 days, ordered descending
    - **Validates: Requirements 2.1**

  - [ ]* 8.9 Property test for reading progress idempotence
    - **Property 9: Reading progress idempotence**
    - Calling `markChapterRead` multiple times produces same state as calling once
    - **Validates: Requirements 11.2, 13.4**

  - [ ]* 8.10 Property test for update frequency minimum chapters
    - **Property 10: Update frequency requires minimum chapters**
    - For any novel with <2 published chapters, `computeUpdateFrequency` returns null
    - **Validates: Requirements 8.3**

- [ ] 9. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All styling uses design tokens — no hard-coded color values
- The implementation language is TypeScript (SvelteKit + Svelte 5 runes)
- Test framework: Vitest + fast-check at workspace root

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.8"] },
    { "id": 2, "tasks": ["2.3", "2.4", "2.5", "2.6", "2.7", "2.9"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "5.1", "5.2", "5.3"] },
    { "id": 4, "tasks": ["4.7", "5.4", "5.5", "5.6"] },
    { "id": 5, "tasks": ["5.7"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3"] },
    { "id": 7, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7", "8.8", "8.9", "8.10"] }
  ]
}
```
