'use client';

import { useEffect } from 'react';

interface AnalyticsEvent {
  siteId: string;
  eventType: string;
  anonId: string;
  url: string;
  referrer: string;
  userAgent: string;
  ts: string;
}

const Analytics = () => {
  useEffect(() => {
    // Generate or retrieve anonymous ID
    const getOrCreateAnonId = (): string => {
      if (typeof window === 'undefined') return '';

      const existingId = localStorage.getItem('analytics_anon_id');
      if (existingId) {
        return existingId;
      }

      // Generate a new anonymous ID
      const newId = 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem('analytics_anon_id', newId);
      return newId;
    };

    // Send analytics event
    const sendAnalyticsEvent = async (eventData: AnalyticsEvent) => {
      try {
        const response = await fetch('https://aihref.com/api/ingest/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          console.warn('Analytics event failed to send:', response.status);
        } else {
          console.log('Analytics event sent successfully');
        }
      } catch (error) {
        console.warn('Analytics event failed to send:', error);
      }
    };

    // Only run on client-side
    if (typeof window !== 'undefined') {
      const anonId = getOrCreateAnonId();

      const eventData: AnalyticsEvent = {
        siteId: 'aihref',
        eventType: 'page_view',
        anonId,
        url: window.location.href,
        referrer: document.referrer || '',
        userAgent: navigator.userAgent,
        ts: new Date().toISOString(),
      };

      sendAnalyticsEvent(eventData);
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default Analytics;
