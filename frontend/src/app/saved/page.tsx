'use client';

import { useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import Image from 'next/image';
import ResultCard from '@/components/ResultCard';
import AuthHeader from '@/components/AuthHeader';
import Link from 'next/link';
import type { Recommendation } from '@/lib/types';

function SessionCard({
  session,
  onRemove,
}: {
  session: {
    _id: string;
    savedAt: number;
    recommendations: Array<Record<string, unknown>>;
  };
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const recs = session.recommendations as unknown as Recommendation[];

  return (
    <div className="mb-6">
      {/* Collapsed summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-4">
          {/* Small poster thumbnails */}
          <div className="flex -space-x-3 shrink-0">
            {recs.map((rec) => (
              <div
                key={rec.title}
                className="w-12 h-16 rounded-lg overflow-hidden border-2 border-white shadow-sm relative shrink-0"
              >
                {rec.posterUrl ? (
                  <Image
                    src={rec.posterUrl}
                    alt={rec.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <span className="text-white/40 text-xs font-serif">
                      {rec.title[0]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Titles + date */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brand-text truncate">
              {recs.map((r) => r.title).join(' · ')}
            </p>
            <p className="text-xs text-brand-muted mt-0.5">
              {new Date(session.savedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Expand chevron */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-brand-muted shrink-0 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expanded full cards */}
      {expanded && (
        <div className="mt-4 ml-2">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-3">
            {recs.map((rec, i) => (
              <ResultCard key={rec.title} recommendation={rec} index={i} />
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Remove from saved
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
            <SessionCard
              key={session._id}
              session={session}
              onRemove={() =>
                removeMutation({ sessionId: session._id as Id<'savedSessions'> })
              }
            />
          ))}
      </div>
    </main>
  );
}
