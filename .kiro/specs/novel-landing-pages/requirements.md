# Requirements Document

## Introduction

Expand the novel app's reader-facing pages — the Library page (`/`) and the Novel Landing page (`/novel/[id]`) — into a full editorial discovery experience. The design language is editorial/literary (Apple Books meets The New Yorker meets Substack), using serif reading fonts, display headings, and measure-based widths. All data is sourced from localStorage with 6 seeded novels. No authentication or backend is required for this MVP.

## Glossary

- **Library_Page**: The reader-facing homepage at route `/` that displays a browsable catalog of all novels.
- **Novel_Landing_Page**: The reader-facing detail page at route `/novel/[id]` that showcases a single novel's cover, metadata, chapters, and author information.
- **Novel_Card**: A visual element representing a novel, displaying its cover image, title, author, and summary metadata (genre, chapter count, reading time).
- **Collection_Shelf**: A named, curated horizontal grouping of novels (e.g., "Staff Picks", "Completed Series", "Rising Authors") displayed as a scrollable row of Novel_Cards.
- **Genre_Filter**: An interactive control that filters the visible novel catalog by a selected genre value.
- **Cover_Grid**: A responsive grid layout that displays novels primarily by their cover images in a bookshelf-like arrangement.
- **Reading_Time_Estimate**: A computed value derived from total word count divided by an average reading speed of 250 words per minute, displayed in human-readable format (e.g., "2 hr 15 min").
- **Author_Section**: A content area on the Novel_Landing_Page displaying the author's name, avatar placeholder, and biographical text.
- **Related_Novels**: A section on the Novel_Landing_Page showing novels that share genre or author with the current novel.
- **Reading_Progress**: A localStorage-persisted record of which chapters a reader has viewed, enabling "Continue Reading" behavior.
- **Smart_CTA**: A call-to-action button that adapts its label and target based on Reading_Progress state — showing "Start Reading" for unread novels and "Continue Reading" for partially-read novels.
- **Social_Proof_Section**: A placeholder UI section reserved for future ratings, reviews, or reader counts.
- **Design_Tokens**: CSS custom properties from the acaldwell-dev token system (e.g., `--spacing-*`, `--font-size-*`, `--color-accent-main`) used for all spacing, typography, and color values.
- **Chapter_Progress_Indicator**: A visual marker on each chapter row showing whether the reader has viewed that chapter.

## Requirements

### Requirement 1: Featured Novel Hero

**User Story:** As a reader, I want to see an editorially-prominent featured novel on the library homepage, so that I can discover a highlighted story immediately upon arrival.

#### Acceptance Criteria

1. WHEN the Library_Page loads with at least one novel in storage, THE Library_Page SHALL display the first novel as a featured hero section containing its cover image, title, author, genre label, synopsis (truncated to 3 lines), chapter count, and Reading_Time_Estimate.
2. WHEN the reader activates the featured novel hero, THE Library_Page SHALL navigate to the Novel_Landing_Page for that novel.
3. IF no novels exist in storage, THEN THE Library_Page SHALL display an empty state message with a link to the author writing page.

### Requirement 2: New This Week Section

**User Story:** As a reader, I want to see which novels have been recently updated, so that I can find fresh content to read.

#### Acceptance Criteria

1. WHEN the Library_Page loads, THE Library_Page SHALL display a "New This Week" section containing novels whose `updatedAt` timestamp falls within the last 7 days, ordered by most recently updated first.
2. THE Library_Page SHALL display each novel in the "New This Week" section as a Novel_Card with cover thumbnail, title, author, and Reading_Time_Estimate.
3. IF no novels have been updated within the last 7 days, THEN THE Library_Page SHALL hide the "New This Week" section entirely.

### Requirement 3: Genre-Based Filtering

**User Story:** As a reader, I want to filter the novel catalog by genre, so that I can browse stories that match my interests.

#### Acceptance Criteria

