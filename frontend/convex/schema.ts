import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  savedSessions: defineTable({
    userId: v.string(),
    savedAt: v.number(),
    recommendations: v.array(
      v.object({
        title: v.string(),
        type: v.string(),
        year: v.number(),
        genres: v.array(v.string()),
        runtime: v.string(),
        logline: v.string(),
        whyForYou: v.string(),
        availableOn: v.array(v.string()),
        justWatchUrl: v.string(),
        posterUrl: v.optional(v.string()),
        imdbRating: v.optional(v.union(v.number(), v.null())),
        rtScore: v.optional(v.union(v.number(), v.null())),
      })
    ),
  }).index('by_user', ['userId']),

  usageHistory: defineTable({
    userId: v.string(),
    timestamp: v.number(),
    query: v.object({
      mood: v.array(v.string()),
      time: v.string(),
      watchingWith: v.string(),
      format: v.string(),
      language: v.object({
        preference: v.string(),
        specific: v.optional(v.string()),
      }),
      popularity: v.string(),
      streaming: v.object({
        services: v.array(v.string()),
        country: v.optional(v.string()),
      }),
    }),
    recommendations: v.array(
      v.object({
        title: v.string(),
        type: v.string(),
        year: v.number(),
        genres: v.array(v.string()),
        runtime: v.string(),
        logline: v.string(),
        whyForYou: v.string(),
        availableOn: v.array(v.string()),
        justWatchUrl: v.string(),
        posterUrl: v.optional(v.string()),
        imdbRating: v.optional(v.union(v.number(), v.null())),
        rtScore: v.optional(v.union(v.number(), v.null())),
      })
    ),
  }).index('by_user', ['userId']),
});
