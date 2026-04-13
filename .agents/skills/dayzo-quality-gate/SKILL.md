---
name: validating-dayzo-quality
description: The agent consults this skill when reviewing, validating, or quality-checking any Dayzo change before acceptance, release, or merge, including new pages, features, templates, event data, language additions, live mode behavior, TV mode behavior, and SEO-critical updates.
---

# Dayzo Quality Gate

This skill serves as the comprehensive quality assurance (QA) and validation gate for all work within the Dayzo project. It enforces stringent checks to ensure high reliability, consistency, and correctness across functionality, visual display, localization, and SEO. Use this skill as the mandatory final step before considering any change, feature, or release candidate complete.

## 1. Core Validation Principles

As the QA gatekeeper, you must strictly uphold these validation tenets:
- **Visual Consistency:** Ensure adherence to the Dayzo brand guidelines (see `guarding-dayzo-brand` skill).
- **Functional Correctness:** All interactive elements must work as intended without errors.
- **Countdown Correctness:** Timers must accurately reflect the target time and handle "next occurrence" logic flawlessly.
- **Responsive Behavior:** Layouts must perform perfectly across mobile, tablet, desktop, and large displays (TV mode).
- **Multilingual Integrity:** Translations must be complete, and RTL (Arabic) layouts must be flawless.
- **SEO Integrity:** Meta tags, canonicals, hreflang, and schemas must be perfectly formed.
- **Routing Consistency:** URLs must follow expected patterns. No duplicate slugs, duplicate page families, or orphaned pages.
- **State Resilience:** No blank countdown states; fallback or zero-states must be graceful.
- **Sharing & Contexts:** No broken share, QR, or embed implementations.

## 2. Mandatory QA Checklists

### Homepage QA
- Check that all featured countdowns render correctly.
- Verify clear spacing and layout without card overflow or clipped content.
- Ensure language switching works without breaking the current state.

### SEO Page QA
- Check for `missing canonical` tags.
- Check for `missing hreflang` tags corresponding to all supported locales.
- Ensure `invalid schema blocks` are absent (e.g., proper JSON-LD Event/SoftwareApplication schemas).
- Verify the exact countdown logic renders correctly for the specific SEO topic.

### Live Mode QA
- Verify the immersive dark background applies correctly.
- Check that `missing Dayzo branding in shareable/display views` does not occur.
- Test that the countdown remains the central, prominent feature.
- Ensure `missing QR` issues are resolved; QR code must be visible and scannable.

### TV Mode & Auto TV Mode QA
- Validate that all navigation, footer, and non-essential UI elements are completely hidden.
- Verify the layout remains centered and respects safe-area constraints on large disparate displays.
- For Auto TV Mode, confirm the behavior triggers reliably after the configured idle time.

### Create-Live QA
- Test the form inputs for proper validation.
- Verify that `broken query-param rendering` does not occur upon submission or preview.
- Ensure the newly created dynamic live countdown behaves identically to static SEO pages.

### Embed QA
- Verify that the embedded widget loads securely and scales within its parent container (`iframe` responsiveness).
- Check that branding remains intact and clearly links back to Dayzo.
- Ensure `broken share, QR, or embed behavior` is entirely squashed.

### i18n (Localization & RTL) QA
- Check for `layout breakage in Arabic RTL`, particularly around grids, margins, and icons.
- Ensure `broken language switching` does not occur.
- Verify container flexibility prevents text clipping in languages with longer strings.

### Dataset QA
- Verify event datasets have correct timezone mappings.
- Ensure logic for recurring events does not compute a `wrong next occurrence logic`.
- Detect and prevent `broken countdowns` resulting from malformed timestamp inputs.

### Performance QA
- Ensure images and scripts are optimized.
- Verify minimal layout shifts during countdown ticketing.

## 3. Explicit Defect Checks
During validation, explicitly hunt for and reject changes causing:
- Broken countdowns.
- Wrong next occurrence logic.
- Missing `hreflang`.
- Missing `canonical` tags.
- Missing QR codes in display views.
- Missing Dayzo branding in shareable/display views.
- Layout breakage in Arabic RTL.
- Card overflow or clipped content.
- Broken language switching.
- Broken query-param rendering.
- Duplicate slugs or page families.
- Orphaned pages.
- Invalid schema blocks.

## 4. Execution Workflow

When utilizing this QA skill, adhere strictly to the following execution sequence:

1. **Plan:** Identify the scope of the change and select the corresponding mandatory checklists.
2. **Verify:** Perform the checks systematically to detect any issues before even considering approval.
3. **Execute:** Document all defects found. Focus on root-cause-oriented problem handling rather than superficial patches.

**Rule:** Absolutely no assumption-based approval. If you cannot explicitly verify a checklist item behaves correctly, it fails validation.
