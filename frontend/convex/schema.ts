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
});
