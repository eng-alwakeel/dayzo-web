---
name: building-dayzo-live-tv
description: The agent consults this skill when creating, updating, reviewing, or expanding Dayzo live pages, TV mode pages, auto TV mode behavior, countdown display states, final 10-second interactions, QR placement, branding visibility, or display-focused event experiences.
---

# Dayzo Live & TV Builder

This skill governs the creation, UX constraints, and behavior of Dayzo's display-focused experiences: Live Mode, TV Mode, and Auto TV Mode. These views are the public, high-visibility, shareable face of countdowns and must be executed flawlessly to act as growth loops while maintaining robust usability.

## 1. Core Operating Principles
- **Live Mode is Interactive & Share-First:** It is immersive but remains usable, exposing features like sharing, templates, and links without cluttering the primary countdown.
- **TV Mode is Extremely Clean:** It strips away all interactable UI, focusing 100% on the countdown for distant viewing.
- **Final 10-Second Mode is Exclusive:** Cinematic final-second transitions occur ONLY in Live Mode.
- **Branding & Growth Elements are Sacred:** QR codes and output branding must never be obscured.

## 2. Rendering Rules

### Live Page Rendering Rules
Live Mode must support and render:
- The exact countdown Title and Target Date.
- Custom/Selected Background (Image, Video, or Template).
- Custom Logo Uploads (if provided).
- Optional CTA Button and defined Link.
- The Live Page must be explicitly share-first; easily shareable via native APIs or links.

### TV Page Rendering Rules
- **Remove All Clutter:** Hide navigation, footers, CTAs, editing tools, and secondary text.
- **Focus:** The countdown timer must dominate the landscape view.
- **Branding Persistence:** Do not remove the Dayzo wordmark/logo.

### Auto TV Mode Rules
- Auto TV Mode applies ONLY on Live Pages.
- Triggered specifically when a user rotates to mobile or tablet landscape.
- **No Hard Redirect:** Entering landscape should visually transition the DOM to a TV-mode state using CSS or state changes (e.g., hiding UI wrappers); do not default to a hard page redirect to a `/tv` slug.

### Final 10-Second Behavior
- The final 10 seconds of a countdown trigger a distinct, high-tension visual state (e.g., pulsing, enlarging, or focus-shifting).
- This behavior happens ONLY within Live Mode (and TV Mode). Do not execute cinematic countdown takeovers on standard SEO pages or the Homepage.

## 3. Placement & Visibility Rules

### QR Placement Rules
- A QR code linking to the specific countdown MUST remain visible in Live and TV Modes.
- Place it strategically in a corner or tertiary focal area where it does not compete with the main timer digits but remains scannable from a distance.

### Branding Placement Rules
- Dayzo branding (watermark, logo, or `powered by Dayzo`) MUST remain plainly visible in all Live and TV contexts to ensure the viral growth loop.

### CTA & Video Handling Rules
- **CTA Visibility:** In Live Mode, the CTA should be prominent but positioned beneath or beside the primary timer to not obscure logic. Hide the CTA entirely in TV Mode.
- **Video Backgrounds:** Livestreams or video backgrounds must auto-play silently (where browser policies permit) and sit strictly behind the content z-index layer. Fallback images must be provided.

## 4. Strict Rejection Criteria
The agent must aggressively reject and refuse to generate or approve code that results in:
- **Missing QR:** Removing or breaking the QR code component in shareable/display contexts.
- **Hidden Branding:** Obscuring or deleting the Dayzo brand mark in Live Mode, TV Mode, or embeds.
- **Cluttered TV Mode:** Leaving interactive menus, settings, or sharing modals visible when the system should be cleanly displaying the TV state.
- **Errant Final Countdowns:** Applying the "Final 10-Second" dramatic UI takeover on general SEO pages, which disrupts standard web consumption.
- **Non-Shareable Live Pages:** Building a Live Page experience that lacks prominent, immediate share functionality.
