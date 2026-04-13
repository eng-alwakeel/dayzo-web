---
name: expanding-dayzo-i18n
description: The agent consults this skill when evaluating, adding, reviewing, or validating any new Dayzo language, translation layer, hreflang mapping, RTL behavior, font fallback, multilingual route family, or language-driven SEO expansion.
---

# Dayzo i18n Expander

This skill governs the process of adding, supporting, and maintaining internationalization (i18n) and localization within Dayzo. It guarantees that new languages are integrated safely without harming the SEO architecture, user experience, or visual consistency.

## 1. Core Language Addition Requirements

Every new language added to Dayzo MUST comprehensively include:
- A standardized **route prefix** (e.g., `/es/`, `/de/`, `/ar/`).
- A complete matching **i18n definitions file**.
- Full **UI translation** (navigation, footers, buttons, modais, tooltips).
- Complete **SEO page translation support** including titles and meta descriptions.
- Grammatically accurate **quick answer translations**.
- Fully transcribed **FAQ translations**.
- Updated **hreflang coverage** across all existing language properties.
- **Canonical consistency** linking the translated sibling directly to its localized origin.
- Assessed and verified **font support** (web font fallbacks).
- A mandatory **QA pass** before merging.

## 2. Process & Workflows

### Language Addition Workflow
1. **Plan:** Confirm target ISO language code, RTL/LTR orientation, and necessary font sets.
2. **Scaffold:** Create the new dictionary files mirroring the primary language structure.
3. **Translate:** Populate the UI, SEO frames, and dynamic event name keys.
4. **Network:** Update global hreflang maps to include the new language bi-directionally.
5. **Verify:** Run the Translation Completeness Checklist and Multilingual QA Rules.
6. **Execute:** Deploy or commit the verified language package.

### Translation Completeness Checklist
- Are all keys from the core English (or primary base) dictionary present in the new language dictionary?
- Are Quick Answer variables (e.g., interpolating `{days}`, `{event}`, `{date}`) correctly placed into the localized syntax?
- Are all structured data strings (JSON-LD) localized?

## 3. SEO & Routing Integrity

### Route Rules
- Route slugs (e.g., `how-many-days-until-<event-slug>`) MUST utilize an equivalent translated structure for the language's native phrasing, but the underlying `<event-slug>` must stay consistent programmatically to map counterparts correctly.
- Language prefixes are strictly localized top-level divisions. Avoid query parameters for language control on SEO pages (e.g., use `/es/` not `?lang=es`).

### Hreflang Rules
- Hreflang tags must be absolute URLs.
- Hreflang maps must be bi-directional. (If English points to Spanish, Spanish MUST point back to English).
- Always define an `x-default` language property.

## 4. Visual & Structural Handling

### RTL (Right-to-Left) Rules
- For languages like Arabic (`/ar/`), the HTML `dir="rtl"` attribute must be strictly applied at the document level.
- Grid arrays, flexbox orders, padding, and margins must seamlessly mirror. Check for logical CSS properties (e.g., `margin-inline-start`).
- Icons indicating direction (e.g., standard "next" arrows) must flip.

### Typography Fallback Rules
- Ensure the primary Dayzo font supports the new language's character glyphs.
- If primary font lacks support, define a clean, high-legibility web-safe fallback font specific to that language (e.g., `Tajawal` or `Cairo` for Arabic) that closely matches Dayzo's minimalist brand identity.

## 5. Rejection & Fail Conditions

The agent must halt the rollout and aggressively flag the work if the rollout meets any of these fail conditions:
- **Partial Language Additions:** Submitting a language with missing dictionary keys.
- **Untranslated Critical SEO Blocks:** Submitting English or placeholder titles/descriptions/FAQs on localized routes.
- **Missing Hreflang:** Failing to interlink the new language with the rest of the existing ecosystem.
- **Broken Language Switching:** The user-facing language picker fails to redirect to the exact reciprocal local page.
- **Unsupported Typography:** The newly rendered language displays generic serif fallbacks or "tofu" blocks (missing glyph rendering).
- **Unreviewed RTL Layouts:** Applying RTL languages without verifying margin, padding, or alignment behavior.
