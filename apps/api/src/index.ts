import express from 'express';
import cors from 'cors';
import { generateRouter } from './routes/generate';
import { downloadRouter } from './routes/download';
import { sendEmailRouter } from './routes/send-email';
import { stripeRouter } from './routes/stripe';
import { documentRouter } from './routes/document';
import { logger } from './lib/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — allow the Vercel frontend to call this API
app.use(cors({
  origin: [
    'https://immigrationdoc.app',
    'https://www.immigrationdoc.app',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Health check — always fast, no body parsing needed
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Stripe webhook MUST receive raw bytes for signature verification
// Register this route BEFORE express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// JSON body parser for all other routes
app.use(express.json());

// Routes
app.use('/api', generateRouter);
app.use('/api', downloadRouter);
app.use('/api', sendEmailRouter);
app.use('/api', stripeRouter);
app.use('/api', documentRouter);

// 404 fallback
app.use((_, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`);
});

export default app;
