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

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col opacity-0 animate-fade-in-up"
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gray-100 shrink-0">
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
          <div className="w-full h-full bg-gradient-to-br from-brand-accent-light via-gray-100 to-gray-200 flex items-center justify-center">
            <span className="font-serif text-7xl text-brand-accent/30 select-none">
              {recommendation.title[0]}
            </span>
          </div>
        )}

        {/* Type badge */}
        <span className="absolute top-3 left-3 text-xs font-semibold bg-black/55 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
          {recommendation.type}
        </span>

        {/* Trailer button overlay */}
        <a
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          aria-label={`Watch ${recommendation.title} trailer on YouTube`}
        >
          <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor" aria-hidden>
            <path d="M1 1.5v8l8-4-8-4z" />
          </svg>
          Trailer
        </a>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Title + meta */}
        <div>
          <h3 className="font-serif text-xl text-brand-text leading-tight mb-1">
            {recommendation.title}
          </h3>
          <p className="text-sm text-brand-muted">
            {recommendation.year} · {recommendation.runtime}
          </p>
        </div>

        {/* Genre tags */}
        <div className="flex flex-wrap gap-1.5">
          {recommendation.genres.map((genre) => (
            <span
              key={genre}
              className="text-xs text-brand-muted border border-gray-200 px-2 py-0.5 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Logline */}
        <p className="text-sm text-brand-text leading-relaxed">{recommendation.logline}</p>

        {/* Why this for you */}
        <div className="border-l-2 border-brand-accent pl-3">
          <p className="text-xs text-brand-muted font-medium mb-0.5">Why this for you</p>
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

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          <a
            href={trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor" aria-hidden>
              <path d="M1 1.5v8l8-4-8-4z" />
            </svg>
            Watch trailer
          </a>
          <a
            href={recommendation.justWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-gray-200 text-brand-text text-sm font-medium hover:border-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            Find on JustWatch ↗
          </a>
        </div>
      </div>
    </article>
  );
}
