'use client';

import { useUser, SignInButton } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import ResultCard from '@/components/ResultCard';
import AuthHeader from '@/components/AuthHeader';
import Link from 'next/link';

export default function SavedPage() {
  const { isSignedIn, isLoaded } = useUser();
  const sessions = useQuery(api.savedSessions.listMine);
  const removeMutation = useMutation(api.savedSessions.remove);

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="mx-auto max-w-5xl px-4 pt-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-brand-muted hover:text-brand-text transition-colors"
        >
          ← Back to WatchNow
        </Link>
        <AuthHeader />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-serif text-3xl text-brand-text mb-2">My Saved Picks</h1>
        <p className="text-sm text-brand-muted mb-10">
          Your saved recommendation sessions
        </p>

        {!isSignedIn && (
          <div className="text-center py-20">
            <p className="text-brand-muted mb-4">Sign in to see your saved picks</p>
            <SignInButton mode="modal">
              <button className="px-6 py-3 rounded-xl bg-brand-accent text-white font-medium hover:bg-brand-accent-dark transition-colors cursor-pointer">
                Sign in
              </button>
            </SignInButton>
          </div>
        )}

        {isSignedIn && !sessions && (
          <div className="text-center py-20">
            <p className="text-brand-muted">Loading...</p>
          </div>
        )}

        {isSignedIn && sessions && sessions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-brand-muted mb-4">No saved picks yet</p>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-brand-accent text-white font-medium hover:bg-brand-accent-dark transition-colors inline-block"
            >
              Get recommendations →
            </Link>
          </div>
        )}

        {isSignedIn &&
          sessions?.map((session) => (
            <div key={session._id} className="mb-14">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-brand-muted">
                  Saved on{' '}
                  {new Date(session.savedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <button
                  onClick={() =>
                    removeMutation({ sessionId: session._id as Id<'savedSessions'> })
                  }
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {session.recommendations.map((rec, i) => (
                  <ResultCard
                    key={rec.title}
                    recommendation={rec}
                    index={i}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
