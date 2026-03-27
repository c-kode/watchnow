'use client';

import { useState, useEffect } from 'react';

const MESSAGES = [
  'Consulting the algorithm…',
  'Filtering out the duds…',
  'Checking what\'s actually good…',
  'Cross-referencing your taste…',
  'Avoiding anything with a laugh track…',
  'This is faster than scrolling Netflix for 20 minutes…',
  'Almost there…',
];

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Spinner */}
      <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-brand-accent animate-spin mb-8" />

      <p
        aria-live="polite"
        aria-atomic="true"
        className={`text-lg text-brand-muted max-w-xs transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {MESSAGES[messageIndex]}
      </p>
    </div>
  );
}
