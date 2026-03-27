import { Router, type Request, type Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { validateRequest, ValidationError } from '../lib/validator.js';
import { buildPrompt, SYSTEM_PROMPT } from '../lib/prompt.js';
import type { Recommendation, RecommendResponse, ErrorResponse } from '../lib/types.js';

const router = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 30000,
});

function stripMarkdownFences(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*\n?/, '')
    .replace(/\n?\s*```$/, '');
}

function validateRecommendations(parsed: unknown): Recommendation[] {
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('recommendations' in parsed) ||
    !Array.isArray((parsed as { recommendations: unknown }).recommendations)
  ) {
    throw new Error('Response missing recommendations array');
  }

  const recs = (parsed as { recommendations: unknown[] }).recommendations;

  if (recs.length < 1 || recs.length > 3) {
    throw new Error(`Expected 1–3 recommendations, got ${recs.length}`);
  }

  const required = [
    'title',
    'type',
    'year',
    'genres',
    'runtime',
    'logline',
    'whyForYou',
    'availableOn',
    'justWatchUrl',
  ] as const;

  for (const rec of recs) {
    if (typeof rec !== 'object' || rec === null) {
      throw new Error('Invalid recommendation shape');
    }
    for (const field of required) {
      if (!(field in rec)) {
        throw new Error(`Recommendation missing required field: ${field}`);
      }
    }
  }

  return recs as Recommendation[];
}

// Fetches poster from TMDB using the read-access token set in TMDB_READ_TOKEN env var
async function fetchPoster(title: string, year: number, type: 'Movie' | 'Series'): Promise<string | undefined> {
  const token = process.env.TMDB_READ_TOKEN;
  if (!token) return undefined;

  try {
    const endpoint = type === 'Movie' ? 'search/movie' : 'search/tv';
    const url = `https://api.themoviedb.org/3/${endpoint}?query=${encodeURIComponent(title)}&year=${year}&page=1`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return undefined;

    const data = await res.json() as { results?: Array<{ poster_path?: string | null }> };
    const posterPath = data.results?.[0]?.poster_path;
    if (!posterPath) return undefined;

    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  } catch {
    return undefined;
  }
}

router.post('/', async (req: Request, res: Response<RecommendResponse | ErrorResponse>) => {
  // 1. Validate input
  let validatedRequest;
  try {
    validatedRequest = validateRequest(req.body);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message, code: 'VALIDATION_ERROR' });
      return;
    }
    res.status(400).json({ error: 'Invalid request body', code: 'BAD_REQUEST' });
    return;
  }

  // 2. Build prompt and call Claude
  const userMessage = buildPrompt(validatedRequest);

  let rawContent: string;
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const block = message.content[0];
    if (block.type !== 'text') {
      throw new Error('Unexpected content block type from Claude');
    }
    rawContent = block.text;
  } catch (err) {
    if (err instanceof Anthropic.APIConnectionTimeoutError) {
      res.status(504).json({ error: 'Request to AI timed out. Please try again.', code: 'TIMEOUT' });
      return;
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error('Anthropic authentication error — check ANTHROPIC_API_KEY');
      res.status(502).json({ error: 'AI service configuration error', code: 'AUTH_ERROR' });
      return;
    }
    if (err instanceof Anthropic.APIError) {
      console.error('Anthropic API error:', err.status, err.message);
      res.status(502).json({ error: 'AI service unavailable. Please try again.', code: 'API_ERROR' });
      return;
    }
    console.error('Unexpected error calling Claude:', err);
    res.status(500).json({ error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' });
    return;
  }

  // 3. Parse and validate response
  try {
    const cleaned = stripMarkdownFences(rawContent);
    const parsed: unknown = JSON.parse(cleaned);
    const recommendations = validateRecommendations(parsed);
    const recommendationsWithPosters = await Promise.all(
      recommendations.map(async (rec) => ({
        ...rec,
        posterUrl: await fetchPoster(rec.title, rec.year, rec.type),
      }))
    );
    res.status(200).json({ recommendations: recommendationsWithPosters });
  } catch (err) {
    console.error('Failed to parse Claude response:', rawContent);
    console.error('Parse error:', err);
    res.status(502).json({
      error: 'AI returned an unexpected response format. Please try again.',
      code: 'PARSE_ERROR',
    });
  }
});

export default router;
