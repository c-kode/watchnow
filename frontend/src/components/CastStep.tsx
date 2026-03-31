'use client';

import { useState, useEffect, useRef } from 'react';

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

interface ActorSuggestion {
  name: string;
  imageUrl: string | null;
}

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
  const [suggestions, setSuggestions] = useState<ActorSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const trimmed = actorName.trim();
  const isValid = trimmed.length >= 2;

  // Fetch autocomplete suggestions from TMDB via backend
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/actors?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { results: ActorSuggestion[] };
        setSuggestions(data.results);
        setShowSuggestions(data.results.length > 0);
        setHighlightIndex(-1);
      } catch {
        // Silently fail — autocomplete is a nice-to-have
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [trimmed]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectSuggestion(name: string) {
    setActorName(name);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function handleSubmit() {
    if (!isValid) return;
    onAnswer(trimmed);
  }

  function handleActorClick(name: string) {
    setActorName(name);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && isValid) handleSubmit();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        selectSuggestion(suggestions[highlightIndex].name);
      } else if (isValid) {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
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

      {/* Text input with autocomplete dropdown */}
      <div ref={wrapperRef} className="relative">
        <input
          type="text"
          value={actorName}
          onChange={(e) => {
            setActorName(e.target.value);
            if (e.target.value.trim().length >= 2) setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Type an actor or actress name..."
          maxLength={100}
          autoFocus
          autoComplete="off"
          className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-brand-accent outline-none transition-colors duration-150 text-brand-text bg-white text-lg"
          aria-label="Actor or actress name"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          onKeyDown={handleKeyDown}
        />

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-80 overflow-y-auto">
            {suggestions.map((actor, idx) => (
              <li key={actor.name}>
                <button
                  type="button"
                  onClick={() => selectSuggestion(actor.name)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    idx === highlightIndex
                      ? 'bg-brand-accent-light'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {actor.imageUrl ? (
                    <img
                      src={actor.imageUrl}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                  <span className="text-brand-text font-medium">{actor.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
