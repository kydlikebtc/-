import { Validator } from '../utils/validator';
import { DataUtils } from '../utils/helpers';
import { Security } from '../utils/security';
import { describe, test, expect, jest } from '@jest/globals';
import { IIndicator } from '../types/indicator';
import { TradingViewProvider } from '../services/dataProviders/TradingViewProvider';
// Removed unused imports
import { BlockchainCenterProvider } from '../services/dataProviders/BlockchainCenterProvider';
import { MicroStrategyProvider } from '../services/dataProviders/MicroStrategyProvider';
import { PredictionProvider } from '../services/dataProviders/PredictionProvider';

jest.mock('../utils/logger');

describe('Indicator Providers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('TradingView Provider', () => {
    const provider = new TradingViewProvider();

    test('should handle API errors', async () => {
      jest.spyOn(provider as any, 'fetchData').mockRejectedValue(new Error('API Error'));
      await expect(provider.fetchIndicators()).rejects.toThrow('API Error');
    });

    test('should fetch technical indicators', async () => {
      const indicators = await provider.fetchIndicators();
      expect(Array.isArray(indicators)).toBe(true);
      expect(indicators.length).toBeGreaterThan(0);

      const indicator = indicators[0];
      expect(indicator.category).toBe('Technical');
      expect(indicator.nameEn).toBeDefined();
      expect(indicator.nameZh).toBeDefined();
      expect(indicator.currentValue).toBeDefined();
    });
  });

  describe('BlockchainCenter Provider', () => {
    const provider = new BlockchainCenterProvider();

    test('should handle API errors', async () => {
      jest.spyOn(provider as any, 'fetchData').mockRejectedValue(new Error('API Error'));
      await expect(provider.fetchIndicators()).rejects.toThrow('API Error');
    });

    test('should fetch on-chain indicators', async () => {
      const indicators = await provider.fetchIndicators();
      expect(Array.isArray(indicators)).toBe(true);
      expect(indicators.length).toBeGreaterThan(0);

      const indicator = indicators[0];
      expect(indicator.category).toBe('On-chain');
      expect(indicator.currentValue).toBeDefined();
    });
  });

  describe('MicroStrategy Provider', () => {
    const provider = new MicroStrategyProvider();

    test('should handle API errors', async () => {
      jest.spyOn(provider as any, 'fetchData').mockRejectedValue(new Error('API Error'));
      await expect(provider.fetchIndicators()).rejects.toThrow('API Error');
    });

    test('should fetch market structure indicators', async () => {
      const indicators = await provider.fetchIndicators();
      expect(Array.isArray(indicators)).toBe(true);
      expect(indicators.length).toBeGreaterThan(0);

      const indicator = indicators[0];
      expect(indicator.category).toBe('Market Structure');
      expect(indicator.currentValue).toBeDefined();
    });
  });

  describe('Prediction Provider', () => {
    const provider = new PredictionProvider();

    test('should handle API errors', async () => {
      jest.spyOn(provider as any, 'fetchData').mockRejectedValue(new Error('API Error'));
      await expect(provider.fetchIndicators()).rejects.toThrow('API Error');
    });

    test('should fetch sentiment indicators', async () => {
      const indicators = await provider.fetchIndicators();
      expect(Array.isArray(indicators)).toBe(true);
      expect(indicators.length).toBeGreaterThan(0);

      const indicator = indicators[0];
      expect(indicator.category).toBe('Sentiment');
      expect(indicator.currentValue).toBeDefined();
    });
  });
});

