import axios from 'axios';
import { config } from '../../config';
import { CoinglassData } from '../../types/data';

export class CoinglassProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const baseUrl = config.apis.coinglass.baseUrl;
    const apiKey = config.apis.coinglass.apiKey;
    
    if (!baseUrl || !apiKey) {
      throw new Error('Coinglass API configuration is missing');
    }
    
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async fetchData(): Promise<CoinglassData> {
    try {
      const endpoints = {
        altSeasonBtcTop: '/public/v2/indicator/alt_season_btc',
        altSeasonIndex: '/public/v2/indicator/alt_season_index',
        cbi: '/public/v2/indicator/crypto_bull_index',
        etfNetOutflow: '/public/v2/etf/net_flow',
        etfBtcRatio: '/public/v2/etf/btc_ratio',
        annualRate3m: '/public/v2/funding/annual_rate'
      };

      const data: CoinglassData = {
        altSeasonBtcTop: 0,
        altSeasonIndex: 0,
        cbi: 0,
        etfNetOutflow: 0,
        etfBtcRatio: 0,
        annualRate3m: 0,
        usdtSavingsRate: 0
      };

      for (const [key, endpoint] of Object.entries(endpoints)) {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, {
          headers: {
            'coinglassSecret': this.apiKey
          }
        });
        data[key as keyof CoinglassData] = response.data.data.value;
      }
      return data;
    } catch (error) {
      console.error('CoinglassProvider error:', error);
      throw error;
    }
  }
}
