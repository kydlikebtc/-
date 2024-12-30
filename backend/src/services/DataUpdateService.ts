import { GlassnodeProvider } from './dataProviders/GlassnodeProvider';
import { AnomalyDetectionService } from './AnomalyDetectionService';
import { IIndicator } from '../types/indicator';
import { CoinglassProvider } from './dataProviders/CoinglassProvider';
import { TradingViewProvider } from './dataProviders/TradingViewProvider';
import { BlockchainCenterProvider } from './dataProviders/BlockchainCenterProvider';
import { MicroStrategyProvider } from './dataProviders/MicroStrategyProvider';
import { PredictionProvider } from './dataProviders/PredictionProvider';
import { Indicator } from '../models/Indicator';
import { IndicatorHistory } from '../models/IndicatorHistory';
import { 
  GlassnodeData, 
  CoinglassData, 
  TradingViewData,
  BlockchainCenterData,
  MicroStrategyData,
  PredictionData
} from '../types/data';

export class DataUpdateService {
  private glassnodeProvider: GlassnodeProvider;
  private coinglassProvider: CoinglassProvider;

  private tradingViewProvider: TradingViewProvider;
  private blockchainCenterProvider: BlockchainCenterProvider;
  private microStrategyProvider: MicroStrategyProvider;
  private predictionProvider: PredictionProvider;

  async updateAllIndicators() {
    try {
      const [
        glassnodeData, 
        coinglassData, 
        tradingViewData,
        blockchainCenterData,
        microStrategyData,
        predictionData
      ] = await Promise.all([
        this.glassnodeProvider.fetchData(),
        this.coinglassProvider.fetchData(),
        this.tradingViewProvider.fetchData(),
        this.blockchainCenterProvider.fetchData(),
        this.microStrategyProvider.fetchData(),
        this.predictionProvider.fetchData()
      ]);

      // Update indicator data
      await this.updateIndicators(
        glassnodeData, 
        coinglassData, 
        tradingViewData,
        blockchainCenterData,
        microStrategyData,
        predictionData
      );
      // Save historical data
      await this.saveHistory(
        glassnodeData, 
        coinglassData, 
        tradingViewData,
        blockchainCenterData,
        microStrategyData,
        predictionData
      );

      console.log('All indicators updated successfully');
    } catch (error) {
      console.error('Error updating indicators:', error);
      throw error;
    }
  }

  private async updateIndicators(
    glassnodeData: GlassnodeData,
    coinglassData: CoinglassData,
    tradingViewData: TradingViewData,
    blockchainCenterData: BlockchainCenterData,
    microStrategyData: MicroStrategyData,
    predictionData: PredictionData
  ) {
    const updates = [
      // Glassnode Indicators
      this.updateIndicator(25, glassnodeData.nupl),         // NUPL
      this.updateIndicator(24, glassnodeData.rhodl),        // RHODL Ratio
      this.updateIndicator(22, glassnodeData.puell),        // Puell Multiple
      this.updateIndicator(26, glassnodeData.reserveRisk),  // Reserve Risk
      this.updateIndicator(21, glassnodeData.mvrv),         // MVRV Z-Score
      this.updateIndicator(27, glassnodeData.stHolderSupply), // Short Term Holder Supply
      this.updateIndicator(28, glassnodeData.ltHolderOutflow), // Long Term Holder Outflow

      // Coinglass Indicators
      this.updateIndicator(29, coinglassData.altSeasonBtcTop), // Alt Season BTC Top
      this.updateIndicator(30, coinglassData.altSeasonIndex),  // Alt Season Index
      this.updateIndicator(9, coinglassData.cbi),              // CBI Index
      this.updateIndicator(17, coinglassData.etfNetOutflow),   // ETF Net Outflow Days
      this.updateIndicator(18, coinglassData.etfBtcRatio),     // ETF/BTC Ratio
      this.updateIndicator(16, coinglassData.annualRate3m),     // 3M Annual Rate
      this.updateIndicator(11, coinglassData.usdtSavingsRate),  // USDT Savings Rate

      // TradingView Indicators
      this.updateIndicator(2, tradingViewData.ahr999TopSignal),     // AHR999 Top Signal
      this.updateIndicator(3, tradingViewData.ahr999Accumulation),  // AHR999 Accumulation
      this.updateIndicator(4, tradingViewData.mayerMultiple),       // Mayer Multiple
      this.updateIndicator(7, tradingViewData.ma2yMultiplier),      // 2Y MA Multiplier
      this.updateIndicator(14, tradingViewData.ma4y),               // 4Y Moving Average
      this.updateIndicator(15, tradingViewData.rsi22),              // 22-Day RSI
      this.updateIndicator(23, tradingViewData.oscillatorBMO),      // OscillatorBMO

      // BlockchainCenter Indicators
      this.updateIndicator(10, blockchainCenterData.btIndex),      // BT Index
      this.updateIndicator(8, blockchainCenterData.rainbowChart),  // Rainbow Chart

      // MicroStrategy Indicators
      this.updateIndicator(1, microStrategyData.costBasis),        // MicroStrategy Cost Basis

      // Prediction Indicators
      this.updateIndicator(5, predictionData.piCycleTop),       // PI Cycle Top
      this.updateIndicator(6, predictionData.sminstonForecast), // Sminston Forecast
      this.updateIndicator(13, predictionData.goldBtcRatio),    // Gold/BTC Ratio
      this.updateIndicator(19, predictionData.pricePrediction)  // Price Prediction
    ];

    await Promise.all(updates);
  }

