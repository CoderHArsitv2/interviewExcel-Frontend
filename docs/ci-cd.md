# Frontend CI/CD

## What Each Workflow Does
- `frontend-ci.yml`: installs dependencies, runs ESLint, builds the app, then runs TypeScript checks.
- `frontend-staging-deploy.yml`: automatically deploys `main` to a Vercel preview environment after CI passes and smoke-tests the preview URL.
- `frontend-prod-deploy.yml`: manual production deploy. It verifies the production backend is healthy, then deploys to Vercel production and smoke-tests the site.

## Why Build Runs Before Typecheck
- This project includes `.next/types/**/*.ts` in `tsconfig.json`.
- `next build` generates those route types, so CI builds first and then runs `tsc --noEmit`.

## GitHub Secrets To Create
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `PRODUCTION_BACKEND_HEALTHCHECK_URL`

## Vercel Setup
- Connect this repo to your Vercel project.
- Configure preview environment variables in Vercel for staging values, especially `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- Configure production environment variables in Vercel for production values.
- Keep Vercel Git auto-deploy disabled if you want GitHub Actions to be the single deployment path.

## Recommended Environment Values
- Preview: `NEXT_PUBLIC_API_URL` should point at your Render staging backend.
- Production: `NEXT_PUBLIC_API_URL` should point at your AWS App Runner production backend.

## Rollback Path
- Vercel: promote a previous deployment from the Vercel dashboard or CLI.
- Backend dependency: if frontend is healthy but API calls fail, validate the backend health URL and env values before redeploying the frontend.
