'use client';

import { useState } from 'react';
import type { ReleaseDateFilter } from '@/lib/types';

interface ReleaseDateStepProps {
  currentAnswer?: ReleaseDateFilter;
  onAnswer: (value: ReleaseDateFilter) => void;
  onSkip: () => void;
  onBack: () => void;
}

export default function ReleaseDateStep({
  currentAnswer,
  onAnswer,
  onSkip,
  onBack,
}: ReleaseDateStepProps) {
  const [year, setYear] = useState<string>(
    currentAnswer?.year?.toString() ?? ''
  );
  const [direction, setDirection] = useState<'before' | 'after'>(
    currentAnswer?.direction ?? 'after'
  );

  const parsedYear = parseInt(year, 10);
  const isValid = !isNaN(parsedYear) && parsedYear >= 1900 && parsedYear <= 2030;

  function handleSubmit() {
    if (!isValid) return;
    onAnswer({ year: parsedYear, direction });
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-text leading-tight">
          Release date preference?
        </h2>
        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-brand-accent-light text-brand-accent text-sm font-semibold tracking-wide">
          Optional filter
        </span>
      </div>

      {/* Direction toggle */}
      <div className="flex gap-3 mb-5">
        {(['before', 'after'] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => setDirection(dir)}
            className={`flex-1 px-4 py-3.5 rounded-xl border-2 transition-all duration-150 font-medium capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 ${
              direction === dir
                ? 'border-brand-accent bg-brand-accent-light text-brand-text'
                : 'border-gray-200 bg-white text-brand-text hover:border-gray-300'
            }`}
          >
            {dir === 'before' ? 'Released before' : 'Released after'}
          </button>
        ))}
      </div>

      {/* Year input */}
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="e.g. 2000"
        min={1900}
        max={2030}
        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-brand-accent outline-none transition-colors duration-150 text-brand-text bg-white text-lg"
        aria-label="Release year"
      />
      {year && !isValid && (
        <p className="text-xs text-red-500 mt-1">Enter a year between 1900 and 2030</p>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl border-2 border-gray-200 text-brand-text font-medium hover:border-gray-300 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 min-h-[52px]"
        >
          &larr; Back
        </button>
        <button
          onClick={onSkip}
          className="px-6 py-3.5 rounded-xl border-2 border-gray-200 text-brand-muted font-medium hover:border-gray-300 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 min-h-[52px]"
        >
          Skip
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`flex-1 px-6 py-3.5 rounded-xl font-medium transition-all duration-150 min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 ${
            isValid
              ? 'bg-brand-accent text-white hover:bg-brand-accent-dark'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
