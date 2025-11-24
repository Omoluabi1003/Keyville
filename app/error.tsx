'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ padding: '2rem' }}>
        <div className="card" role="alert" aria-live="assertive">
          <h1>Something went wrong</h1>
          <p className="small">{error.message}</p>
          <button className="button" onClick={() => reset()} aria-label="Reload page">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
