export interface IIndicator {
  id: number;
  nameEn: string;
  nameZh: string;
  currentValue: number;
  targetValue?: number;
  category: string;
  updatedAt: Date;
  principle: string;
  calculation: string;
  usage: string;
  dataSource: string;
}

export interface IIndicatorHistory {
  indicatorId: number;
  value: number;
  timestamp: Date;
}