  private anomalyDetectionService: AnomalyDetectionService;

  constructor() {
    this.glassnodeProvider = new GlassnodeProvider();
    this.coinglassProvider = new CoinglassProvider();
    this.tradingViewProvider = new TradingViewProvider();
    this.blockchainCenterProvider = new BlockchainCenterProvider();
    this.microStrategyProvider = new MicroStrategyProvider();
    this.predictionProvider = new PredictionProvider();
    this.anomalyDetectionService = new AnomalyDetectionService();
  }

  private async updateIndicator(id: number, value: number) {
    const indicator = await Indicator.findOne({ id });
    if (!indicator) return;

    // Update indicator value
    await Indicator.updateOne(
      { id },
      {
        $set: {
          currentValue: value,
          updatedAt: new Date()
        }
      }
    );

    // Get updated indicator with new value
    const updatedIndicator = await Indicator.findOne({ id });
    if (!updatedIndicator) return;

    // Get historical data for trend analysis
    const history = await IndicatorHistory.find({ indicatorId: id })
      .sort({ timestamp: -1 })
      .limit(10);

    // Detect anomalies and trends
    const indicatorData = updatedIndicator.toObject();
    const cleanedIndicator: IIndicator = {
      id: Number(indicatorData._id) || 0,
      nameEn: indicatorData.nameEn,
      nameZh: indicatorData.nameZh,
      currentValue: Number(indicatorData.currentValue),
      targetValue: Number(indicatorData.targetValue),
      category: indicatorData.category,
      updatedAt: indicatorData.updatedAt,
      principle: indicatorData.principle,
      calculation: indicatorData.calculation,
      usage: indicatorData.usage,
      dataSource: indicatorData.dataSource
    };
    await this.anomalyDetectionService.detectAnomalies([cleanedIndicator]);
    const historyData = history.map(h => {
      const data = h.toObject();
      return {
        indicatorId: Number(data.indicatorId),
        value: Number(data.value),
        timestamp: data.timestamp,
        id: Number(data._id) || 0
      };
    });
    await this.anomalyDetectionService.detectTrends(cleanedIndicator, historyData);
  }

  private async saveHistory(
    glassnodeData: GlassnodeData,
    coinglassData: CoinglassData,
    tradingViewData: TradingViewData,
    blockchainCenterData: BlockchainCenterData,
    microStrategyData: MicroStrategyData,
    predictionData: PredictionData
  ) {
    const glassnodeHistory = Object.entries(glassnodeData).map(([key, value]) => ({
      indicatorId: this.getIndicatorId(key),
      value,
      timestamp: new Date()
    }));

    const coinglassHistory = Object.entries(coinglassData).map(([key, value]) => ({
      indicatorId: this.getIndicatorId(key),
      value,
      timestamp: new Date()
    }));
    
    const tradingViewHistory = Object.entries(tradingViewData).map(([key, value]) => ({
      indicatorId: this.getIndicatorId(key),
      value,
      timestamp: new Date()
    }));
    
    const blockchainCenterHistory = Object.entries(blockchainCenterData).map(([key, value]) => ({
      indicatorId: this.getIndicatorId(key),
      value,
      timestamp: new Date()
    }));

    const microStrategyHistory = Object.entries(microStrategyData).map(([key, value]) => ({
      indicatorId: this.getIndicatorId(key),
      value,
      timestamp: new Date()
    }));

    const predictionHistory = Object.entries(predictionData).map(([key, value]) => ({
      indicatorId: this.getIndicatorId(key),
      value,
      timestamp: new Date()
    }));

    await IndicatorHistory.insertMany([
      ...glassnodeHistory,
      ...coinglassHistory,
      ...tradingViewHistory,
      ...blockchainCenterHistory,
      ...microStrategyHistory,
      ...predictionHistory
    ]);
  }

  private getIndicatorId(key: string): number {
    const mapping = {
      // Glassnode indicators
      nupl: 25,
      rhodl: 24,
      puell: 22,
      reserveRisk: 26,
      mvrv: 21,
      stHolderSupply: 27,
      ltHolderOutflow: 28,

      // Coinglass indicators
      altSeasonBtcTop: 29,
      altSeasonIndex: 30,
      cbi: 9,
      etfNetOutflow: 17,
      etfBtcRatio: 18,
      annualRate3m: 16,
      usdtSavingsRate: 11,


      // TradingView indicators
      ahr999TopSignal: 2,
      ahr999Accumulation: 3,
      mayerMultiple: 4,
      ma2yMultiplier: 7,
      ma4y: 14,
      rsi22: 15,
      oscillatorBMO: 23,

      // BlockchainCenter indicators
      btIndex: 10,
      rainbowChart: 8,

      // MicroStrategy indicators
      costBasis: 1
    };
    return (mapping as { [key: string]: number })[key];
  }
}
