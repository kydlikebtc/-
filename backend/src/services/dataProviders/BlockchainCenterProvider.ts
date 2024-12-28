import axios from 'axios';
import { config } from '../../config';
import { BlockchainCenterData } from '../../types/data';

import { IDataProvider } from '../../types/provider';
import { IIndicator } from '../../types/indicator';

export class BlockchainCenterProvider implements IDataProvider {
  public transformData(rawData: BlockchainCenterRawData): IIndicator[] {
    const indicators: IIndicator[] = [];
    const now = new Date();

    if (rawData.nupl !== undefined) {
      indicators.push({
        id: 4,
        nameEn: 'NUPL',
        nameZh: '净未实现盈亏比率',
        currentValue: rawData.nupl,
        category: 'On-chain',
        updatedAt: now,
        principle: 'Measures unrealized profit/loss ratio',
        calculation: '(Market Cap - Realized Cap) / Market Cap',
        usage: 'Identify market cycle phases',
        dataSource: 'Blockchain Center'
      });
    }

    if (rawData.rhodl !== undefined) {
      indicators.push({
        id: 5,
        nameEn: 'RHODL',
        nameZh: 'RHODL比率',
        currentValue: rawData.rhodl,
        category: 'On-chain',
        updatedAt: now,
        principle: 'Compares young and old coin ratios',
        calculation: 'Realized HODL Ratio',
        usage: 'Identify accumulation/distribution',
        dataSource: 'Blockchain Center'
      });
    }

    if (rawData.sopr !== undefined) {
      indicators.push({
        id: 6,
        nameEn: 'SOPR',
        nameZh: '支出产出利润率',
        currentValue: rawData.sopr,
        category: 'On-chain',
        updatedAt: now,
        principle: 'Measures profit/loss of moved coins',
        calculation: 'Price sold / Price paid',
        usage: 'Identify profit-taking behavior',
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
