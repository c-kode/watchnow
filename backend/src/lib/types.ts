// All shared types for WatchNow backend

export type MoodOption =
  | 'light-fun'
  | 'intense-suspenseful'
  | 'feel-good-romantic'
  | 'action-packed'
  | 'thought-provoking'
  | 'family-friendly'
  | 'documentary'
  | 'horror'
  | 'sci-fi-fantasy';

export type TimeOption =
  | 'under-30'
  | '30-60'
  | '1-2-hours'
  | '2-plus'
  | 'all-evening';

export type WatchingWithOption = 'solo' | 'partner' | 'friends' | 'family';

export type FormatOption = 'movie' | 'new-series' | 'continue-series' | 'either';

export type LanguagePreference = 'english-only' | 'open-subtitles' | 'specific';

export type PopularityOption = 'popular' | 'hidden-gem' | 'either';

export type StreamingService =
  | 'netflix'
  | 'prime'
  | 'disney-plus'
  | 'apple-tv'
  | 'max'
  | 'hulu'
  | 'paramount-plus'
  | 'other';

export interface LanguagePreferenceInput {
  preference: LanguagePreference;
  specific?: string;
}

export interface StreamingInput {
  services: StreamingService[];
  country?: string;
}

export interface ReleaseDateFilter {
  year: number;
  direction: 'before' | 'after';
}

export interface RecommendRequest {
  mood: MoodOption[];
  time: TimeOption;
  watchingWith: WatchingWithOption;
  format: FormatOption;
  language: LanguagePreferenceInput;
  popularity: PopularityOption;
  streaming: StreamingInput;
  releaseDate?: ReleaseDateFilter;
  cast?: string;
}

export interface Recommendation {
  title: string;
  type: 'Movie' | 'Series';
  year: number;
  genres: string[];
  runtime: string;
  logline: string;
  whyForYou: string;
  availableOn: string[];
  justWatchUrl: string;
  posterUrl?: string;
  imdbRating?: number | null;
  rtScore?: number | null;
}

export interface RecommendResponse {
  recommendations: Recommendation[];
}

export interface ErrorResponse {
  error: string;
  code: string;
}
