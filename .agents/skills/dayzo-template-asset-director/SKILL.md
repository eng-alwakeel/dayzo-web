---
name: directing-dayzo-template-assets
description: The agent consults this skill when creating, updating, reviewing, or expanding Dayzo countdown templates, preview assets, generated backgrounds, visual packs, and image-generation instructions for live mode, TV mode, or multilingual template presentation.
---

# Dayzo Template & Asset Director

This skill governs the visual direction, composition, and generation logic for all Dayzo templates and background assets. It ensures that any imagery supporting the countdowns remains premium, readable, and perfectly aligned with the Dayzo brand identity.

## 1. Composition & Safe Area Rules

- **The Center Safe Area:** The dead center of the screen (typically covering the middle 50% of the viewport) is strictly reserved for the countdown timer and primary text. 
- **No Busy Compositions:** Backgrounds must be clear, dark, graded, or blurred within the Safe Area to ensure absolute text legibility.
- **QR & Branding Protection:** Asset compositions must avoid heavy contrasting elements in the corners (padding boundaries) where the QR code and Dayzo watermark are rendered.

## 2. Asset Generation & Storage Directives

### Naming Conventions & Paths
- Templates must be stored logically, e.g., `/public/templates/<template-theme>/`
- Naming must format specifically: `<theme-name>-<asset-type>.<ext>`
  - Examples: `cyberpunk-bg-desktop.webp`, `cyberpunk-preview.webp`

### Required Asset Types per Template
For every complete template package, generation must yield:
1. **Background High-Res:** Optimized background image/video for Live Mode (e.g., `1920x1080` preferred, responsive).
2. **Preview Image:** A consistent `16:9` thumbnail representing the template for gallery/picker UI.
3. **Color Metadata:** JSON definitions (text color overrides) to ensure contrast against the background.

## 3. Visual & Thematic Rules

### Launch Template Set Guidelines
When expanding the default or launch templates, ensure varying aesthetics that all conform to the Dayzo brand constraint (Minimal, Premium, Tech):
- *Solid/Gradients:* Sleek, dark-mode biased gradients.
- *Abstract/Tech:* Geometric, glowing, or minimal wireframe.
- *Event Specific:* Festive visuals mapped to holidays strictly keeping the center blurred or muted.

### Color Harmony Rules
- Do not let backgrounds clash with the core UI colors. Use deep tones (dark purples, deep blacks, rich blues) that allow pure white or `#F3F0FF` text to pop.
- Generate overlays (`rgba(0,0,0, 0.4)`) dynamically via CSS if the raw asset is too bright.

### Live vs TV Visual Differences
- **Live Assets:** Can have subtle ambient animations or slightly more complex edge details.
- **TV Assets:** Emphasize extreme high-contrast. Assets on TV mode must expect varying display calibrations; default to darker backgrounds with glowing text.

### Preview Image Rules
- All preview assets MUST share the exact same aspect ratio.
- Preview assets should feature a "dummy" countdown rendered over them to demonstrate to the user exactly how their text will look.

## 4. Strict Rejection Criteria
The agent must proactively reject and refuse to merge or output visual assets exhibiting:
- **Inconsistent Art Styles:** Cartoony, low-quality, or chaotic imagery that breaks the premium brand feel.
- **Crowded Backgrounds:** Compositions with sharp, busy lines crossing directly through the center Safe Area.
- **Unreadable Overlays:** Templates failing W3C WCAG contrast ratios for the countdown text.
- **Broken Placements:** Assets that force the timer, QR code, or Dayzo logo to be hidden, clipped, or visually drowned out.
