# Vercel Deployment Checklist

1. **Environment setup**
   - Confirm required environment variables are defined in the Vercel project (Production and Preview) and match local `.env` expectations.
   - Verify any third-party keys are scoped to the correct domains.

2. **Build configuration**
   - Ensure the `next.config.mjs` settings (including PWA or experimental flags) align with the deployment target.
   - Check the `vercel.json` routes and headers for accuracy after any page or API path changes.

3. **Static assets**
   - Confirm new assets are placed under `public/` and referenced with absolute paths.
   - Validate image sizes and formats to prevent unexpectedly large deployments.

4. **Testing & quality gates**
   - Run `npm test` and ensure all suites pass locally.
   - Run `npm run build` to confirm the production bundle completes without errors.
   - Address ESLint findings via `npm run lint` when applicable.

5. **Performance considerations**
   - Audit lighthouse metrics locally or with Vercel preview for significant UI changes.
   - Ensure code-splitting and dynamic imports remain effective after feature additions.

6. **Observability**
   - Validate logging and monitoring hooks still trigger (e.g., analytics or error tracking) in Preview.
   - Confirm custom error pages (`error.tsx`, `not-found.tsx`) render as expected.

7. **Launch validation**
   - Smoke-test key flows on the Vercel Preview deployment before promoting to Production.
   - Verify redirects, rewrites, and caching headers behave correctly across routes.
   - Confirm PWA manifest updates (if any) are reflected and icons load correctly.
