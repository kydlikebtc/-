// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-indicators'
  },
  apis: {
    glassnode: {
      baseUrl: 'https://api.glassnode.com',
      apiKey: process.env.GLASSNODE_API_KEY
    },
    coinglass: {
      baseUrl: 'https://open-api.coinglass.com',
      apiKey: process.env.COINGLASS_API_KEY
    },
    binance: {
      baseUrl: 'https://api.binance.com',
      apiKey: process.env.BINANCE_API_KEY,
      apiSecret: process.env.BINANCE_API_SECRET
    }
  },
  update: {
    interval: '*/5 * * * *' // 每5分钟更新一次
  }
};

// src/models/Indicator.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IIndicator extends Document {
  id: number;
  category: string;
  nameZh: string;
  nameEn: string;
  currentValue: number | string;
  targetValue: string;
  principle: string;
  calculation: string;
  usage: string;
  dataSource: string;
  isTriggered: boolean;
  updatedAt: Date;
}

const IndicatorSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  category: { type: String, required: true },
  nameZh: { type: String, required: true },
  nameEn: { type: String, required: true },
  currentValue: { type: Schema.Types.Mixed, required: true },
  targetValue: { type: String, required: true },
  principle: { type: String, required: true },
  calculation: { type: String, required: true },
  usage: { type: String, required: true },
  dataSource: { type: String, required: true },
  isTriggered: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

export const Indicator = mongoose.model<IIndicator>('Indicator', IndicatorSchema);

// src/models/IndicatorHistory.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IIndicatorHistory extends Document {
  indicatorId: number;
  value: number | string;
  timestamp: Date;
}

const IndicatorHistorySchema = new Schema({
  indicatorId: { type: Number, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'indicatorId',
    granularity: 'hours'
  }
});

// 创建索引以提高查询性能
IndicatorHistorySchema.index({ indicatorId: 1, timestamp: -1 });

export const IndicatorHistory = mongoose.model<IIndicatorHistory>('IndicatorHistory', IndicatorHistorySchema);

// src/services/dataProviders/GlassnodeProvider.ts
import axios from 'axios';
import { config } from '../../config';

export class GlassnodeProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.apis.glassnode.baseUrl;
    this.apiKey = config.apis.glassnode.apiKey;
  }

  async fetchData() {
    const endpoints = {
      nupl: '/v1/metrics/indicators/net_unrealized_profit_loss',
      rhodl: '/v1/metrics/indicators/rhodl_ratio',
      puell: '/v1/metrics/indicators/puell_multiple',
      reserveRisk: '/v1/metrics/indicators/reserve_risk',
      mvrv: '/v1/metrics/market/mvrv_z_score'
    };

    try {
      const data = {};
      for (const [key, endpoint] of Object.entries(endpoints)) {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, {
          params: {
            api_key: this.apiKey,
            resolution: '24h'
          }
        });
        data[key] = response.data[0]?.value;
      }
      return data;
    } catch (error) {
      console.error('GlassnodeProvider error:', error);
      throw error;
    }
  }
}

// src/services/dataProviders/CoinglassProvider.ts
import axios from 'axios';
import { config } from '../../config';

export class CoinglassProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.apis.coinglass.baseUrl;
    this.apiKey = config.apis.coinglass.apiKey;
  }

  async fetchData() {
    try {
      const response = await axios.get(`${this.baseUrl}/public/v2/indicator`, {
        headers: {
          'coinglassSecret': this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('CoinglassProvider error:', error);
      throw error;
    }
  }
}

// src/services/DataUpdateService.ts
import { GlassnodeProvider } from './dataProviders/GlassnodeProvider';
import { CoinglassProvider } from './dataProviders/CoinglassProvider';
import { Indicator } from '../models/Indicator';
import { IndicatorHistory } from '../models/IndicatorHistory';

export class DataUpdateService {
  private glassnodeProvider: GlassnodeProvider;
  private coinglassProvider: CoinglassProvider;

  constructor() {
    this.glassnodeProvider = new GlassnodeProvider();
    this.coinglassProvider = new CoinglassProvider();
  }

  async updateAllIndicators() {
    try {
      const [glassnodeData, coinglassData] = await Promise.all([
        this.glassnodeProvider.fetchData(),
        this.coinglassProvider.fetchData()
      ]);

      // 更新指标数据
      await this.updateIndicators(glassnodeData, coinglassData);
      // 保存历史数据
      await this.saveHistory(glassnodeData, coinglassData);

      console.log('All indicators updated successfully');
    } catch (error) {
      console.error('Error updating indicators:', error);
      throw error;
    }
  }

  private async updateIndicators(glassnodeData: any, coinglassData: any) {
    const updates = [
      // NUPL
      this.updateIndicator(25, glassnodeData.nupl),
      // RHODL Ratio
      this.updateIndicator(24, glassnodeData.rhodl),
      // Puell Multiple
      this.updateIndicator(22, glassnodeData.puell),
      // Reserve Risk
      this.updateIndicator(26, glassnodeData.reserveRisk),
      // MVRV Z-Score
      this.updateIndicator(21, glassnodeData.mvrv)
    ];

    await Promise.all(updates);
  }

  private async updateIndicator(id: number, value: number) {
    const indicator = await Indicator.findOne({ id });
    if (!indicator) return;

    const targetValue = parseFloat(indicator.targetValue);
    const isTriggered = !isNaN(targetValue) && value >= targetValue;

    await Indicator.updateOne(
      { id },
      {
        $set: {
          currentValue: value,
          isTriggered,
          updatedAt: new Date()
        }
      }
    );
  }

  private async saveHistory(glassnodeData: any, coinglassData: any) {
    const history = Object.entries(glassnodeData).map(([key, value]) => ({
      indicatorId: this.getIndicatorId(key),
      value,
      timestamp: new Date()
    }));
    
    await IndicatorHistory.insertMany(history);
  }

  private getIndicatorId(key: string): number {
    const mapping = {
      nupl: 25,
      rhodl: 24,
      puell: 22,
      reserveRisk: 26,
      mvrv: 21
    };
    return mapping[key];
  }
}

// src/controllers/IndicatorController.ts
import { Request, Response } from 'express';
import { Indicator } from '../models/Indicator';
import { IndicatorHistory } from '../models/IndicatorHistory';

export class IndicatorController {
  async getAllIndicators(req: Request, res: Response) {
    try {
      const indicators = await Indicator.find().sort('id');
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching indicators' });
    }
  }

  async getIndicatorHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { days = 30 } = req.query;

      const history = await IndicatorHistory.find({
        indicatorId: parseInt(id),
        timestamp: {
          $gte: new Date(Date.now() - parseInt(days.toString()) * 24 * 60 * 60 * 1000)
        }
      }).sort('-timestamp');

      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching indicator history' });
    }
  }

  async getTriggeredIndicators(req: Request, res: Response) {
    try {
      const indicators = await Indicator.find({ isTriggered: true });
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching triggered indicators' });
    }
  }
}

// src/routes/index.ts
import express from 'express';
import { IndicatorController } from '../controllers/IndicatorController';

const router = express.Router();
const indicatorController = new IndicatorController();

router.get('/indicators', indicatorController.getAllIndicators);
router.get('/indicators/:id/history', indicatorController.getIndicatorHistory);
router.get('/indicators/triggered', indicatorController.getTriggeredIndicators);

export default router;

// src/index.ts
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

// Database connection
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schedule updates
schedule.scheduleJob(config.update.interval, async () => {
  try {
    await dataUpdateService.updateAllIndicators();
  } catch (error) {
    console.error('Scheduled update failed:', error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
