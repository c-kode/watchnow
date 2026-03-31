import { mutation, query } from './_generated/server';
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

export const save = mutation({
  args: {
    recommendations: v.array(recommendationValidator),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    await ctx.db.insert('savedSessions', {
      userId: identity.subject,
      savedAt: Date.now(),
      recommendations: args.recommendations,
    });
  },
});

export const listMine = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return ctx.db
      .query('savedSessions')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .collect();
  },
});

export const remove = mutation({
  args: { sessionId: v.id('savedSessions') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== identity.subject) {
      throw new Error('Not found');
    }
    await ctx.db.delete(args.sessionId);
  },
});
