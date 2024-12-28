export interface GlassnodeData {
  nupl: number;              // Net Unrealized Profit/Loss
  rhodl: number;            // RHODL Ratio
  puell: number;            // Puell Multiple
  reserveRisk: number;      // Reserve Risk
  mvrv: number;             // MVRV Z-Score
  stHolderSupply: number;   // Short Term Holder Supply
  ltHolderOutflow: number;  // Long Term Holder Outflow
  bubbleIndex: number;      // Bubble Index
  mvrvRatio: number;        // MVRV Ratio
}

export interface CoinglassData {
  altSeasonBtcTop: number;  // Alt Season BTC Top
  altSeasonIndex: number;   // Alt Season Index
  cbi: number;              // Crypto Bull Index
  etfNetOutflow: number;    // ETF Net Outflow Days
  etfBtcRatio: number;      // ETF/BTC Ratio
  annualRate3m: number;     // 3M Annual Rate
  usdtSavingsRate: number;  // USDT Savings Rate
}

export interface TradingViewRawData {
  rsi?: number;
  macd?: number;
  bb_upper?: number;
  bb_lower?: number;
  ema_20?: number;
  sma_200?: number;
}

export interface BlockchainCenterRawData {
  nupl?: number;
  rhodl?: number;
  sopr?: number;
}

export interface MicroStrategyRawData {
  totalInvestment: number;
  totalBitcoin: number;
}

export interface PredictionRawData {
  fearGreedIndex?: number;
  marketSentiment?: number;
}

export interface TradingViewData {
  ahr999TopSignal: number;    // AHR999 Top Signal
  ahr999Accumulation: number; // AHR999 Accumulation
  mayerMultiple: number;      // Mayer Multiple
  ma2yMultiplier: number;     // 2Y MA Multiplier
  ma4y: number;              // 4Y Moving Average
  rsi22: number;             // 22-Day RSI
  oscillatorBMO: number;      // OscillatorBMO
}

export interface BlockchainCenterData {
  btIndex: number;           // Bitcoin Temperature Index
  rainbowChart: number;      // Rainbow Chart Stage
}

export interface MicroStrategyData {
  costBasis: number;         // MicroStrategy Cost Basis
}

export interface PredictionData {
  piCycleTop: number;       // PI Cycle Top
  sminstonForecast: number; // Sminston Forecast
  goldBtcRatio: number;     // Gold/BTC Ratio
  pricePrediction: number;  // Price Prediction
}
