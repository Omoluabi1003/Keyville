import CTAButton from '../components/CTAButton';

export default function NotFound() {
  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h1>Page not found</h1>
      <p className="small">The path you requested does not exist. Try one of our guided journeys instead.</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <CTAButton href="/">Return home</CTAButton>
        <CTAButton href="/experience" variant="secondary">
          Launch sandbox
        </CTAButton>
      </div>
    </div>
  );
}