describe('Indicator Validation', () => {
  test('should validate correct indicator data', () => {
    const validData: IIndicator = {
      updatedAt: new Date(),
      id: 1,
      category: 'Technical',
      nameZh: '测试指标',
      nameEn: 'Test Indicator',
      currentValue: 100,
      targetValue: 200,
      principle: 'Test principle',
      calculation: 'Test calculation',
      usage: 'Test usage',
      dataSource: 'https://example.com'
    };

    expect(() => Validator.validateIndicator(validData)).not.toThrow();
  });

  test('should reject invalid indicator data', () => {
    const invalidData: IIndicator = {
      id: -1,
      category: '',
      nameZh: '',
      nameEn: '',
      currentValue: 'invalid' as unknown as number,
      targetValue: NaN,
      principle: '',
      calculation: '',
      usage: '',
      dataSource: 'invalid-url',
      updatedAt: new Date()
    };

    expect(() => Validator.validateIndicator(invalidData)).toThrow();
  });
});

describe('Indicator Provider Tests', () => {
  describe('TradingView Provider', () => {
    const provider = new TradingViewProvider();

    test('should transform raw data to indicator format', async () => {
      jest.spyOn(provider as any, 'fetchData').mockResolvedValue({
        rsi: 65,
        macd: 0.5,
        bb_upper: 45000
      });

      const indicators = await provider.fetchIndicators();
      expect(indicators).toHaveLength(3);
      expect(indicators[0]).toMatchObject({
        category: 'Technical',
        nameEn: 'RSI',
        currentValue: 65
      });
    });

    test('should handle missing data gracefully', async () => {
      jest.spyOn(provider as any, 'fetchData').mockResolvedValue({});
      const indicators = await provider.fetchIndicators();
      expect(indicators).toHaveLength(0);
    });
  });

  describe('BlockchainCenter Provider', () => {
    const provider = new BlockchainCenterProvider();

    test('should transform on-chain metrics correctly', async () => {
      jest.spyOn(provider as any, 'fetchData').mockResolvedValue({
        nupl: 0.5,
        rhodl: 2.5,
        sopr: 1.02
      });

      const indicators = await provider.fetchIndicators();
      expect(indicators).toHaveLength(3);
      expect(indicators[0]).toMatchObject({
        category: 'On-chain',
        currentValue: expect.any(Number)
      });
    });
  });

  describe('MicroStrategy Provider', () => {
    const provider = new MicroStrategyProvider();

    test('should calculate cost basis correctly', async () => {
      jest.spyOn(provider as any, 'fetchData').mockResolvedValue({
        totalInvestment: 4000000000,
        totalBitcoin: 100000
      });

      const indicators = await provider.fetchIndicators();
      expect(indicators[0]).toMatchObject({
        category: 'Market Structure',
        nameEn: 'Institutional Cost Basis',
        currentValue: 40000
      });
    });
  });

  describe('Prediction Provider', () => {
    const provider = new PredictionProvider();

    test('should process sentiment indicators', async () => {
      jest.spyOn(provider as any, 'fetchData').mockResolvedValue({
        fearGreedIndex: 75,
        marketSentiment: 0.8
      });

      const indicators = await provider.fetchIndicators();
      expect(indicators).toHaveLength(2);
      expect(indicators[0]).toMatchObject({
        category: 'Sentiment',
        currentValue: expect.any(Number)
      });
    });
  });
});

describe('Data Utils', () => {
  test('should calculate percentage change correctly', () => {
    expect(DataUtils.calculatePercentageChange(110, 100)).toBe(10);
    expect(DataUtils.calculatePercentageChange(90, 100)).toBe(-10);
  });

  test('should calculate moving average correctly', () => {
    const data = [1, 2, 3, 4, 5];
    const ma3 = DataUtils.calculateMA(data, 3);
    expect(ma3).toEqual([2, 3, 4]);
  });
});

describe('Security', () => {
  const secretKey = 'test-secret-key-32-chars-long-123';

  test('should encrypt and decrypt data correctly', () => {
    const originalText = 'test data';
    const encrypted = Security.encrypt(originalText, secretKey);
    const decrypted = Security.decrypt(encrypted, secretKey);
    expect(decrypted).toBe(originalText);
  });

  test('should generate and verify JWT token', () => {
    const payload = { userId: 1 };
    const token = Security.generateToken(payload);
    const decoded = Security.verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
  });
});
