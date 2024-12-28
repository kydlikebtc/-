import axios from 'axios';
import { config } from '../../config';

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
