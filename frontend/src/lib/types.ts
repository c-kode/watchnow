// Mirrored from backend/src/lib/types.ts — keep in sync

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

export interface RecommendRequest {
  mood: MoodOption[];
  time: TimeOption;
  watchingWith: WatchingWithOption;
  format: FormatOption;
  language: LanguagePreferenceInput;
  popularity: PopularityOption;
  streaming: StreamingInput;
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
}

export interface RecommendResponse {
  recommendations: Recommendation[];
}

export interface ErrorResponse {
  error: string;
  code: string;
}

// Frontend-only types

export interface QuestionOption {
  value: string;
  label: string;
}

export interface ConditionalText {
  trigger: string;
  placeholder: string;
  fieldKey: string;
}

export interface ExtraTextField {
  label: string;
  placeholder: string;
  fieldKey: string;
}

export interface QuestionConfig {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'multi';
  maxSelections?: number;
  options: QuestionOption[];
  conditionalText?: ConditionalText;
  extraTextField?: ExtraTextField;
}

export type AppState =
  | { screen: 'landing' }
  | { screen: 'question'; step: number; answers: Partial<RecommendRequest> }
  | { screen: 'loading'; answers: RecommendRequest }
  | { screen: 'results'; answers: RecommendRequest; recommendations: Recommendation[] }
  | { screen: 'error'; answers: RecommendRequest; message: string };

export type AppAction =
  | { type: 'START' }
  | { type: 'ANSWER'; step: number; value: unknown }
  | { type: 'GO_BACK' }
  | { type: 'RECEIVE_RESULTS'; recommendations: Recommendation[] }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' };
