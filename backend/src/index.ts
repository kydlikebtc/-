import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import schedule from 'node-schedule';
import { config } from './config';
import routes from './routes';
import { DataUpdateService } from './services/DataUpdateService';

const app = express();
const dataUpdateService = new DataUpdateService();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Database connection (optional for now)
if (config.mongodb?.uri) {
  mongoose.connect(config.mongodb.uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('MongoDB URI not provided, skipping database connection');
}

// Schedule updates (if database is connected)
if (mongoose.connection.readyState === 1) {
  schedule.scheduleJob(config.update.interval, async () => {
    try {
      await dataUpdateService.updateAllIndicators();
    } catch (error) {
      console.error('Scheduled update failed:', error);
    }
  });
} else {
  console.log('Database not connected, skipping scheduled updates');
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
