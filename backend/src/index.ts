import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import recommendRouter from './routes/recommend.js';

// Validate required environment variables at startup
const requiredEnvVars = ['ANTHROPIC_API_KEY', 'FRONTEND_URL'] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Fatal: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const port = process.env.PORT ?? 3001;
const frontendUrl = process.env.FRONTEND_URL as string;

// Trust proxy for Railway (needed for accurate rate limiting by IP)
app.set('trust proxy', 1);

// CORS — locked to frontend origin in production, permissive for localhost in dev
const allowedOrigins = new Set([
  frontendUrl,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      callback(new Error(`CORS: origin not allowed — ${origin}`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200,
  })
);

// Payload limit
app.use(express.json({ limit: '10kb' }));

// Rate limiting: 20 requests per IP per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a few minutes.', code: 'RATE_LIMITED' },
});
app.use('/api', limiter);

// Routes
app.use('/api/recommend', recommendRouter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    tmdb: !!process.env.TMDB_READ_TOKEN,
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
});

app.listen(port, () => {
  console.log(`WatchNow backend running on port ${port}`);
  console.log(`CORS allowed origin: ${frontendUrl}`);
});
