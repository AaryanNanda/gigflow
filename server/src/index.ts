import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { router as leadRoutes } from './routes/lead.routes'; // Named import matches perfectly now!

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running safely!');
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigflow';
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully.');
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB database connection error:', err);
  });