'use client';

import { useState } from 'react';

const POPULAR_ACTORS = [
  'Leonardo DiCaprio',
  'Margot Robbie',
  'Denzel Washington',
  'Cate Blanchett',
  'Tom Hanks',
  'Scarlett Johansson',
  'Brad Pitt',
  'Viola Davis',
  'Ryan Gosling',
  'Meryl Streep',
  'Timothee Chalamet',
  'Zendaya',
  'Robert Downey Jr.',
  'Florence Pugh',
  'Morgan Freeman',
  'Ana de Armas',
];

interface CastStepProps {
  currentAnswer?: string;
  onAnswer: (value: string) => void;
  onSkip: () => void;
  onBack: () => void;
}

export default function CastStep({
  currentAnswer,
  onAnswer,
  onSkip,
  onBack,
}: CastStepProps) {
  const [actorName, setActorName] = useState(currentAnswer ?? '');

  const trimmed = actorName.trim();
  const isValid = trimmed.length >= 2;

  function handleSubmit() {
    if (!isValid) return;
    onAnswer(trimmed);
  }

  function handleActorClick(name: string) {
    setActorName(name);
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-text leading-tight">
          Any favourite actor or actress?
        </h2>
        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-brand-accent-light text-brand-accent text-sm font-semibold tracking-wide">
          Optional filter
        </span>
      </div>

      {/* Text input */}
      <input
        type="text"
        value={actorName}
        onChange={(e) => setActorName(e.target.value)}
        placeholder="Type an actor or actress name..."
        maxLength={100}
        autoFocus
        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-brand-accent outline-none transition-colors duration-150 text-brand-text bg-white text-lg"
        aria-label="Actor or actress name"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && isValid) handleSubmit();
        }}
      />

      {/* Popular actors */}
      <p className="text-sm text-brand-muted mt-4 mb-2">Or pick a popular name:</p>
      <div className="flex flex-wrap gap-2">
        {POPULAR_ACTORS.map((name) => (
          <button
            key={name}
            onClick={() => handleActorClick(name)}
            className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1 ${
              actorName === name
                ? 'border-brand-accent bg-brand-accent-light text-brand-text'
                : 'border-gray-200 bg-white text-brand-muted hover:border-gray-300 hover:text-brand-text'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

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
          Find something to watch &rarr;
        </button>
      </div>
    </div>
  );
}
