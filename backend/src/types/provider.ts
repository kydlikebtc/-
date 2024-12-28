import { IIndicator } from './indicator';

export interface IDataProvider {
  fetchIndicators(): Promise<IIndicator[]>;
  getName(): string;
  getCategory(): string;
}

export interface IHistoricalData {
  value: number;
  timestamp: Date;
}

export interface ITrendChange {
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
  confidence: number;
}

export interface IAnomaly {
  type: 'THRESHOLD_BREACH' | 'TREND_CHANGE' | 'VOLATILITY_SPIKE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  indicator: Partial<IIndicator>;
  details?: string;
  timestamp: Date;
}
