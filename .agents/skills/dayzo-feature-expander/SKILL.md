---
name: expanding-dayzo-features
description: The agent consults this skill when evaluating, approving, rejecting, scoping, or extending any new Dayzo feature, tool, page type, route family, integration, user flow, or product expansion before implementation begins.
---

# Dayzo Feature Expander

This skill acts as the strategic product evaluation layer for Dayzo. Before any new feature, page, routing structure, or interactive tool is built, the agent must consult this skill to evaluate architectural fit, brand alignment, and potential SEO downstream impacts. Do not begin implementation without passing this gate.

## 1. Core Evaluation Directives
- **Evaluate First, Code Later:** Never immediately write code for new broad features without scoping the implications against this set of rules.
- **Minimalist Defense:** Does this feature add unnecessary complexity? Challenge the assumption that more features equal a better product.
- **Architectural Preservation:** Features must cleanly fit into Dayzo's static-first, highly cacheable edge architecture.

## 2. Idea Evaluation & Approval

### Idea Evaluation Checklist
- Does this feature directly solve a user need related to countdowns, time discovery, or event tracking?
- Is this feature purely client-side or heavily relying on the core data files? (Preference to client-side/edge logic).
- Can this feature scale effortlessly across all supported i18n locales?
- Are the maintenance overheads (e.g., maintaining new `.json` structures) acceptable?

### Acceptance Criteria
- Strictly aligns with the minimal, premium Dayzo brand identity.
- Operates flawlessly in Auto TV or Live modes if it belongs on a presentation view.
- Requires no heavy backend orchestration or complex relational database states.
- Fully supports SSR/SSG rendering mechanisms and preserves core web vitals.

### Rejection Criteria
The agent must aggressively reject features that:
- Break the static-first architecture.
- Require unnecessary backend complexity or user-authentication overheads.
- Conflict visually or philosophically with the Dayzo brand guidelines (`guarding-dayzo-brand`).
- Create duplicate or competing SEO route families.
- Attempt to bypass QA (`validating-dayzo-quality`).

## 3. Implementation Impact Checklists

Before authorizing the build phase, review the impacts across the entire Dayzo ecosystem:

### Routing Impact Review
- Will this feature introduce new dynamic routes?
- Do the new routes shadow or conflict with the universal `/<lang>/how-many-days-until-<slug>/` schema?
- Are trailing slashes handled consistently?

### Dataset Impact Review
- Does this feature require mutations to the core `events_*.json` datasets?
- Are the new fields strictly backwards-compatible with older parsing logic?

### i18n Impact Review
- How many new dictionary keys will this feature introduce?
- Does the UI layout for this feature cleanly mirror for RTL (Arabic) users using logical flex and margin properties?

### SEO Impact Review
- Will this feature trap critical text inside client-side React/Vue state that search engines might struggle to parse?
- Does it require a new JSON-LD schema block? If so, is the schema explicitly documented?
- Does this feature degrade Time to First Byte (TTFB) or Core Web Vitals?

### Quality Gate Handoff
- Upon approval and scoping, the implementation MUST explicitly define the testing requirements that will be handed off to the `validating-dayzo-quality` skill upon completion.
