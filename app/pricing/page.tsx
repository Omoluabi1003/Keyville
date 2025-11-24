import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import type { Metadata } from 'next';
import { buildMetadata } from '../../lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Keyville | Pricing',
  description: 'Pilot tiers and district rollout narrative for Keyville.',
  path: '/pricing'
});

const tiers = [
  {
    name: 'Pilot',
    price: 'District-funded',
    details: ['Up to 3 schools', 'Sandbox + classroom mode', 'Export coaching + office hours'],
    cta: 'Request pilot'
  },
  {
    name: 'Launch',
    price: 'Per-student annual',
    details: ['SSO + roster sync', 'Dedicated SLA', 'Teacher onboarding sessions'],
    cta: 'Talk to sales'
  },
  {
    name: 'Scale',
    price: 'Custom',
    details: ['Multi-year discounts', 'Data sharing agreements', 'District-wide observability'],
    cta: 'Design rollout'
  }
];

export default function PricingPage() {
  return (
    <div>
      <h1>Pricing</h1>
      <p className="small">Narratives that make pilots stick and scale smoothly.</p>

      <div className="card-grid">
        {tiers.map((tier) => (
          <div className="card" key={tier.name}>
            <h3>{tier.name}</h3>
            <p className="badge">{tier.price}</p>
            <ul role="list" style={{ paddingLeft: '1rem' }}>
              {tier.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <CTAButton href="/about" variant="secondary" ariaLabel={`${tier.cta} for ${tier.name}`}>
              {tier.cta}
            </CTAButton>
          </div>
        ))}
      </div>

      <Section title="Pilot narrative" subtitle="How we prove value in weeks">
        <div className="card">
          <p>Week-by-week cadence with check-ins, exports, and student reflection surveys.</p>
          <div className="timeline">
            <div className="timeline-item">
              <h4>Week 1: Launch</h4>
              <p className="small">Roster sync, sandbox training, accessibility checks.</p>
            </div>
            <div className="timeline-item">
              <h4>Week 2: First rotations</h4>
              <p className="small">Collect telemetry, share AI feedback exemplars.</p>
            </div>
            <div className="timeline-item">
              <h4>Week 3: Evidence</h4>
              <p className="small">Exports for admins + PLC-ready slides.</p>
            </div>
          </div>
        </div>
      </Section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <CTAButton href="/teacher">View teacher workflows</CTAButton>
        <CTAButton href="/integrations" variant="secondary">
          Check integrations
        </CTAButton>
      </div>
    </div>
  );
}
