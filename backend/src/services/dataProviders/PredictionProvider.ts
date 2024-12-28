import axios from 'axios';
import { config } from '../../config';
import { PredictionData } from '../../types/data';

import { IDataProvider } from '../../types/provider';
import { IIndicator } from '../../types/indicator';

export class PredictionProvider implements IDataProvider {
  public transformData(rawData: PredictionRawData): IIndicator[] {
    const indicators: IIndicator[] = [];
    const now = new Date();

    if (rawData.fearGreedIndex !== undefined) {
      indicators.push({
        id: 8,
        nameEn: 'Fear & Greed Index',
        nameZh: '恐惧贪婪指数',
        currentValue: rawData.fearGreedIndex,
        category: 'Sentiment',
        updatedAt: now,
        principle: 'Measures market sentiment',
        calculation: 'Composite of various metrics',
        usage: 'Gauge market psychology',
        dataSource: 'Alternative.me'
      });
    }

    if (rawData.marketSentiment !== undefined) {
      indicators.push({
        id: 9,
        nameEn: 'Market Sentiment',
        nameZh: '市场情绪',
        currentValue: rawData.marketSentiment * 100,
        category: 'Sentiment',
        updatedAt: now,
        principle: 'Measures overall market mood',
        calculation: 'Weighted average of signals',
        usage: 'Identify extreme sentiment',
        dataSource: 'Prediction Provider'
      });
    }

    return indicators;
  }
  public getName(): string {
    return 'Prediction';
  }

  public getCategory(): string {
    return 'Sentiment';
  }

  public async fetchIndicators(): Promise<IIndicator[]> {
    // Implementation will be added in a separate PR
    return [];
  }
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const baseUrl = config.apis.prediction.baseUrl;
    const apiKey = config.apis.prediction.apiKey;
    
    if (!baseUrl || !apiKey) {
      throw new Error('Prediction API configuration is missing');
    }
    
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async fetchData(): Promise<PredictionData> {
    try {
      const endpoints = {
        piCycleTop: '/api/v1/indicators/pi_cycle_top',
        sminstonForecast: '/api/v1/indicators/sminston_forecast',
        goldBtcRatio: '/api/v1/indicators/gold_btc_ratio',
        pricePrediction: '/api/v1/indicators/price_prediction'
      };

      const data: PredictionData = {
        piCycleTop: 0,
        sminstonForecast: 0,
        goldBtcRatio: 0,
        pricePrediction: 0
      };

      for (const [key, endpoint] of Object.entries(endpoints)) {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        });
        const responseData = response.data as { value: number };
        data[key as keyof PredictionData] = responseData.value;
      }

      return data;
    } catch (error) {
      console.error('Prediction Provider error:', error);
      throw error;
    }
  }
}