1. THE Library_Page SHALL display a Genre_Filter control showing all genres present across the stored novels.
2. WHEN the reader selects a genre from the Genre_Filter, THE Library_Page SHALL display only novels matching the selected genre in the browsable catalog sections (Cover_Grid and novel list).
3. WHEN the reader clears the Genre_Filter selection, THE Library_Page SHALL display all novels in the browsable catalog sections.
4. WHILE a genre is selected, THE Genre_Filter SHALL visually indicate the active selection using Design_Tokens accent color.

### Requirement 4: Curated Collection Shelves

**User Story:** As a reader, I want to browse editorially-curated collections of novels, so that I can discover stories through themed groupings.

#### Acceptance Criteria

1. THE Library_Page SHALL display at least three Collection_Shelf sections: "Staff Picks", "Completed Series" (novels where all chapters have status `final`), and "Rising Authors".
2. THE Library_Page SHALL display each Collection_Shelf as a labeled horizontal row of Novel_Cards.
3. WHEN a Collection_Shelf contains more novels than fit within the viewport width, THE Library_Page SHALL allow horizontal scrolling within that shelf.
4. WHEN the reader activates a Novel_Card within a Collection_Shelf, THE Library_Page SHALL navigate to the corresponding Novel_Landing_Page.

### Requirement 5: Reading Time Estimates

**User Story:** As a reader, I want to see estimated reading times on novel entries, so that I can choose stories that fit my available time.

#### Acceptance Criteria

1. THE Library_Page SHALL display a Reading_Time_Estimate on each Novel_Card.
2. THE Novel_Landing_Page SHALL display a Reading_Time_Estimate in the novel statistics section.
3. THE Reading_Time_Estimate SHALL be computed by dividing total published word count (chapters with status `final` or `editing`) by 250 words per minute, formatted as hours and minutes (e.g., "1 hr 20 min" or "45 min").

### Requirement 6: Cover Grid / Bookshelf View

**User Story:** As a reader, I want to browse novels visually by their cover art in a grid layout, so that I can discover stories through visual appeal.

#### Acceptance Criteria

1. THE Library_Page SHALL display a Cover_Grid section showing novel covers in a responsive grid layout.
2. WHEN viewport width is 768px or wider, THE Cover_Grid SHALL display novels in a multi-column grid (3 to 5 columns based on available space).
3. WHEN viewport width is below 768px, THE Cover_Grid SHALL display novels in a 2-column grid.
4. THE Cover_Grid SHALL display each novel's cover image at a 2:3 aspect ratio with the novel title below it.
5. WHEN the reader activates a cover in the Cover_Grid, THE Library_Page SHALL navigate to the corresponding Novel_Landing_Page.
6. IF a novel has no `coverUrl`, THEN THE Cover_Grid SHALL display a placeholder cover showing the first character of the novel title.

### Requirement 7: Author Call-to-Action

**User Story:** As a potential author visiting the reader library, I want to see an invitation to start writing, so that I can discover the authoring tools.

#### Acceptance Criteria

1. THE Library_Page SHALL display a subtle call-to-action section inviting authors to start writing or publish their story.
2. WHEN the reader activates the author call-to-action, THE Library_Page SHALL navigate to the author dashboard at route `/author`.
3. THE author call-to-action SHALL be visually distinct from novel content but subdued relative to the primary reading experience, using Design_Tokens muted colors.

### Requirement 8: Expanded Novel Statistics

**User Story:** As a reader, I want to see detailed statistics about a novel, so that I can understand its scope and activity before committing to read.

#### Acceptance Criteria

1. THE Novel_Landing_Page SHALL display the following statistics: total word count (published chapters), Reading_Time_Estimate, number of published chapters, and update frequency.
2. THE Novel_Landing_Page SHALL compute update frequency as a human-readable label derived from the average interval between chapter `updatedAt` timestamps (e.g., "Updated weekly", "Updated monthly").
3. IF a novel has fewer than 2 published chapters, THEN THE Novel_Landing_Page SHALL omit the update frequency statistic.

