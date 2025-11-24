# KEYVILLE — project by ETL GIS Consulting LLC

Multi-page Next.js web app for KEYVILLE, delivered as a project by ETL GIS Consulting LLC to showcase room-rotation writing practice, teacher workflows, and district readiness.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` to explore routes like `/experience`, `/students`, `/teacher`, `/pricing`, `/privacy`, and `/security`.

## Production build

```bash
npm run build
npm start
```

## Notes
- Uses the Next.js App Router with shared navigation, footer, and per-route metadata.
- Landing page links to a sandbox experience that demonstrates the room-rotation loop without authentication.
- Privacy-first analytics and accessibility affordances (skip links, focus states, ARIA labels) are included.
- Legacy static assets remain under `docs/` for reference.
