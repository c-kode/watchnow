import { z } from 'zod';
import type { RecommendRequest } from './types.js';

const MoodOptionSchema = z.enum([
  'light-fun',
  'intense-suspenseful',
  'feel-good-romantic',
  'action-packed',
  'thought-provoking',
  'family-friendly',
  'documentary',
  'horror',
  'sci-fi-fantasy',
]);

const TimeOptionSchema = z.enum([
  'under-30',
  '30-60',
  '1-2-hours',
  '2-plus',
  'all-evening',
]);

const WatchingWithSchema = z.enum(['solo', 'partner', 'friends', 'family']);

const FormatSchema = z.enum(['movie', 'new-series', 'continue-series', 'either']);

const LanguagePreferenceSchema = z.enum(['english-only', 'open-subtitles', 'specific']);

const PopularitySchema = z.enum(['popular', 'hidden-gem', 'either']);

const StreamingServiceSchema = z.enum([
  'netflix',
  'prime',
  'disney-plus',
  'apple-tv',
  'max',
  'hulu',
  'paramount-plus',
  'other',
]);

const ReleaseDateSchema = z.object({
  year: z.number().int().min(1900).max(2030),
  direction: z.enum(['before', 'after']),
});

const RecommendRequestSchema = z.object({
  mood: z
    .array(MoodOptionSchema)
    .min(1, 'Select at least one mood')
    .max(2, 'Select at most two moods'),
  time: TimeOptionSchema,
  watchingWith: WatchingWithSchema,
  format: FormatSchema,
  language: z
    .object({
      preference: LanguagePreferenceSchema,
      specific: z.string().trim().max(50).optional(),
    })
    .refine(
      (data) =>
        data.preference !== 'specific' ||
        (data.specific !== undefined && data.specific.trim().length > 0),
      { message: 'Specific language name is required when "Specific language" is selected' }
    ),
  popularity: PopularitySchema,
  streaming: z.object({
    services: z.array(StreamingServiceSchema).min(1, 'Select at least one streaming service'),
    country: z.string().trim().max(60).optional(),
  }),
  releaseDate: ReleaseDateSchema.optional(),
  cast: z.string().trim().max(100).optional(),
});

export class ValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(issues.join('; '));
    this.name = 'ValidationError';
  }
}

export function validateRequest(body: unknown): RecommendRequest {
  const result = RecommendRequestSchema.safeParse(body);
  if (!result.success) {
    const issues = result.error.issues.map((i) => i.message);
    throw new ValidationError(issues);
  }
  return result.data;
}
