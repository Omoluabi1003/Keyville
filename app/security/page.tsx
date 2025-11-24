import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keyville by ETL GIS Consulting LLC | Security',
  description: 'Security posture, encryption, hosting, and district readiness.'
};

export default function SecurityPage() {
  return (
    <div>
      <h1>Security</h1>
      <p className="small">District-ready security posture with clear controls.</p>

      <Section title="Controls">
        <div className="card-grid">
          <div className="card">
            <h3>Encryption</h3>
            <p className="small">TLS 1.2+ in transit, AES-256 at rest, and regular key rotation.</p>
          </div>
          <div className="card">
            <h3>Hosting</h3>
            <p className="small">US-based data centers with redundancy and disaster recovery exercises.</p>
          </div>
          <div className="card">
            <h3>Access</h3>
            <p className="small">Least privilege, SSO for admins, and audit trails for exports.</p>
          </div>
        </div>
      </Section>

      <Section title="District readiness" subtitle="How we launch with governance in mind">
        <ul role="list" style={{ paddingLeft: '1rem' }}>
          <li>Privacy and security review packet with evidence</li>
          <li>Data sharing agreements signed before roster sync</li>
          <li>Support SLAs tuned for school hours</li>
        </ul>
      </Section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <CTAButton href="/pricing">Request pilot</CTAButton>
        <CTAButton href="/integrations" variant="secondary">
          View integrations
        </CTAButton>
      </div>
    </div>
  );
}
