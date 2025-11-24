import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';
import { brand } from '../../lib/navigation';

export const metadata: Metadata = {
  title: `${brand.appName} — project by ${brand.organization} | Integrations`,
  description: 'SSO, roster sync, and API overview for quick district onboarding.'
};

export default function IntegrationsPage() {
  return (
    <div>
      <h1>{brand.appName} integrations</h1>
      <p className="small">SSO, roster sync, and API endpoints designed to be privacy-first and fast to launch.</p>

      <Section title="Identity" subtitle="SSO options that respect district boundaries">
        <div className="card-grid">
          <div className="card">
            <h3>Google & Microsoft SSO</h3>
            <p className="small">Scoped permissions to roster basics; no student inbox access required.</p>
          </div>
          <div className="card">
            <h3>Clever & ClassLink</h3>
            <p className="small">Rosters sync nightly with on-demand refresh during pilots.</p>
          </div>
          <div className="card">
            <h3>Custom SAML</h3>
            <p className="small">District-managed IdP with signed metadata and quick validation.</p>
          </div>
        </div>
      </Section>

      <Section title="APIs" subtitle="Lightweight endpoints for exports and telemetry">
        <ul role="list" style={{ paddingLeft: '1rem' }}>
          <li>Progress: room completion, rubric alignment, stamina metrics</li>
          <li>Telemetry: anonymous sandbox usage for product research</li>
          <li>Exports: CSV + JSON for SIS and LMS imports</li>
        </ul>
      </Section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <CTAButton href="/pricing">Request pilot access</CTAButton>
        <CTAButton href="/security" variant="secondary">
          Review security posture
        </CTAButton>
      </div>
    </div>
  );
}
