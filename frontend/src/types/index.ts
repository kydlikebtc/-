export interface Indicator {
  id: number;
  category: string;
  nameZh: string;
  nameEn: string;
  currentValue: number | string;
  targetValue: string;
  principle: string;
  calculation: string;
  usage: string;
  dataSource: string;
  updatedAt: string;
}
