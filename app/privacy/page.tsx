import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KEYVILLE · Project by ETL GIS Consulting LLC | Privacy',
  description: 'Data handling, retention, and student PII boundaries for KEYVILLE.'
};

export default function PrivacyPage() {
  return (
    <div>
      <h1>Privacy</h1>
      <p className="small">Data minimization, retention, and PII boundaries designed for districts.</p>

      <Section title="Data minimization">
        <div className="card">
          <ul role="list" style={{ paddingLeft: '1rem' }}>
            <li>Only roster IDs, grade level, and initials for students in production.</li>
            <li>Sandbox uses anonymized demo data with no PII collection.</li>
            <li>Telemetry is aggregated; no student-level analytics in the sandbox.</li>
          </ul>
        </div>
      </Section>

      <Section title="Retention and deletion">
        <div className="card">
          <p className="small">Data retention defaults to 12 months for pilots, customizable per district.</p>
          <p className="small">Deletion requests honored within 7 days with audit logs for administrators.</p>
        </div>
      </Section>

      <Section title="Family rights">
        <div className="card">
          <p className="small">FERPA-aligned access and correction workflows, with exportable records for families.</p>
        </div>
      </Section>

      <CTAButton href="/security" variant="secondary">
        Review security posture
      </CTAButton>
    </div>
  );
}
