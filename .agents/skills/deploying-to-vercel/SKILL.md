---
name: deploying-to-vercel
description: The agent consults this skill when deploying projects to Vercel, managing preview and production environments, configuring domain settings, updating environment variables, handling rollbacks, and ensuring robust CI/CD deployment pipelines.
---

# Vercel Deployment Manager

This skill governs the deployment lifecycle of projects hosted on Vercel. It provides strict guidelines for utilizing the Vercel platform, distinguishing between preview and production environments, and ensuring secure and reliable application delivery.

## 1. Core Deployment Philosophy
- **Immutability First:** Every deployment is an immutable snapshot. Rely on unique deployment URLs for testing before alias promotion.
- **Preview Before Production:** Never push directly to a production entry point without validating changes in a generated Preview environment first.
- **Environment Isolation:** Maintain strict separation of environment variables between Development, Preview, and Production.

## 2. Vercel CLI Usage & Commands
Use the Vercel CLI (`vercel` or `vc`) for explicit control over deployments when CI/CD isn't automatically handling it.

### Standard Commands
```bash
# Link local directory to a Vercel project
vercel link

# Pull environment variables for local development
vercel env pull .env.local

# Deploy to Preview environment
vercel

# Deploy to Production environment
vercel --prod
```

### Execution Constraints
- Always use `vercel env pull` before running local development servers to ensure parity with the target environment.
- Treat the Vercel Dashboard as the ultimate source of truth for environment variable configurations.

## 3. Environment Variables Strategy
- **Production Variables:** Only attach sensitive production APIs, keys, and database URIs to the Production environment.
- **Preview Variables:** Use sandbox, staging, or mock API keys for the Preview environment to prevent test data from polluting production systems.
- **System Environment Variables:** Be aware that Vercel injects system variables (e.g., `VERCEL_URL`, `VERCEL_ENV`). Leverage these programmatically to detect the current runtime environment.

## 4. Deployment Checklists

### Pre-Deployment Checklist
- [ ] Are all necessary environment variables defined in the Vercel Dashboard for the target environment?
- [ ] Have build commands (`npm run build`) and output directories been verified?
- [ ] Are there any uncommitted changes that should be included in the deployment?

### Preview Deployment Validation
- [ ] Does the preview build succeed without errors?
- [ ] Are dynamic routes and static assets correctly resolving?
- [ ] Is the performance acceptable and free of obvious regressions?

### Production Promotion
- [ ] Has the Preview deployment been fully QA'd and approved?
- [ ] Is the production environment perfectly aligned with the tested preview state?

## 5. Rollback & Troubleshooting Procedures
- **Instant Rollbacks:** In the event of a critical production failure, immediately revert the traffic assignment to a previously known-good deployment via the Vercel Dashboard or CLI.
- **Checking Logs:** Always inspect the Runtime Logs and Build Logs provided by Vercel to diagnose SSR crashes, edge function timeouts, or build failures.
- **Cache Invalidation:** If static assets or ISR (Incremental Static Regeneration) content is stale, trigger a redeployment or utilize Vercel's data cache invalidation strategies as applicable to the framework in use.
