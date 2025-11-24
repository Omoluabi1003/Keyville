'use client';

import { useEffect, useState } from 'react';

type Event = {
  name: string;
  context?: Record<string, string | number | boolean>;
  timestamp: number;
};

export function useAnalytics() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (events.length === 0) return;
    const last = events[events.length - 1];
    console.info('[analytics]', last.name, last.context ?? {});
  }, [events]);

  function track(name: string, context?: Record<string, string | number | boolean>) {
    setEvents((prev) => [...prev, { name, context, timestamp: Date.now() }]);
  }

  return { track, events };
}
