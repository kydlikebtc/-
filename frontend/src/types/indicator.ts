export const INDICATOR_CATEGORIES = [
  'Technical',
  'On-chain',
  'Market Structure',
  'Sentiment',
] as const;

export type IndicatorCategory = typeof INDICATOR_CATEGORIES[number];

export interface Indicator {
  id: number;
  nameEn: string;
  nameZh: string;
  currentValue: number | string;
  targetValue?: number | string;
  category: IndicatorCategory;
  updatedAt: string | Date;
  // Additional metadata fields
  principle?: string;
  calculation?: string;
  usage?: string;
  dataSource?: string;
}
