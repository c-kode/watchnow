import { mutation } from './_generated/server';
import { v } from 'convex/values';

const recommendationValidator = v.object({
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
});

const queryValidator = v.object({
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
});

export const log = mutation({
  args: {
    query: queryValidator,
    recommendations: v.array(recommendationValidator),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return; // silently skip if not signed in

    await ctx.db.insert('usageHistory', {
      userId: identity.subject,
      timestamp: Date.now(),
      query: args.query,
      recommendations: args.recommendations,
    });
  },
});
