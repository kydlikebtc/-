import axios from 'axios';
import { config } from '../../config';
import { GlassnodeData } from '../../types/data';

export class GlassnodeProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const baseUrl = config.apis.glassnode.baseUrl;
    const apiKey = config.apis.glassnode.apiKey;
    
    if (!baseUrl || !apiKey) {
      throw new Error('Glassnode API configuration is missing');
    }
    
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async fetchData(): Promise<GlassnodeData> {
    const endpoints = {
      nupl: '/v1/metrics/indicators/net_unrealized_profit_loss',
      rhodl: '/v1/metrics/indicators/rhodl_ratio',
      puell: '/v1/metrics/indicators/puell_multiple',
      reserveRisk: '/v1/metrics/indicators/reserve_risk',
      mvrv: '/v1/metrics/market/mvrv_z_score',
      stHolderSupply: '/v1/metrics/supply/short_term_holder_supply',
      ltHolderOutflow: '/v1/metrics/transactions/long_term_holder_outflow'
    };

    try {
      const data: GlassnodeData = {
        nupl: 0,
        rhodl: 0,
        puell: 0,
        reserveRisk: 0,
        mvrv: 0,
        stHolderSupply: 0,
        ltHolderOutflow: 0,
        bubbleIndex: 0,
        mvrvRatio: 0
      };
      
      for (const [key, endpoint] of Object.entries(endpoints)) {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, {
          params: {
            api_key: this.apiKey,
            resolution: '24h'
          }
        });
        data[key as keyof GlassnodeData] = response.data[0]?.value || 0;
      }
      return data;
    } catch (error) {
      console.error('GlassnodeProvider error:', error);
      throw error;
    }
  }
}
