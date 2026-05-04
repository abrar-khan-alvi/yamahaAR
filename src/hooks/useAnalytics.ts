'use client';

import { useCallback } from 'react';

export type AnalyticsEvent =
  | 'showroom_load'
  | 'category_click'
  | 'model_click'
  | 'ar_start'
  | 'price_reveal'
  | 'form_open'
  | 'form_submit'
  | 'form_abandon';

export function useAnalytics() {
  const track = useCallback(
    async (event: AnalyticsEvent, metadata?: Record<string, string>) => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, metadata, timestamp: Date.now() }),
        });
      } catch {
        // analytics is non-critical — never throw
      }
    },
    []
  );

  return { track };
}
