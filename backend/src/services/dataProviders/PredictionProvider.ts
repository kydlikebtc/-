import axios from 'axios';
import { config } from '../../config';
import { PredictionData } from '../../types/data';

import { IDataProvider } from '../../types/provider';
import { IIndicator } from '../../types/indicator';

export class PredictionProvider implements IDataProvider {
  public transformData(rawData: PredictionData): IIndicator[] {
    const indicators: IIndicator[] = [];
    const now = new Date();

    if (rawData.piCycleTop !== undefined) {
      indicators.push({
        id: 8,
        nameEn: 'PI Cycle Top',
        nameZh: 'PI周期顶部',
        currentValue: rawData.piCycleTop,
        category: 'Sentiment',
        updatedAt: now,
        principle: 'Identifies market cycle tops',
        calculation: 'Moving average crossovers',
        usage: 'Market top prediction',
        dataSource: 'Prediction Provider'
      });
    }

    if (rawData.sminstonForecast !== undefined) {
      indicators.push({
        id: 9,
        nameEn: 'Sminston Forecast',
        nameZh: 'Sminston预测',
        currentValue: rawData.sminstonForecast,
        category: 'Sentiment',
        updatedAt: now,
        principle: 'Price prediction model',
        calculation: 'Machine learning forecast',
        usage: 'Price trend prediction',
        dataSource: 'Prediction Provider'
      });
    }

    if (rawData.goldBtcRatio !== undefined) {
      indicators.push({
        id: 10,
        nameEn: 'Gold/BTC Ratio',
        nameZh: '黄金/BTC比率',
        currentValue: rawData.goldBtcRatio,
        category: 'Sentiment',
        updatedAt: now,
        principle: 'Compares BTC to gold',
        calculation: 'Gold price / BTC price',
        usage: 'Store of value analysis',
        dataSource: 'Prediction Provider'
      });
    }

    if (rawData.pricePrediction !== undefined) {
      indicators.push({
        id: 11,
        nameEn: 'Price Prediction',
        nameZh: '价格预测',
        currentValue: rawData.pricePrediction,
        category: 'Sentiment',
        updatedAt: now,
        principle: 'Short-term price forecast',
        calculation: 'Technical analysis model',
        usage: 'Trading signal generation',
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
