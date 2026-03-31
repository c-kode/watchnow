'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState } from 'react';
import type { Recommendation } from '@/lib/types';

interface SaveButtonProps {
  recommendations: Recommendation[];
}

export default function SaveButton({ recommendations }: SaveButtonProps) {
  const { isSignedIn } = useUser();
  const save = useMutation(api.savedSessions.save);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (saved) {
    return (
      <span className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-green-50 text-green-700 font-medium border-2 border-green-200">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6L9 17l-5-5" />
        </svg>
        Saved!
      </span>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="px-6 py-3 rounded-xl bg-brand-accent text-white font-medium hover:bg-brand-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 cursor-pointer">
          Save these picks
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      disabled={saving}
      onClick={async () => {
        setSaving(true);
        try {
          await save({ recommendations });
          setSaved(true);
        } catch {
          setSaving(false);
        }
      }}
      className="px-6 py-3 rounded-xl bg-brand-accent text-white font-medium hover:bg-brand-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:opacity-50"
    >
      {saving ? 'Saving...' : 'Save these picks'}
    </button>
  );
}
