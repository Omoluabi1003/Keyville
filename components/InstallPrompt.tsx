'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt: () => Promise<void>;
};

const DISMISS_KEY = 'keyville-install-dismissed';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const alreadyInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsInstalled(Boolean(alreadyInstalled));

    const dismissed = window.localStorage.getItem(DISMISS_KEY) === 'true';

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      if (dismissed) return;
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (!deferredPrompt || !isVisible || isInstalled) return null;

  const handleInstall = async () => {
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
    } finally {
      setIsVisible(false);
      setDeferredPrompt(null);
      window.localStorage.setItem(DISMISS_KEY, 'true');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDeferredPrompt(null);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISS_KEY, 'true');
    }
  };

  return (
    <div className="install-banner" role="status" aria-live="polite">
      <div>
        <p className="small" style={{ margin: 0, fontWeight: 800, letterSpacing: '0.04em' }}>KEYVILLE</p>
        <p className="small" style={{ margin: '0.15rem 0 0.6rem 0' }}>
          Add KEYVILLE to your home screen. Built and maintained as a project by ETL GIS Consulting LLC.
        </p>
        <div className="install-actions">
          <button className="button" onClick={handleInstall} aria-label="Install KEYVILLE as an app">
            Install KEYVILLE
          </button>
          <button className="button secondary install-dismiss" onClick={handleDismiss} aria-label="Dismiss install banner">
            Remind me later
          </button>
        </div>
      </div>
    </div>
  );
}
