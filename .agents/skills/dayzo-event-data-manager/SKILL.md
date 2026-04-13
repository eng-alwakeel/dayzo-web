---
name: managing-dayzo-event-data
description: The agent consults this skill when adding, updating, validating, or restructuring Dayzo event datasets, variable event mappings, country event mappings, template definitions, trending data, or any content files that drive page generation, multilingual rendering, or event discovery behavior.
---

# Dayzo Event Data Manager

This skill governs the structure, validation, and safe expansion of Dayzo's JSON datasets and internationalization mappings. The executing agent must treat data integrity as the absolute baseline for SEO stability and functional correctness.

## 1. Core Principles

The integrity of Dayzo relies on predictable data structures to drive generating pages, setting routes, and computing accurate countdowns. 
- **Stable Slugs:** Slugs are immutable identifiers. Changing a slug equals breaking a URL.
- **Predictable Schemas:** Every JSON dataset must adhere strictly to predefined fields.
- **Clear Separation of Concerns:**
  - `events_global.json`: Fixed dates observed internationally (e.g., Christmas).
  - `events_variable.json`: Holidays/events that change exact dates algorithmically each year (e.g., Thanksgiving, Easter).
  - `events_local.json`: Fixed dates observed in specific regions.
  - `events_by_country.json`: Maps local and variable events to specific regions/demographics.
  - `trending.json`: Manual or dynamic overrides for the "popular" block on the homepage.
  - `templates.json`: Design definitions, background mappings, and color overrides.

## 2. Dataset Definitions & Required Fields

### General Event Objects (Global/Local)
All fixed event records must declare:
- `slug`: String, lowercase, strictly hyphenated (must NOT change).
- `name_key`: String used for i18n lookup (e.g., `events.christmas.name`).
- `month`: Integer (1-12).
- `day`: Integer (1-31).
- `type`: String (e.g., `holiday`, `seasonal`, `shopping`).

### Variable Events (`events_variable.json`)
Variable events require logic definition, not fixed dates:
- `slug`: String.
- `name_key`: String.
- `rule`: String representation of the algorithm (e.g., `fourth_thursday_november`).
- `fallback_dates`: Optional mapping of `{"2024": "2024-11-28", "2025": "..."}` for fast/safe rendering.

### Country Mappings (`events_by_country.json`)
- `country_code`: Iso-code (e.g., `US`, `SA`, `UK`).
- `event_slugs`: Array of strings referencing existing slugs.

## 3. Workflow & Slug Integrity Rules

### Slug Integrity Rules
1. **Never mutate an existing `slug`** if the page has already been indexed.
2. If an event name changes (e.g., "Columbus Day" to "Indigenous Peoples' Day"), update the `name_key` translation strings in the i18n files, **do not** change the slug. 
3. **No Duplicate Slugs:** A slug must be globally unique across all three event files (`global`, `variable`, `local`).

### Migration / Update Workflow
1. **Plan:** Analyze which file (`global`, `variable`, `local`, `trending`, `templates`) needs modification.
2. **Verify:** Look up the proposed slug across all datasets to ensure uniqueness.
3. **Execute:** Inject the schema-compliant JSON segment.
4. **Validate:** Cross-check the `name_key` exists in all relevant `i18n` language files.

### Template Definition Rules (`templates.json`)
- `id`: Unique string.
- `background_type`: `color`, `gradient`, or `image`.
- `background_value`: The actual hex, css string, or image path.
- `text_color`: Dark or light contrast.
- Must provide high contrast for safe-area countdown readability.

### Trending Ranking Rules (`trending.json`)
- Keep the list concise (e.g., top 4-6).
- Must only reference valid, existing `slug`s.
- Order in array dictates rendering rank.

## 4. Problem-Prevention Guidance

### Changing Event Names
- **Risk:** Changing event logic breaks incoming SEO juice.
- **Solution:** Change the user-facing text inside the i18n localization files. Leave the JSON datasets and file names intact. 

### Adding New Countries
- Ensure the `country_code` is standard ISO.
- Do not duplicate global events into local arrays. Global events automatically apply everywhere.

### Updating Variable Dates
- When updating variable events across new years, utilize precomputed `fallback_dates` arrays mapped by year to prevent heavy runtime algorithm loads and ensure safe SSG/SSR hydration.

### Preserving Multilingual Compatibility
- Adding a new event to a dataset *requires* an immediate corresponding update to ALL active language `i18n` dictionaries. Failing to do so causes rendering crashes or missing content blocks.
