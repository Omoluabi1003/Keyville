'use client';

import { useEffect, useMemo, useState } from 'react';
import { brand } from '../lib/navigation';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const isStandalone = () => mediaQuery.matches || (navigator as unknown as { standalone?: boolean }).standalone;

    const handleDisplayChange = (event: MediaQueryListEvent) => {
      setIsInstalled(event.matches);
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
    };

    setIsInstalled(isStandalone());

    mediaQuery.addEventListener('change', handleDisplayChange);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installAvailable = useMemo(() => Boolean(installEvent), [installEvent]);

  const handleInstallClick = async () => {
    if (!installEvent) {
      setShowGuide(true);
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }

    setInstallEvent(null);
  };

  if (isInstalled) {
    return null;
  }

  return (
    <aside className="install-banner" aria-label="Install KEYVILLE prompt">
      <div>
        <p className="badge" style={{ marginBottom: '0.5rem' }}>
          {brand.appName} PWA ready
        </p>
        <h3>Install {brand.appName} to keep quests close</h3>
        <p className="small">
          {brand.appName} is a project by {brand.organization}. Install it like an app for quick access, offline support, and a
          focused writing workspace.
        </p>
        <div className="install-actions">
          <button className="button" onClick={handleInstallClick} aria-label={`Install ${brand.appName}`}>
            {installAvailable ? 'Install app' : 'See how to install'}
          </button>
          <button
            className="button secondary"
            onClick={() => setShowGuide((prev) => !prev)}
            aria-label="Show manual install steps"
          >
            {showGuide ? 'Hide steps' : 'Manual steps'}
          </button>
        </div>
        {showGuide ? (
          <div className="install-guide" role="note">
            <p className="small" style={{ marginBottom: '0.5rem' }}>
              On Chrome or Edge: open the browser menu and pick “Install app.” On iOS Safari: tap the share icon and choose
              “Add to Home Screen.”
            </p>
            <p className="microcopy">The prompt appears automatically when your browser confirms PWA support.</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
