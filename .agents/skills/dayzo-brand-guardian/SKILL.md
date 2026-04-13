---
name: guarding-dayzo-brand
description: The agent consults this skill when creating, updating, reviewing, or expanding any Dayzo page, component, template, layout, or generated asset that must follow the project’s brand direction, visual consistency rules, and display behavior across homepage, SEO pages, live mode, TV mode, embed mode, and multilingual interfaces.
---

# Dayzo Brand Guardian

This skill enforces the Dayzo brand system across all user interfaces, templates, generated assets, and presentation modes. The executing agent must strictly follow these rules to maintain a minimal, modern, tech, premium, and simple aesthetic.

## 1. Core Visual Identity

### Color Palette
- **Primary:** `#6C4CF1`
- **Hover/Dark:** `#4B32C3`
- **Accent/Light:** `#F3F0FF`
- **Core App Backgrounds:** Clean white or very light gray.
- **Display Mode Backgrounds (Live/TV):** Immersive dark backgrounds.

### Typography & Structure
- **Global Font:** Simple sans-serif similar to Inter.
- **Countdown Stylings:** Must use rounded digits.
- **Spacing:** Enforce extensive whitespace to prevent clutter.

### Display & Branding Persistence
- **Live Mode, TV Mode, and EmBed Mode:**
  - Dayzo branding must remain visible.
  - In shareable contexts, the logo/wordmark and domain visibility are strictly required.

## 2. Layout & Display Rules

### Component Consistency
- **Hero Layout:** Must remain visually balanced, emphasizing the core countdown or CTA heavily with clear space.
- **Card Styling:** Maintain unified border radiuses, padding, and subtle shadows or border colors matching the brand identity.
- **Template Previews:** Keep consistent aspect ratios and predictable layouts across all preview galleries.

### Hierarchy & Rhythm
- **Countdown Sizing Hierarchy:** Always visually prioritize the countdown timer above secondary metadata.
- **Spacing and Visual Rhythm:** Use a standardized spacing system (e.g., factors of 8px or 4px) to ensure predictable component rhythm.

### Experience Cleanliness (Live & TV Modes)
- **TV Mode Cleanliness:** No clutter. Hide non-essential UI elements like navigation, footers, or complex settings.
- **Safe-Area Rules:** Countdown overlays on full-screen backgrounds must remain within the center safe-area to avoid edge cutoffs on external displays. Ensure high contrast against the background.
- **QR Placement:** QR codes must be placed in secondary focal areas (e.g., corners) and scaled appropriately for distant scanning without stealing focus from the countdown.

### Multilingual Resilience
- **Arabic RTL Visual Consistency:** All interfaces must mirror correctly for RTL layouts without breaking alignment, padding, or typography spacing.
- **Container Flexibility:** Ensure containers adapt seamlessly to varying text lengths common in translation.

## 3. Strict Rejection Criteria
The agent must aggressively reject and correct:
- **Off-Brand Colors:** Any use of colors outside the defined palette.
- **Overcrowded Sections:** Layouts that lack sufficient whitespace or present too much information at once.
- **Inconsistent Countdown Styles:** Mixed font faces or square unrounded digits for countdown values.
- **Hidden Branding:** Missing logos, wordmarks, or domains in shareable, embedded, or presentation contexts.
- **Incoherent Imagery:** Random image styles that clash with Dayzo's premium aesthetic.
- **Busy Backgrounds:** Template or live-mode backgrounds that interfere with core countdown readability.

## 4. Execution Checklists

### Review Checklist
- Check if the primary color `#6C4CF1` is applied correctly.
- Check if hover states use `#4B32C3` and accents use `#F3F0FF`.
- Check if core interaction views have light backgrounds and display views (Live/TV) have dark/immersive backgrounds.
- Check if typography is clean sans-serif with rounded countdown digits.
- Check if Dayzo branding and domain are clearly visible in shareable/Live modes.

### Visual QA Checklist
- **Whitespace:** Does the layout feel breathable and uncluttered?
- **Hierarchy:** Is the countdown the absolute most prominent element?
- **RTL Support:** Have Arabic translations been tested for correct alignment and flow?
- **Legibility:** Is the countdown perfectly readable against any selected template background?
- **TV Output:** Are all menus and non-essential inputs completely hidden in TV Mode?

## 5. Guidance for Generated Template Assets
- **Backgrounds:** Must support overlays. Use gradients or images that allow for high-contrast text layering.
- **Theming:** Generated template variations must respect the core readable safe-areas for countdowns. Focus should be drawn to the center or defined focal point.
- **Simplicity:** Do not overcomplicate generated designs. Keep visual elements clean, ensuring the countdown remains the hero.
