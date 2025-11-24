'use client';

import Link from 'next/link';
import { useAnalytics } from '../lib/analytics';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

type CTAButtonProps = PropsWithChildren<{
  href: string;
  variant?: 'primary' | 'secondary';
  ariaLabel?: string;
}>;

export default function CTAButton({ href, children, variant = 'primary', ariaLabel }: CTAButtonProps) {
  const { track } = useAnalytics();
  const pathname = usePathname();

  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? `Navigate to ${href}`}
      className={`button ${variant === 'secondary' ? 'secondary' : ''}`}
      onClick={() => track('cta_click', { href, from: pathname ?? '/' })}
    >
      {children}
    </Link>
  );
}
