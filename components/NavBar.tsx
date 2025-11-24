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
          <Link
            href="/"
            aria-label="Go to the KEYVILLE home page (project by ETL GIS Consulting LLC)"
            className="brand-mark"
          >
            <span className="brand-primary">KEYVILLE</span>
            <span className="brand-subtitle">A project by ETL GIS Consulting LLC</span>
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
