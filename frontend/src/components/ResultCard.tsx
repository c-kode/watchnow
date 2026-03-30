'use client';

import Image from 'next/image';
import type { Recommendation } from '@/lib/types';

interface ResultCardProps {
  recommendation: Recommendation;
  index: number;
}

export default function ResultCard({ recommendation, index }: ResultCardProps) {
  const delay = `${index * 150}ms`;

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${recommendation.title} ${recommendation.year} official trailer`
  )}`;

  const showImdb =
    recommendation.imdbRating != null && recommendation.imdbRating > 5;
  const showRt =
    recommendation.rtScore != null && recommendation.rtScore > 60;

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col opacity-0 animate-fade-in-up"
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
    >
      {/* Poster with overlay */}
      <div className="relative aspect-[2/3] bg-gray-900 shrink-0">
        {recommendation.posterUrl ? (
          <Image
            src={recommendation.posterUrl}
            alt={`${recommendation.title} poster`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={index === 0}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
            <span className="font-serif text-7xl text-white/20 select-none">
              {recommendation.title[0]}
            </span>
          </div>
        )}

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Type badge — top left */}
        <span className="absolute top-3 left-3 text-xs font-semibold bg-white/15 text-white px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20">
          {recommendation.type}
        </span>

        {/* Trailer button — top right */}
        <a
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          aria-label={`Watch ${recommendation.title} trailer on YouTube`}
        >
          <svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor" aria-hidden>
            <path d="M1 1v8l7-4-7-4z" />
          </svg>
          Trailer
        </a>


        {/* Title + meta overlaid on gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif text-xl text-white leading-tight mb-1">
            {recommendation.title}
          </h3>
          <p className="text-sm text-white/70">
            {recommendation.year} · {recommendation.runtime}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Genre tags + Ratings */}
        <div className="flex flex-wrap items-center gap-1.5">
          {recommendation.genres.map((genre) => (
            <span
              key={genre}
              className="text-xs text-brand-muted border border-gray-200 px-2.5 py-0.5 rounded-full bg-gray-50"
            >
              {genre}
            </span>
          ))}
          {showImdb && (
            <span className="flex items-center gap-1 text-xs font-bold bg-yellow-400/15 text-yellow-700 border border-yellow-300 px-2.5 py-0.5 rounded-full">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {recommendation.imdbRating!.toFixed(1)}
            </span>
          )}
          {showRt && (
            <span className="flex items-center gap-1 text-xs font-bold bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full">
              🍅 {recommendation.rtScore}%
            </span>
          )}
        </div>

        {/* Logline */}
        <p className="text-sm text-brand-text leading-relaxed">{recommendation.logline}</p>

        {/* Why this for you */}
        <div className="bg-brand-accent-light rounded-xl px-4 py-3">
          <p className="text-xs text-brand-accent font-semibold mb-1 uppercase tracking-wide">
            Why this for you
          </p>
          <p className="text-sm text-brand-text leading-relaxed">{recommendation.whyForYou}</p>
        </div>

        {/* Available on */}
        {recommendation.availableOn.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recommendation.availableOn.map((service) => (
              <span
                key={service}
                className="text-xs font-medium text-brand-text bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        )}

        {/* JustWatch button */}
        <a
          href={recommendation.justWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-gray-200 text-brand-text text-sm font-medium hover:border-brand-accent hover:text-brand-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
        >
          Find where to watch ↗
        </a>
      </div>
    </article>
  );
}
