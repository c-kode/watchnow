import type {
  RecommendRequest,
  MoodOption,
  TimeOption,
  WatchingWithOption,
  FormatOption,
  LanguagePreference,
  PopularityOption,
  StreamingService,
} from './types.js';

const MOOD_LABELS: Record<MoodOption, string> = {
  'light-fun': 'Light & fun',
  'intense-suspenseful': 'Intense & suspenseful',
  'feel-good-romantic': 'Feel-good & romantic',
  'action-packed': 'Action-packed',
  'thought-provoking': 'Thought-provoking',
  'family-friendly': 'Family-friendly',
  'documentary': 'Documentary / Real-life',
  'horror': 'Horror',
  'sci-fi-fantasy': 'Sci-fi / Fantasy',
};

const TIME_LABELS: Record<TimeOption, string> = {
  'under-30': 'Under 30 minutes',
  '30-60': '30–60 minutes',
  '1-2-hours': '1–2 hours',
  '2-plus': '2+ hours',
  'all-evening': "I've got all evening",
};

const WATCHING_WITH_LABELS: Record<WatchingWithOption, string> = {
  'solo': 'Solo',
  'partner': 'With a partner',
  'friends': 'With friends',
  'family': 'With kids / family',
};

const FORMAT_LABELS: Record<FormatOption, string> = {
  'movie': 'Movie',
  'new-series': 'New series',
  'continue-series': 'Series (already started something)',
  'either': 'Either / No preference',
};

const LANGUAGE_LABELS: Record<LanguagePreference, string> = {
  'english-only': 'English only',
  'open-subtitles': 'Open to subtitles',
  'specific': 'Specific language',
};

const POPULARITY_LABELS: Record<PopularityOption, string> = {
  'popular': "Something everyone's talking about",
  'hidden-gem': 'Surprise me with a hidden gem',
  'either': 'Either is fine',
};

const SERVICE_LABELS: Record<StreamingService, string> = {
  'netflix': 'Netflix',
  'prime': 'Prime Video',
  'disney-plus': 'Disney+',
  'apple-tv': 'Apple TV+',
  'max': 'Max',
  'hulu': 'Hulu',
  'paramount-plus': 'Paramount+',
  'other': 'Other',
};

export const SYSTEM_PROMPT = `You are a movie and TV show recommendation engine. You receive a user's preferences and return personalised recommendations in strict JSON format.

Rules:
1. Always return exactly 3 recommendations.
2. Every recommendation must be a real movie or TV show that actually exists. Never invent titles.
3. Match recommendations to ALL of the user's stated preferences — mood, time available, audience, format, language, and streaming availability.
4. The "whyForYou" field must directly reference the user's specific answers to explain why this recommendation fits them right now.
5. For streaming availability, provide your best knowledge but note this may not reflect real-time availability.
6. Construct the justWatchUrl as: https://www.justwatch.com/us/search?q={url-encoded-title}

You must respond with ONLY a JSON object in this exact shape — no markdown fences, no explanation, no surrounding text:
{
  "recommendations": [
    {
      "title": "string",
      "type": "Movie" | "Series",
      "year": number,
      "genres": ["string"],
      "runtime": "string (e.g. '1h 55m' for movies or '8 episodes × 45m' for series)",
      "logline": "string (one punchy sentence)",
      "whyForYou": "string (2–3 sentences referencing the user's specific preferences)",
      "availableOn": ["string (streaming service names)"],
      "justWatchUrl": "string"
    }
  ]
}`;

export function buildPrompt(request: RecommendRequest): string {
  const moods = request.mood.map((m) => MOOD_LABELS[m]).join(', ');
  const time = TIME_LABELS[request.time];
  const watchingWith = WATCHING_WITH_LABELS[request.watchingWith];
  const format = FORMAT_LABELS[request.format];
  const services = request.streaming.services.map((s) => SERVICE_LABELS[s]).join(', ');
  const country = request.streaming.country?.trim() || 'US';
  const popularity = POPULARITY_LABELS[request.popularity];

  let language: string;
  if (request.language.preference === 'specific' && request.language.specific) {
    language = `${request.language.specific} (specific language requested)`;
  } else {
    language = LANGUAGE_LABELS[request.language.preference];
  }

  return `Find me something to watch based on these preferences:

- Mood: ${moods}
- Time available: ${time}
- Watching with: ${watchingWith}
- Format: ${format}
- Language: ${language}
- Discovery preference: ${popularity}
- Streaming services: ${services}
- Country: ${country}`;
}
