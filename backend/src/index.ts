import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const app = express();
const port = process.env.PORT ?? 3001;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(port, () => {
  console.log(`WatchNow backend running on port ${port}`);
});