### Requirement 9: About the Author Section

**User Story:** As a reader, I want to learn about the author of a novel, so that I can decide whether to trust and follow their work.

#### Acceptance Criteria

1. THE Novel_Landing_Page SHALL display an Author_Section containing the author's name and a circular avatar placeholder.
2. THE Author_Section SHALL display a biographical text placeholder (static seed text per author for the MVP).
3. THE Author_Section SHALL be positioned below the novel synopsis and above the chapter list.

### Requirement 10: Related Novels Recommendations

**User Story:** As a reader, I want to see novels similar to the one I'm viewing, so that I can discover more stories I might enjoy.

#### Acceptance Criteria

1. THE Novel_Landing_Page SHALL display a Related_Novels section below the chapter list.
2. THE Related_Novels section SHALL show up to 4 novels that share the same genre as the current novel, excluding the current novel itself.
3. IF fewer than 2 novels share the same genre, THEN THE Related_Novels section SHALL supplement with novels by the same author or from other genres to reach a minimum of 2 recommendations.
4. WHEN the reader activates a related novel entry, THE Novel_Landing_Page SHALL navigate to that novel's landing page.

### Requirement 11: Chapter List Improvements

**User Story:** As a reader, I want to see reading progress and time estimates per chapter, so that I can plan my reading sessions.

#### Acceptance Criteria

1. THE Novel_Landing_Page SHALL display each published chapter row with its title, word count, and an estimated reading time computed as word count divided by 250 words per minute.
2. THE Novel_Landing_Page SHALL display a Chapter_Progress_Indicator on each chapter row reflecting whether the reader has previously viewed that chapter (based on Reading_Progress stored in localStorage).
3. WHEN no Reading_Progress exists for a chapter, THE Chapter_Progress_Indicator SHALL display in an unread state using Design_Tokens muted styling.
4. WHEN Reading_Progress exists for a chapter, THE Chapter_Progress_Indicator SHALL display in a read state using Design_Tokens accent styling.

### Requirement 12: Social Proof Section

**User Story:** As a reader, I want to see social validation of a novel's quality, so that I can feel confident in my reading choice.

#### Acceptance Criteria

1. THE Novel_Landing_Page SHALL display a Social_Proof_Section positioned between the novel statistics and the chapter list.
2. THE Social_Proof_Section SHALL render as placeholder UI displaying static mock data (e.g., a star rating of 4.2, "128 readers", "12 reviews").
3. THE Social_Proof_Section SHALL be visually styled as a complete component using Design_Tokens, ready for future data wiring without layout changes.

### Requirement 13: Smart Reading CTA

**User Story:** As a reader, I want the primary action button to reflect my reading state, so that I can seamlessly resume or start a novel.

#### Acceptance Criteria

1. WHEN no Reading_Progress exists for the current novel, THE Novel_Landing_Page SHALL display a Smart_CTA labeled "Start Reading" linking to the first published chapter.
2. WHEN Reading_Progress exists for the current novel, THE Novel_Landing_Page SHALL display a Smart_CTA labeled "Continue Reading" linking to the next unread published chapter.
3. WHEN all published chapters have been read, THE Novel_Landing_Page SHALL display a Smart_CTA labeled "Read Again" linking to the first published chapter.
4. THE Novel_Landing_Page SHALL persist Reading_Progress to localStorage when a reader navigates to a chapter page.

### Requirement 14: Responsive Layouts

**User Story:** As a reader on any device, I want the pages to adapt to my screen size, so that I can comfortably discover and read novels on mobile or desktop.

#### Acceptance Criteria

