import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { AnomalyDetectionService } from '../services/AnomalyDetectionService';
import { Notifier } from '../utils/notifier';
import { IIndicator } from '../types/indicator';
import { IAnomaly } from '../types/provider';

jest.mock('../utils/notifier');
jest.mock('../utils/logger');

describe('Anomaly Detection Service', () => {
  const mockNotifier = new Notifier();
  const service = new AnomalyDetectionService(mockNotifier);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should detect threshold breaches', async () => {
    const indicators: IIndicator[] = [
      {
        id: 1,
        nameEn: 'Test Indicator',
        nameZh: '测试指标',
        currentValue: 150,
        targetValue: 100,
        category: 'Technical',
        updatedAt: new Date(),
        principle: 'Test principle',
        calculation: 'Test calculation',
        usage: 'Test usage',
        dataSource: 'Test data source'
      }
    ];

    const anomalies = await service.detectAnomalies(indicators);
    expect(anomalies.length).toBe(1);
    expect(anomalies[0]).toHaveProperty('type', 'THRESHOLD_BREACH');
  });

  test('should detect trend changes', () => {
    const historicalData = [
      { value: 100, timestamp: new Date('2024-01-01') },
      { value: 110, timestamp: new Date('2024-01-02') },
      { value: 90, timestamp: new Date('2024-01-03') }
    ];

    const trendChange = service.detectTrendChange(historicalData);
    expect(trendChange).toHaveProperty('direction');
    expect(trendChange).toHaveProperty('magnitude');
  });

  test('should send notifications for critical anomalies', async () => {
    const criticalAnomaly: IAnomaly = {
      type: 'THRESHOLD_BREACH',
      severity: 'CRITICAL',
      timestamp: new Date(),
      indicator: {
        nameEn: 'Critical Indicator',
        nameZh: '关键指标',
        currentValue: 200,
        targetValue: 100
      }
    };

    await service.handleAnomaly(criticalAnomaly);
    expect(mockNotifier.sendNotification).toHaveBeenCalled();
  });

  test('should handle multiple anomaly types', async () => {
    const indicators: IIndicator[] = [
      {
        id: 1,
        nameEn: 'Volatile Indicator',
        nameZh: '波动指标',
        currentValue: 150,
        targetValue: 100,
        category: 'Technical',
        updatedAt: new Date(),
        principle: 'Volatility principle',
        calculation: 'Volatility calculation',
        usage: 'Volatility usage',
        dataSource: 'Volatility data source'
      },
      {
        id: 2,
        nameEn: 'Stable Indicator',
        nameZh: '稳定指标',
        currentValue: 50,
        targetValue: 50,
        category: 'Market Structure',
        updatedAt: new Date(),
        principle: 'Stability principle',
        calculation: 'Stability calculation',
        usage: 'Stability usage',
        dataSource: 'Stability data source'
      }
    ];

    const anomalies = await service.detectAnomalies(indicators);
    expect(Array.isArray(anomalies)).toBe(true);
    expect(anomalies.some(a => a.type === 'THRESHOLD_BREACH')).toBe(true);
  });
});
