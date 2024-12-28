import axios from 'axios';
import { config } from '../../config';
import { MicroStrategyData } from '../../types/data';

import { IDataProvider } from '../../types/provider';
import { IIndicator } from '../../types/indicator';

export class MicroStrategyProvider implements IDataProvider {
  public transformData(rawData: MicroStrategyRawData): IIndicator[] {
    const now = new Date();
    const costBasis = rawData.totalInvestment / rawData.totalBitcoin;

    return [{
      id: 7,
      nameEn: 'Institutional Cost Basis',
      nameZh: '机构持仓成本',
      currentValue: costBasis,
      category: 'Market Structure',
      updatedAt: now,
      principle: 'Shows institutional entry price',
      calculation: 'Total Investment / Total Bitcoin Holdings',
      usage: 'Track institutional positioning',
      dataSource: 'MicroStrategy'
    }];
  }
  public getName(): string {
    return 'MicroStrategy';
  }

  public getCategory(): string {
    return 'Market Structure';
  }

  public async fetchIndicators(): Promise<IIndicator[]> {
    // Implementation will be added in a separate PR
    return [];
  }
  private baseUrl: string;

  constructor() {
    const baseUrl = config.apis.microstrategy.baseUrl;
    
    if (!baseUrl) {
      throw new Error('MicroStrategy API configuration is missing');
    }
    
    this.baseUrl = baseUrl;
  }

  async fetchData(): Promise<MicroStrategyData> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/bitcoin/holdings`);
      const { totalInvestment, totalBitcoin } = response.data as { totalInvestment: number; totalBitcoin: number };
      
      return {
        costBasis: totalInvestment / totalBitcoin
      };
    } catch (error) {
      console.error('MicroStrategy error:', error);
      throw error;
    }
  }
}