1. WHEN viewport width is below 768px, THE Library_Page SHALL render all sections in a single-column layout.
2. WHEN viewport width is 768px or wider, THE Library_Page SHALL render multi-column layouts for the Cover_Grid, Collection_Shelf, and featured hero sections.
3. WHEN viewport width is below 768px, THE Novel_Landing_Page hero section SHALL stack the cover image above the novel information in a single column.
4. WHEN viewport width is 768px or wider, THE Novel_Landing_Page hero section SHALL display the cover beside the novel information in a two-column grid.
5. THE Library_Page and Novel_Landing_Page SHALL use container queries for component-level responsive behavior where components are reused across different layout contexts.

### Requirement 15: Design Token Compliance

**User Story:** As a developer maintaining the design system, I want all new UI to use design token variables consistently, so that the visual language remains cohesive and themeable.

#### Acceptance Criteria

1. THE Library_Page SHALL use Design_Tokens CSS custom properties for all spacing, typography, color, radius, and shadow values.
2. THE Novel_Landing_Page SHALL use Design_Tokens CSS custom properties for all spacing, typography, color, radius, and shadow values.
3. THE Library_Page and Novel_Landing_Page SHALL NOT use hard-coded color values (hex, rgb, hsl) outside of Design_Tokens definitions.
4. WHILE the dark theme is active, THE Library_Page and Novel_Landing_Page SHALL render correctly using the dark theme token overrides without additional conditional logic in component styles.

### Requirement 16: Modern CSS Compliance

**User Story:** As a developer, I want all new CSS to follow modern best practices, so that the codebase remains forward-looking and consistent.

#### Acceptance Criteria

1. THE Library_Page and Novel_Landing_Page SHALL use OKLCH color syntax for any color values defined outside of Design_Tokens.
2. THE Library_Page and Novel_Landing_Page SHALL use logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) instead of physical directional properties.
3. THE Library_Page and Novel_Landing_Page SHALL use `focus-visible` pseudo-class for keyboard focus styling on all interactive elements.
4. THE Library_Page and Novel_Landing_Page SHALL use container queries for component-level responsive adjustments and media queries only for page-level layout shifts.
5. THE Library_Page and Novel_Landing_Page SHALL use `dvh` viewport units where viewport height is referenced.

### Requirement 17: CSS-Only Transitions

**User Story:** As a reader, I want subtle visual polish without performance-heavy animations, so that the experience feels refined without being distracting.

#### Acceptance Criteria

1. THE Library_Page and Novel_Landing_Page SHALL use CSS transitions and CSS animations exclusively for all motion effects.
2. THE Library_Page and Novel_Landing_Page SHALL NOT use JavaScript-driven animation libraries or requestAnimationFrame for visual motion.
3. THE Library_Page and Novel_Landing_Page SHALL respect the `prefers-reduced-motion` media query by disabling non-essential animations when the user has indicated a preference for reduced motion.

### Requirement 18: Accessibility

**User Story:** As a reader using assistive technology, I want the pages to be properly structured and labeled, so that I can navigate and understand the content effectively.

#### Acceptance Criteria

1. THE Library_Page SHALL maintain a valid heading hierarchy starting with a single `h1` element, with subsequent sections using `h2` and below without skipping levels.
2. THE Novel_Landing_Page SHALL maintain a valid heading hierarchy starting with a single `h1` element (the novel title), with subsequent sections using `h2` and below without skipping levels.
3. THE Library_Page and Novel_Landing_Page SHALL use semantic landmark elements (`main`, `nav`, `section` with accessible names) to define page regions.
4. THE Library_Page and Novel_Landing_Page SHALL provide `alt` text on all cover images describing the novel title (e.g., "The Last Horizon cover").
5. THE Library_Page and Novel_Landing_Page SHALL ensure all interactive elements (links, buttons, filters) are reachable and operable via keyboard navigation.
6. THE Genre_Filter SHALL communicate its current state to assistive technology using appropriate ARIA attributes (`aria-pressed` or `aria-selected`).
