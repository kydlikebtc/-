import axios from 'axios';
import { config } from '../../config';
import { TradingViewData, TradingViewRawData } from '../../types/data';
import { IDataProvider } from '../../types/provider';
import { IIndicator } from '../../types/indicator';

export class TradingViewProvider implements IDataProvider {
  public transformData(rawData: TradingViewRawData): IIndicator[] {
    const indicators: IIndicator[] = [];
    const now = new Date();

    const indicatorConfigs: Array<{
      key: keyof TradingViewRawData;
      nameEn: string;
      calculation: string;
      usage: string;
    }> = [
      {
        key: 'rsi',
        nameEn: 'RSI',
        calculation: '100 - (100 / (1 + RS))',
        usage: 'Identify overbought/oversold conditions'
      },
      {
        key: 'macd',
        nameEn: 'MACD',
        calculation: '12-day EMA - 26-day EMA',
        usage: 'Identify trend changes and momentum'
      },
      {
        key: 'bb_upper',
        nameEn: 'Bollinger Bands',
        calculation: 'SMA ± (2 × σ)',
        usage: 'Identify volatility and potential reversals'
      }
    ];

    indicatorConfigs.forEach((config, index) => {
      if (rawData[config.key] !== undefined) {
        const details = this.getIndicatorDetails(config.nameEn);
        indicators.push({
          id: index + 1,
          nameEn: config.nameEn,
          nameZh: details.nameZh,
          currentValue: rawData[config.key] as number,
          category: this.getCategory(),
          updatedAt: now,
          principle: details.principle,
          calculation: config.calculation,
          usage: config.usage,
          dataSource: this.getName()
        });
      }
    });

    return indicators;
  }
  private baseUrl: string;
  private apiKey: string;

  public getName(): string {
    return 'TradingView';
  }

  public getCategory(): string {
    return 'Technical';
  }

  public async fetchIndicators(): Promise<IIndicator[]> {
    const data = await this.fetchData();
    const rawData = this.transformRawData(data);
    return this.transformData(rawData);
  }

  private transformRawData(data: TradingViewData): TradingViewRawData {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (typeof value === 'number') {
        acc[key as keyof TradingViewRawData] = value;
      }
      return acc;
    }, {} as TradingViewRawData);
  }

  private getIndicatorDetails(key: string): { nameZh: string; principle: string } {
    const detailsMap: Record<string, { nameZh: string; principle: string }> = {
      'RSI': {
        nameZh: '相对强弱指标',
        principle: '通过计算价格变动的相对强度来判断市场超买超卖状态'
      },
      'MACD': {
        nameZh: '指数平滑异同移动平均线',
        principle: '通过计算两条不同期限的指数平滑移动平均线之间的差值来判断趋势'
      },
      'BB': {
        nameZh: '布林带',
        principle: '通过计算价格的标准差来判断市场波动性'
      }
    };
    return detailsMap[key] || { nameZh: key, principle: '技术分析指标' };
  }

  constructor() {
    const baseUrl = config.apis.tradingview.baseUrl;
    const apiKey = config.apis.tradingview.apiKey;
    
    if (!baseUrl || !apiKey) {
      throw new Error('TradingView API configuration is missing');
    }
    
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async fetchData(): Promise<TradingViewData> {
    try {
      const endpoints = {
        ahr999TopSignal: '/technical/ahr999_top',
        ahr999Accumulation: '/technical/ahr999_acc',
        mayerMultiple: '/technical/mayer_multiple',
        ma2yMultiplier: '/technical/2y_ma_multiplier',
        ma4y: '/technical/4y_ma',
        rsi22: '/technical/rsi_22',
        oscillatorBMO: '/technical/oscillator_bmo'
      };

      const data: TradingViewData = {
        ahr999TopSignal: 0,
        ahr999Accumulation: 0,
        mayerMultiple: 0,
        ma2yMultiplier: 0,
        ma4y: 0,
        rsi22: 0,
        oscillatorBMO: 0
      };

      for (const [key, endpoint] of Object.entries(endpoints)) {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, {
          headers: {
            'X-TV-KEY': this.apiKey
          }
        });
        const responseData = response.data as { value: number };
        data[key as keyof TradingViewData] = responseData.value;
      }

      return data;
    } catch (error) {
      console.error('TradingViewProvider error:', error);
      throw error;
    }
  }
}
