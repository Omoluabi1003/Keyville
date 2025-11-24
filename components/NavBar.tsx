'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routes } from '../lib/navigation';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="nav-shell" role="banner">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav aria-label="Primary navigation" style={{ padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" aria-label="Go to Keyville home" style={{ fontWeight: 800, letterSpacing: '0.02em' }}>
            Keyville
          </Link>
          <ul role="list">
            {routes.map((route) => {
              const active = pathname === route.href;
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={active ? 'active' : ''}
                    aria-current={active ? 'page' : undefined}
                  >
                    {route.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
