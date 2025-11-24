'use client';

import { useMemo, useState } from 'react';
import CTAButton from '../../components/CTAButton';
import Section from '../../components/Section';
import { sandboxChallenge } from '../../lib/navigation';

const avatars = ['Skyline Fox', 'River Lantern', 'Cipher Owl', 'North Star'];

export default function ExperienceSandbox() {
  const [codename, setCodename] = useState('Skyline Fox');
  const [response, setResponse] = useState('');
  const [step, setStep] = useState<'codename' | 'challenge' | 'feedback'>('codename');

  const randomPrompt = useMemo(() => sandboxChallenge, []);

  const completed = step === 'feedback';

  return (
    <div>
      <Section title="Step 1" subtitle="Choose a codename or avatar" id="step-1">
        <div className="card-grid">
          {avatars.map((name) => (
            <label key={name} style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="codename"
                value={name}
                checked={codename === name}
                onChange={() => setCodename(name)}
                aria-label={`Choose codename ${name}`}
              />
              <p style={{ marginTop: '0.35rem' }}>{name}</p>
            </label>
          ))}
        </div>
        <CTAButton href="#step-2" ariaLabel="Proceed to micro-challenge" variant="secondary">
          Save codename
        </CTAButton>
      </Section>

      <Section title="Step 2" subtitle="Play one room rotation micro-challenge" id="step-2">
        <div className="card">
          <p className="small">Prompt</p>
          <p>{randomPrompt.prompt}</p>
          <div className="alert" aria-live="polite">
            <strong>Scaffolds:</strong> {randomPrompt.scaffolds.join(' • ')}
          </div>
          <label htmlFor="response" style={{ marginTop: '1rem' }}>
            Your rewrite as {codename}
          </label>
          <textarea
            id="response"
            rows={4}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            aria-label="Enter your rewritten sentence"
            placeholder={randomPrompt.sampleResponse}
          />
          <button
            className="button"
            style={{ marginTop: '0.75rem' }}
            onClick={() => setStep('feedback')}
            aria-label="Submit response and view AI feedback"
          >
            Submit and view AI feedback
          </button>
        </div>
      </Section>

      <Section title="Step 3" subtitle="AI feedback + telemetry snapshot" id="step-3">
        <div className="card" aria-live="polite">
          <p className="small">AI feedback</p>
          <ul role="list" style={{ paddingLeft: '1rem' }}>
            {randomPrompt.aiFeedback.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="small">Next step: {randomPrompt.aiFeedback.nextStep}</p>
          {completed ? (
            <p className="badge" aria-label="Submission received">
              Submission saved for demo user {codename}
            </p>
          ) : (
            <p className="small">Complete step 2 to preview how students receive feedback.</p>
          )}

          <table className="table" aria-label="Telemetry snapshot">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Value</th>
                <th scope="col">Benchmark</th>
              </tr>
            </thead>
            <tbody>
              {randomPrompt.telemetry.map((row) => (
                <tr key={row.metric}>
                  <td>{row.metric}</td>
                  <td>{row.value}</td>
                  <td>{row.benchmark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <CTAButton href="/teacher" ariaLabel="View teacher view of telemetry">
            View teacher dashboard
          </CTAButton>
          <CTAButton href="/pricing" variant="secondary">
            Request a pilot
          </CTAButton>
        </div>
      </Section>
    </div>
  );
}
