---
name: generating-dayzo-seo
description: The agent consults this skill when creating, reviewing, expanding, or validating any Dayzo SEO page, quick-answer block, FAQ section, schema markup, hreflang mapping, internal link structure, or programmatic SEO rollout across languages, events, seasons, years, and future page families.
---

# Dayzo SEO Engine

This skill governs the generation, validation, and programmatic rollout of all SEO-targeted pages, quick answers, structured data, interlinking, and multilingual meta tags. Strict adherence is required to build a highly discoverable, AI-search optimized, and robust organic presence.

## 1. Core Page Architecture & Routing

### Single Source of Truth for Routing
- **Enforced Canonical Page Family:** There is only one canonical page family mapping for all countdowns:
  `/<lang>/how-many-days-until-<slug>/`
- **Strict Prohibition:** Absolutely no duplicate route families (e.g., no `/en/countdown-to-<slug>/` running parallel).

### Required On-Page Elements
Every generated SEO page MUST organically integrate the following visible elements:
- `H1` (Clean, targeted, and user-friendly)
- Quick answer block (Actionable, direct summary)
- The core interactive Countdown
- Next occurrence date (Explicitly stated)
- Short, useful description (Avoiding fluff)
- FAQ section
- Related countdowns block (Internal linking)
- Share function
- QR code display
- Embed snippet generator
- "Create Live" CTA

### Required Head/Meta Elements
Every generated SEO page MUST output the following in the DOM head:
- Unique `<title>`
- Unique `<meta name="description">`
- Valid `<link rel="canonical">`
- Accurate `<link rel="alternate" hreflang="...">` for all localized variants
- FAQ Schema (`JSON-LD`)
- Event/SoftwareApplication Schema (`JSON-LD`) when relevant to the countdown type

## 2. Programmatic SEO Expansion Support

This engine structure supports the programmatic generation and maintenance of the following page families:
- **Events:** Fixed or static events (e.g., Christmas, Halloween).
- **Variable Events:** Algorithmically determined dates (e.g., Thanksgiving, Easter).
- **Seasons:** Start points of Summer, Winter, etc.
- **Years:** Countdowns to specific incoming years.
- **Day-Based Countdowns:** Specialized day markers (e.g., 100 days until X).
- **Shopping/Event Moments:** Black Friday, Cyber Monday, Prime Day.
- **Future Country Pages:** Region-specific event countdowns.

## 3. SEO Content & Technical Rules

### Content Patterns for Quick Answers
- Must immediately answer the user's implicit question ("How many days until X?").
- Example format: "There are precisely [X] days until [Event] on [Date], [Year]."
- Make it highly skimmable and positioned above the fold.

### FAQ Writing Rules
- Base questions on tangible user inquiries (e.g., "When is X in 2024?", "What day of the week is X?").
- Answers must be concise, accurate, and easily marked up with FAQ schema.

### AI-Search Readability Rules
- Text must be cleanly structured so LLMs and AI search engines can easily scrape the direct answer.
- Rely on semantic HTML (`<article>`, `<section>`, `time datetime="..."`).
- Prevent critical information from being trapped strictly within client-side JS variables; the core answer must be HTML-visible (SSR/SSG).

### Internal Linking & Multilingual Rules
- **Internal Linking:** Every page must link to 3-5 structurally related or temporally contiguous events to build tight topic clusters.
- **Multilingual SEO:** Hreflang tags must form a complete, bi-directional network. Arabic pages must utilize appropriate RTL mechanics and localized slug transliterations where applicable.

### Duplicate-Content Prevention Rules
- Slugs must be deterministically generated.
- Overlapping intent pages must be consolidated or strictly canonicalized to the primary `/how-many-days-until-<slug>/` path.

## 4. Strict Rejection Criteria
The agent must actively reject and flag any page, PR, or generation script that demonstrates:
- **Thin Generic Filler:** Content populated by repetitive boilerplate instead of event-specific utility.
- **Duplicate URL Families:** Any attempt to spawn parallel URL structures for the same intent.
- **Missing Schema:** Omission of `JSON-LD` schemas on core pages.
- **Untranslated SEO Blocks:** Presenting English meta tags, FAQs, or boilerplate on non-English locales.
- **Runtime-Only Text:** Important SEO text or dates that rely entirely on client-side JS to render and are invisible in the initial HTML payload.
