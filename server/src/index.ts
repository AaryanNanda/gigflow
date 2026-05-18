import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db';
import { authRouter } from './routes/auth.routes';
import { leadRouter } from './routes/lead.routes';

// Load environmental parameters into active processing memory
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Universal Middleware Pipelines
app.use(cors());
app.use(express.json());

// Main Core API Routing Matrix Map
app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);

// Health Check validation channel
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'System core is functional.' });
});

// Decoupled bootstrapping runner engine
const bootstrapApplicationServer = async (): Promise<void> => {
  try {
    // Await database channel configuration setup
    await connectDatabase();

    // Bind Express service pipeline to network interface channel
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on operational pipeline port: ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Bootstrapping routine interrupted by an unhandled exception:', error);
    process.exit(1);
  }
};

bootstrapApplicationServer();