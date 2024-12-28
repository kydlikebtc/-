import { GlassnodeProvider } from './dataProviders/GlassnodeProvider';
import { CoinglassProvider } from './dataProviders/CoinglassProvider';
import { Indicator } from '../models/Indicator';
import { IndicatorHistory } from '../models/IndicatorHistory';
import { GlassnodeData } from '../types/data';

export class DataUpdateService {
  private glassnodeProvider: GlassnodeProvider;
  private coinglassProvider: CoinglassProvider;

  constructor() {
    this.glassnodeProvider = new GlassnodeProvider();
    this.coinglassProvider = new CoinglassProvider();
  }

  async updateAllIndicators() {
    try {
      const glassnodeData = await this.glassnodeProvider.fetchData();

      // Update indicator data
      await this.updateIndicators(glassnodeData);
      // Save historical data
      await this.saveHistory(glassnodeData);

      console.log('All indicators updated successfully');
    } catch (error) {
      console.error('Error updating indicators:', error);
      throw error;
    }
  }

  private async updateIndicators(glassnodeData: GlassnodeData) {
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

  private async saveHistory(glassnodeData: GlassnodeData) {
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
