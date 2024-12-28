import { Validator } from '../utils/validator';
import { DataUtils } from '../utils/helpers';
import { Security } from '../utils/security';
import { describe, test, expect } from '@jest/globals';

describe('Indicator Validation', () => {
  test('should validate correct indicator data', () => {
    const validData = {
      id: 1,
      category: 'Technical',
      nameZh: '测试指标',
      nameEn: 'Test Indicator',
      currentValue: 100,
      targetValue: '200',
      principle: 'Test principle',
      calculation: 'Test calculation',
      usage: 'Test usage',
      dataSource: 'https://example.com'
    };

    expect(() => Validator.validateIndicator(validData)).not.toThrow();
  });

  test('should reject invalid indicator data', () => {
    const invalidData = {
      id: -1,
      category: '',
      nameZh: '',
      nameEn: '',
      currentValue: 'invalid' as unknown as number,
      targetValue: '',
      principle: '',
      calculation: '',
      usage: '',
      dataSource: 'invalid-url'
    };

    expect(() => Validator.validateIndicator(invalidData)).toThrow();
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
