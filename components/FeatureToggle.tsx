'use client';

import { useTransition } from 'react';

export function FeatureToggle({
  label,
  enabled,
  onToggle,
  'aria-label': ariaLabel = label
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  'aria-label'?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      data-state={enabled ? 'on' : 'off'}
      onClick={() => startTransition(onToggle)}
      className={`toggle ${enabled ? 'on' : 'off'}`}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="slider" />
    </button>
  );
}
