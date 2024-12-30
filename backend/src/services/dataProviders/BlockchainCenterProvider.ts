import axios from 'axios';
import { config } from '../../config';
import { BlockchainCenterData } from '../../types/data';

import { IDataProvider } from '../../types/provider';
import { IIndicator } from '../../types/indicator';

export class BlockchainCenterProvider implements IDataProvider {
  public transformData(rawData: BlockchainCenterData): IIndicator[] {
    const indicators: IIndicator[] = [];
    const now = new Date();

    if (rawData.btIndex !== undefined) {
      indicators.push({
        id: 4,
        nameEn: 'Bitcoin Temperature',
        nameZh: '比特币温度',
        currentValue: rawData.btIndex,
        category: 'On-chain',
        updatedAt: now,
        principle: 'Measures market temperature',
        calculation: 'Composite of various metrics',
        usage: 'Identify market phases',
        dataSource: 'Blockchain Center'
      });
    }

    if (rawData.rainbowChart !== undefined) {
      indicators.push({
        id: 5,
        nameEn: 'Rainbow Chart',
        nameZh: '彩虹图',
        currentValue: rawData.rainbowChart,
        category: 'On-chain',
        updatedAt: now,
        principle: 'Price bands based on logarithmic regression',
        calculation: 'Log regression of price history',
        usage: 'Long-term price analysis',
        dataSource: 'Blockchain Center'
      });
    }

    return indicators;
  }
  public getName(): string {
    return 'BlockchainCenter';
  }

  public getCategory(): string {
    return 'On-chain';
  }

  public async fetchIndicators(): Promise<IIndicator[]> {
    // Implementation will be added in a separate PR
    return [];
  }
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const baseUrl = config.apis.blockchaincenter.baseUrl;
    const apiKey = config.apis.blockchaincenter.apiKey;
    
    if (!baseUrl || !apiKey) {
      throw new Error('BlockchainCenter API configuration is missing');
    }
    
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async fetchData(): Promise<BlockchainCenterData> {
    try {
      const endpoints = {
        btIndex: '/api/v1/metrics/bitcoin_temperature',
        rainbowChart: '/api/v1/metrics/rainbow_chart'
      };

      const data: BlockchainCenterData = {
        btIndex: 0,
        rainbowChart: 0
      };

      for (const [key, endpoint] of Object.entries(endpoints)) {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        });
        const responseData = response.data as { value: number };
        data[key as keyof BlockchainCenterData] = responseData.value;
      }

      return data;
    } catch (error) {
      console.error('BlockchainCenter error:', error);
      throw error;
    }
  }
}
