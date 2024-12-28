import { describe, test, expect, jest } from '@jest/globals';
import { TradingViewProvider } from '../services/dataProviders/TradingViewProvider';
import { IIndicator } from '../types/indicator';
import { BlockchainCenterProvider } from '../services/dataProviders/BlockchainCenterProvider';
import { MicroStrategyProvider } from '../services/dataProviders/MicroStrategyProvider';
import { PredictionProvider } from '../services/dataProviders/PredictionProvider';

jest.mock('../utils/logger');

describe('TradingView Provider', () => {
  const provider = new TradingViewProvider();

  test('should fetch technical indicators', async () => {
    const indicators = await provider.fetchIndicators();
    expect(Array.isArray(indicators)).toBe(true);
    expect(indicators.length).toBeGreaterThan(0);
    
    const indicator = indicators[0];
    expect(indicator).toHaveProperty('nameEn');
    expect(indicator).toHaveProperty('nameZh');
    expect(indicator).toHaveProperty('currentValue');
    expect(indicator).toHaveProperty('category', 'Technical');
  });
});

describe('BlockchainCenter Provider', () => {
  const provider = new BlockchainCenterProvider();

  test('should fetch on-chain indicators', async () => {
    const indicators = await provider.fetchIndicators();
    expect(Array.isArray(indicators)).toBe(true);
    
    const indicator = indicators[0];
    expect(indicator).toHaveProperty('category', 'On-chain');
    expect(indicator.currentValue).toBeDefined();
  });
});

describe('MicroStrategy Provider', () => {
  const provider = new MicroStrategyProvider();

  test('should fetch market structure indicators', async () => {
    const indicators = await provider.fetchIndicators();
    expect(Array.isArray(indicators)).toBe(true);
    
    const indicator = indicators[0];
    expect(indicator).toHaveProperty('category', 'Market Structure');
    expect(typeof indicator.currentValue).toBe('number');
  });
});

describe('Prediction Provider', () => {
  const provider = new PredictionProvider();

  test('should fetch sentiment indicators', async () => {
    const indicators = await provider.fetchIndicators();
    expect(Array.isArray(indicators)).toBe(true);
    
    const indicator = indicators[0];
    expect(indicator).toHaveProperty('category', 'Sentiment');
    expect(indicator.principle).toBeDefined();
  });
});
