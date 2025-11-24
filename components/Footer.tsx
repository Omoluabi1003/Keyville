import Link from 'next/link';
import { routes } from '../lib/navigation';

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer-grid">
        <div>
          <h3>ETL GIS Consulting LLC</h3>
          <p className="small">
            Writing growth through playful practice, delivered as a trusted education product by ETL GIS Consulting LLC.
          </p>
        </div>
        <div>
          <h4>Sitemap</h4>
          <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.35rem' }}>
            {routes.map((route) => (
              <li key={route.href}>
                <Link href={route.href} aria-label={`Navigate to ${route.label}`}>
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Trust</h4>
          <p className="small">SIS-friendly exports, privacy-first analytics, SOC2-inspired controls, and clear SLAs.</p>
        </div>
      </div>
      <p className="small" style={{ marginTop: '1rem' }}>© {new Date().getFullYear()} ETL GIS Consulting LLC</p>
    </footer>
  );
}
