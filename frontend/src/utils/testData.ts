import { Indicator, INDICATOR_CATEGORIES, IndicatorCategory } from '../types/indicator';

export const generateTestIndicators = (count: number = 30): Indicator[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    nameEn: `Test Indicator ${i + 1}`,
    nameZh: `测试指标 ${i + 1}`,
    category: INDICATOR_CATEGORIES[i % INDICATOR_CATEGORIES.length] as IndicatorCategory,
    currentValue: Number((Math.random() * 100).toFixed(2)),
    targetValue: Number((Math.random() * 100).toFixed(2)),
    updatedAt: new Date().toISOString(),
    principle: `Principle for indicator ${i + 1}`,
    calculation: `Calculation method ${i + 1}`,
    usage: `Usage guidelines ${i + 1}`,
    dataSource: 'Test Data Provider'
  }));
};
