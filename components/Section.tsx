import { PropsWithChildren } from 'react';

type SectionProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  id?: string;
}>;

export default function Section({ title, subtitle, children, id }: SectionProps) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-heading` : undefined} style={{ margin: '2rem 0' }}>
      <div className="badge" id={id ? `${id}-heading` : undefined}>
        <span>{title}</span>
      </div>
      {subtitle && <p className="small" style={{ marginTop: '0.35rem' }}>{subtitle}</p>}
      <div style={{ marginTop: '1rem' }}>{children}</div>
    </section>
  );
}
