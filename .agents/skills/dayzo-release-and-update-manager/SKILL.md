---
name: releasing-and-updating-dayzo
description: The agent consults this skill when preparing, validating, documenting, deploying, promoting, or updating any Dayzo build on Vercel, including preview releases, production releases, environment configuration, multilingual rollout checks, regression review, rollback planning, changelog updates, and post-release verification.
---

# Dayzo Release & Update Manager

This skill governs the entire deployment lifecycle of the Dayzo application, specifically tuned for a Vercel-based workflow. It enforces strict separation between preview and production environments and requires rigorous QA and documentation discipline at every stage of a release.

## 1. The Vercel Deployment Model

- **Local Development:** Handled locally. Not subjected to this skill's final gate, but should be stable before pushing.
- **Preview Deployments (Validation):** Used as the primary staging environment. Production approval is strictly gated behind preview validation.
- **Production Deployments (Live):** Approved and promoted only after preview validation passes.
- **Environment Variables:** Must be explicitly verified per Vercel environment (Development, Preview, Production).
- **Deployment-Sensitive Changes:** Any change touching routing, caching, headers, or edge functions must be verified against Vercel's true environment behavior.

## 2. Release Stages & Checklists

### Stage 1: Pre-Release Validation (Local/Pre-Push)
Before pushing code that triggers a Vercel Preview build, verify:
- [ ] Homepage integrity.
- [ ] SEO page integrity.
- [ ] Live mode, TV mode, and Auto TV mode integrity.
- [ ] Language switching functionality.
- [ ] Hreflang and canonical configurations are intact.
- [ ] Countdown correctness (logic and math).
- [ ] QR, share, and embed behaviors are operational.
- [ ] No missing branding in shareable/display contexts.
- [ ] No broken routes (zero 404s on critical paths).
- [ ] No broken datasets (event slugs remain stable).
- [ ] No duplicate slugs.
- [ ] No untranslated critical UI content.
- [ ] No unverified environment assumptions.

### Stage 2: Preview Deployment Review
Once deployed to Vercel Preview, verify the live preview URL:
- [ ] Route rendering behaves identically to local.
- [ ] Static assets (fonts, images, backgrounds) load correctly from the CDN.
- [ ] JS hydration/execution acts predictably.
- [ ] Multilingual routing functions correctly under the deployed URL structure.
- [ ] Live mode query params and TV mode triggers function.
- [ ] SEO page rendering evaluates correctly for crawlers.
- [ ] Zero regressions identified from the previous stable preview.

### Stage 3: Production Release Readiness
Approve the merge to production ONLY if:
- [ ] Preview QA has completely passed.
- [ ] Critical path checklists are green.
- [ ] Release Notes have been prepared.
- [ ] Changelog is updated.
- [ ] Rollback checklist exists and is documented.
- [ ] Version tag/label is explicitly defined.
- [ ] Environment variables are confirmed 100% correct for the Production environment.
- [ ] Deployment-sensitive features (e.g., edge caching) are verified for production scale.

### Stage 4: Post-Release QA (Production Verification)
Immediately following a successful production deployment, verify on the live domain:
- [ ] Production homepage loads quickly and correctly.
- [ ] Representative pages across multiple languages load correctly.
- [ ] Representative SEO event pages render optimally.
- [ ] Complete one Live Mode interactive flow.
- [ ] Complete one TV Mode display flow.
- [ ] Complete one Embed widget generation and rendering flow.
- [ ] All assets and translations load correctly.
- [ ] Production-specific environment behavior (e.g., analytics, real APIs) is correct and active.

## 5. Update Management & Operations
For any update (small fixes, content/data changes, new features, visual updates):
- **Impact Assessment:** Define what areas of the platform this update touches.
- **Preview Validation:** Deploy the update to Preview and test the impacted surface area.
- **Regression Checklist:** Ensure core unaffected areas (like the homepage or SEO routing) did not break.
- **Changelog & Release Notes:** Update the documentation to reflect the changes.
- **Rollback Readiness:** Ensure a plan exists to revert the update.

## 6. Rollback Planning Checklist
Before a risky deployment or immediately upon detecting a critical production failure:
- [ ] Identify exactly what changed in the release.
- [ ] Identify what routes/features are currently broken.
- [ ] Define the safe reversion step (e.g., Revert Git Commit, or Vercel "Instant Rollback" to previous deployment).
- [ ] Identify which files, configs, or Vercel environment variables must be restored.
- [ ] Define the validation steps to confirm the rollback was successful.

## 7. Documentation Discipline

### Versioning
- **Requirement:** A clear version label (e.g., `v1.2.0`) or release identifier must group the changes.
- **Traceability:** Document the relationship between the Changelog, the Release Notes, and the specific Vercel deployment.

### Changelog Template
Maintain a concise summary of changes.
**Category of change:** `[Feature | Fix | SEO | i18n | Template | Data | Deployment]`
- **Summary:** Concise description of the change.
- **Affected Areas:** Which components/routes were touched.
- **Migration/Review Notes:** Any necessary cleanup or context for future developers.

### Release Notes Template
- **User Impact:** What users or operators should know.
- **Visible Changes:** What changed visually or behaviorally.
- **Risk Items:** Any points of watchfulness post-release (e.g., "Monitoring Edge function execution times").

## 8. Strict Rejection Criteria
Do NOT approve a deployment, release, or promotion if:
- Countdowns are mathematically or logically broken.
- Dayzo branding is missing in shareable, display, or embed contexts.
- SEO parameters (hreflang, canonicals) are broken.
- Language rollout is incomplete or presents untranslated strings on production routes.
- Datasets mutations break existing indexed slugs.
- Live/TV behavior has degraded or regressed in UX.
- Critical routes remain untested on the Preview environment.
- Environment variables or assumptions are unverified.
- **The preview deployment was bypassed entirely.**
