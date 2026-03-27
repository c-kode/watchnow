import type { QuestionConfig } from './types';

export const QUESTIONS: QuestionConfig[] = [
  {
    id: 'mood',
    title: 'What are you in the mood for?',
    subtitle: 'Pick up to 2',
    type: 'multi',
    maxSelections: 2,
    options: [
      { value: 'light-fun', label: 'Light & fun' },
      { value: 'intense-suspenseful', label: 'Intense & suspenseful' },
      { value: 'feel-good-romantic', label: 'Feel-good & romantic' },
      { value: 'action-packed', label: 'Action-packed' },
      { value: 'thought-provoking', label: 'Thought-provoking' },
      { value: 'family-friendly', label: 'Family-friendly' },
      { value: 'documentary', label: 'Documentary / Real-life' },
      { value: 'horror', label: 'Horror' },
      { value: 'sci-fi-fantasy', label: 'Sci-fi / Fantasy' },
    ],
  },
  {
    id: 'time',
    title: 'How much time do you have?',
    type: 'single',
    options: [
      { value: 'under-30', label: 'Under 30 min' },
      { value: '30-60', label: '30–60 min' },
      { value: '1-2-hours', label: '1–2 hours' },
      { value: '2-plus', label: '2+ hours' },
      { value: 'all-evening', label: "I've got all evening" },
    ],
  },
  {
    id: 'watchingWith',
    title: 'Who are you watching with?',
    type: 'single',
    options: [
      { value: 'solo', label: 'Solo' },
      { value: 'partner', label: 'With a partner' },
      { value: 'friends', label: 'With friends' },
      { value: 'family', label: 'With kids / family' },
    ],
  },
  {
    id: 'format',
    title: 'Movie or series?',
    type: 'single',
    options: [
      { value: 'movie', label: 'Movie' },
      { value: 'new-series', label: 'New series' },
      { value: 'continue-series', label: 'Series (already started something)' },
      { value: 'either', label: 'Either' },
    ],
  },
  {
    id: 'language',
    title: 'Language preference?',
    type: 'single',
    options: [
      { value: 'english-only', label: 'English only' },
      { value: 'open-subtitles', label: 'Open to subtitles' },
      { value: 'specific', label: 'Specific language' },
    ],
    conditionalText: {
      trigger: 'specific',
      placeholder: 'e.g. French, Korean, Spanish…',
      fieldKey: 'language.specific',
    },
  },
  {
    id: 'popularity',
    title: 'Popular or underrated?',
    type: 'single',
    options: [
      { value: 'popular', label: "Something everyone's talking about" },
      { value: 'hidden-gem', label: 'Surprise me with a hidden gem' },
      { value: 'either', label: 'Either is fine' },
    ],
  },
  {
    id: 'streaming',
    title: 'Which streaming services do you have?',
    type: 'multi',
    options: [
      { value: 'netflix', label: 'Netflix' },
      { value: 'prime', label: 'Prime Video' },
      { value: 'disney-plus', label: 'Disney+' },
      { value: 'apple-tv', label: 'Apple TV+' },
      { value: 'max', label: 'Max' },
      { value: 'hulu', label: 'Hulu' },
      { value: 'paramount-plus', label: 'Paramount+' },
      { value: 'other', label: 'Other' },
    ],
    extraTextField: {
      label: 'Your country (optional)',
      placeholder: 'e.g. US, UK, Canada…',
      fieldKey: 'streaming.country',
    },
  },
];
