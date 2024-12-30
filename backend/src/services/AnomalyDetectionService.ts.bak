import { IIndicator, IIndicatorHistory } from '../types/indicator';
import { Notifier } from '../utils/notifier';

import { IndicatorThreshold } from '../types/indicator';

const INDICATOR_THRESHOLDS: IndicatorThreshold[] = [
  {
    id: 1,
    category: '机构指标',
    nameZh: '微策略成本',
    nameEn: 'MicroStrategy Cost Basis',
    targetValue: '155655',
    comparison: 'lte',
    principle: '跟踪最大机构持有者的成本基准'
  },
  {
    id: 2,
    category: '技术指标',
    nameZh: 'AHR999逃顶指标',
    nameEn: 'AHR999 Top Signal',
    targetValue: '0.45',
    comparison: 'lte',
    principle: '价格与均线偏离度'
  },
  {
    id: 3,
    category: '技术指标',
    nameZh: 'AHR999囤币指标',
    nameEn: 'AHR999 Accumulation',
    targetValue: '4',
    comparison: 'gte',
    principle: '判断价值投资区间'
  },
  {
    id: 4,
    category: '技术指标',
    nameZh: '梅耶倍数',
    nameEn: 'Mayer Multiple',
    targetValue: '2.2',
    comparison: 'gte',
    principle: '价格偏离程度'
  },
  {
    id: 5,
    category: '周期指标',
    nameZh: 'PI周期指标',
    nameEn: 'PI Cycle Top',
    targetValue: '131897',
    comparison: 'gte',
    principle: '多均线交叉信号'
  },
  {
    id: 9,
    category: '情绪指标',
    nameZh: 'CBI指数',
    nameEn: 'Crypto Bull Index',
    targetValue: '90',
    comparison: 'gte',
    principle: '市场情绪综合指标'
  },
  {
    id: 10,
    category: '温度指标',
    nameZh: 'BT指数',
    nameEn: 'Bitcoin Temperature',
    targetValue: '7',
    comparison: 'gte',
    principle: '市场热度计量'
  },
  {
    id: 11,
    category: '资金指标',
    nameZh: 'USDT活期理财',
    nameEn: 'USDT Savings Rate',
    targetValue: '29',
    comparison: 'gte',
    principle: '稳定币收益率'
  },
  {
    id: 12,
    category: '估值指标',
    nameZh: '泡沫指数',
    nameEn: 'Bubble Index',
    targetValue: '80',
    comparison: 'gte',
    principle: '市场泡沫程度'
  },
  {
    id: 15,
    category: '动量指标',
    nameZh: '22日RSI',
    nameEn: '22-Day RSI',
    targetValue: '80',
    comparison: 'gte',
    principle: '动量过热判断'
  },
  {
    id: 16,
    category: '收益指标',
    nameZh: '3月年化比例',
    nameEn: '3M Annual Rate',
    targetValue: '30',
    comparison: 'gte',
    principle: '短期收益率'
  },
  {
    id: 17,
    category: '资金流向',
    nameZh: 'ETF净流出天数',
    nameEn: 'ETF Net Outflow Days',
    targetValue: '10',
    comparison: 'gte',
    principle: '机构资金流向'
  },
  {
    id: 18,
    category: '持仓指标',
    nameZh: 'ETF占BTC比例',
    nameEn: 'ETF/BTC Ratio',
    targetValue: '3.5',
    comparison: 'lte',
    principle: '机构持仓集中度'
  },
  {
    id: 20,
    category: '估值指标',
    nameZh: 'MVRV比率',
    nameEn: 'MVRV Ratio',
    targetValue: '3',
    comparison: 'gte',
    principle: '市值偏离程度'
  },
  {
    id: 21,
    category: '统计指标',
    nameZh: 'MVRV Z-Score',
    nameEn: 'MVRV Z-Score',
    targetValue: '5',
    comparison: 'gte',
    principle: '标准化偏离度'
  },
  {
    id: 22,
    category: '矿工指标',
    nameZh: 'Puell Multiple',
    nameEn: 'Puell Multiple',
    targetValue: '2.2',
    comparison: 'gte',
    principle: '矿工收入状况'
  },
  {
    id: 23,
    category: '技术指标',
    nameZh: 'OscillatorBMO',
    nameEn: 'OscillatorBMO',
    targetValue: '1.4',
    comparison: 'gte',
    principle: '市场动量'
  },
  {
    id: 24,
    category: '持有者指标',
    nameZh: 'RHODL比率',
    nameEn: 'RHODL Ratio',
    targetValue: '10000',
    comparison: 'gte',
    principle: '老币持有行为'
  },
  {
    id: 25,
    category: '盈亏指标',
    nameZh: 'NUPL',
    nameEn: 'Net Unrealized P/L',
    targetValue: '0.7',
    comparison: 'gte',
    principle: '未实现盈亏比'
  },
  {
    id: 26,
    category: '风险指标',
    nameZh: 'Reserve Risk',
    nameEn: 'Reserve Risk',
    targetValue: '0.005',
    comparison: 'gte',
    principle: '储备风险评估'
  },
  {
    id: 27,
    category: '供应指标',
    nameZh: '短期持有供应',
    nameEn: 'ST Holder Supply',
    targetValue: '30',
    comparison: 'gte',
    principle: '短期持有比例'
  },
  {
    id: 28,
    category: '流动性指标',
    nameZh: '长期持有者流出',
    nameEn: 'LT Holder Outflow',
    targetValue: '13.5',
    comparison: 'lte',
    principle: '老币转移情况'
  },
  {
    id: 29,
    category: '市场结构',
    nameZh: '山寨季BTC冲顶',
    nameEn: 'Alt Season BTC Top',
    targetValue: '65',
    comparison: 'gte',
    principle: '市场轮动状态'
  },
  {
    id: 30,
    category: '市场结构',
    nameZh: '山寨季指数',
    nameEn: 'Alt Season Index',
    targetValue: '75',
    comparison: 'gte',
    principle: '山寨币活跃度'
  }
];

import { IIndicator } from '../types/indicator';
import { IHistoricalData, IAnomaly, ITrendChange } from '../types/provider';
import { Notifier } from '../utils/notifier';

interface INotificationPayload {
  title: string;
  message: string;
  level: IAnomaly['severity'];
}

export class AnomalyDetectionService {
  constructor(private notifier: Notifier) {}

  public async detectAnomalies(indicators: IIndicator[]): Promise<IAnomaly[]> {
    const anomalies: IAnomaly[] = [];
    
    for (const indicator of indicators) {
      if (this.isThresholdBreach(indicator)) {
        anomalies.push(this.createAnomaly('THRESHOLD_BREACH', indicator));
      }
    }
    
    return anomalies;
  }

  public detectTrendChange(data: IHistoricalData[]): ITrendChange {
    if (data.length < 2) {
      return { direction: 'stable', magnitude: 0, confidence: 0 };
    }

    const values = data.map(d => d.value);
    const lastValue = values[values.length - 1];
    const prevValue = values[values.length - 2];
    
    const direction = lastValue > prevValue ? 'up' : lastValue < prevValue ? 'down' : 'stable';
    const magnitude = Math.abs((lastValue - prevValue) / prevValue) * 100;
    
    return {
      direction,
      magnitude,
      confidence: this.calculateConfidence(magnitude)
    };
  }

  public async handleAnomaly(anomaly: IAnomaly): Promise<void> {
    if (anomaly.severity === 'CRITICAL' || anomaly.severity === 'HIGH') {
      await this.notifier.sendNotification({
        title: `${anomaly.type} Alert`,
        message: this.formatAnomalyMessage(anomaly),
        level: anomaly.severity
      });
    }
  }

  private isThresholdBreach(indicator: IIndicator): boolean {
    if (!indicator.targetValue) return false;
    const current = typeof indicator.currentValue === 'number' ? 
      indicator.currentValue : 
      parseFloat(String(indicator.currentValue));
    const target = typeof indicator.targetValue === 'number' ? 
      indicator.targetValue : 
      parseFloat(String(indicator.targetValue));
    
    return Math.abs(current - target) / target > 0.1; // 10% threshold
  }

  private createAnomaly(type: IAnomaly['type'], indicator: IIndicator): IAnomaly {
    return {
      type,
      severity: this.calculateSeverity(indicator),
      indicator: {
        nameEn: indicator.nameEn,
        nameZh: indicator.nameZh,
        currentValue: indicator.currentValue,
        targetValue: indicator.targetValue
      },
      timestamp: new Date()
    };
  }

  private calculateSeverity(indicator: IIndicator): IAnomaly['severity'] {
    if (!indicator.targetValue) return 'LOW';
    const deviation = Math.abs(
      (Number(indicator.currentValue) - Number(indicator.targetValue)) / 
      Number(indicator.targetValue)
    );
    
    if (deviation > 0.5) return 'CRITICAL';
    if (deviation > 0.3) return 'HIGH';
    if (deviation > 0.2) return 'MEDIUM';
    return 'LOW';
  }

  private calculateConfidence(magnitude: number): number {
    return Math.min(Math.max(magnitude / 10, 0), 1);
  }

  private formatAnomalyMessage(anomaly: IAnomaly): string {
    return `
      ${anomaly.indicator.nameZh} (${anomaly.indicator.nameEn})
      Type: ${anomaly.type}
      Severity: ${anomaly.severity}
      Current Value: ${anomaly.indicator.currentValue}
      Target Value: ${anomaly.indicator.targetValue || 'N/A'}
      ${anomaly.details ? `Details: ${anomaly.details}` : ''}
    `.trim();
  }
}
  private parseValue(value: number | string): number | null {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return null;

    // Remove percentage sign and convert to number
    const cleanValue = value.replace('%', '');
    const parsedValue = parseFloat(cleanValue);

    return isNaN(parsedValue) ? null : parsedValue;
  }

  private notifier: Notifier;

  constructor(notifier?: Notifier) {
    this.notifier = notifier || Notifier.getInstance();
  }

  public async detectAnomalies(indicator: IIndicator): Promise<boolean> {
    const threshold = INDICATOR_THRESHOLDS.find(t => t.id === indicator.id);
    if (!threshold) return false;

    // Convert values to numbers, handling percentage values
    const currentValue = this.parseValue(indicator.currentValue);
    const targetValue = this.parseValue(threshold.targetValue);

    if (currentValue === null || targetValue === null) return false;

    let isAnomaly = false;
    switch (threshold.comparison) {
      case 'gte':
        isAnomaly = currentValue >= targetValue;
        break;
      case 'lte':
        isAnomaly = currentValue <= targetValue;
        break;
      case 'eq':
        isAnomaly = Math.abs(currentValue - targetValue) < 0.0001; // Use small epsilon for floating point comparison
        break;
    }

    if (isAnomaly) {
      await this.notifyAnomaly(indicator, threshold);
    }

    return isAnomaly;
  }

  public async detectTrends(indicator: IIndicator, history: IIndicatorHistory[]): Promise<void> {
    if (history.length < 2) return;

    const threshold = INDICATOR_THRESHOLDS.find(t => t.id === indicator.id);
    if (!threshold) return;

    // Sort history by timestamp in ascending order
    const sortedHistory = [...history].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Convert and validate values
    const latestValue = this.parseValue(sortedHistory[sortedHistory.length - 1].value);
    const previousValue = this.parseValue(sortedHistory[sortedHistory.length - 2].value);
    
    if (latestValue === null || previousValue === null) return;

    // Calculate rate of change
    const rateOfChange = ((latestValue - previousValue) / previousValue) * 100;

    // Detect rapid changes (more than 10% in either direction)
    if (Math.abs(rateOfChange) > 10) {
      const direction = rateOfChange > 0 ? '上升' : '下降';
      await this.notifier.sendAlert(
        `${threshold.nameZh} (${threshold.nameEn}) 快速${direction}预警`,
        `指标: ${threshold.nameZh} (${threshold.nameEn})
分类: ${threshold.category}
变化: ${Math.abs(rateOfChange).toFixed(2)}%
原理: ${threshold.principle}
当前值: ${indicator.currentValue}
目标值: ${threshold.targetValue}
时间: ${new Date().toISOString()}`
      );
    }

    // Detect approach to threshold (within 5%)
    const currentValue = this.parseValue(indicator.currentValue);
    const targetValue = this.parseValue(threshold.targetValue);
    
    if (currentValue === null || targetValue === null) return;

    const distanceToThreshold = Math.abs((currentValue - targetValue) / targetValue) * 100;
    
    if (distanceToThreshold <= 5) {
      await this.notifier.sendAlert(
        `${threshold.nameZh} (${threshold.nameEn}) 临界值预警`,
        `指标: ${threshold.nameZh} (${threshold.nameEn})
分类: ${threshold.category}
距离临界值: ${distanceToThreshold.toFixed(2)}%
原理: ${threshold.principle}
当前值: ${indicator.currentValue}
目标值: ${threshold.targetValue}
时间: ${new Date().toISOString()}`
      );
    }
  }

  private async notifyAnomaly(indicator: IIndicator, threshold: IndicatorThreshold): Promise<void> {
    const title = `${threshold.nameZh} (${threshold.nameEn}) 市场异常预警`;
    const message = `指标异常预警
指标名称: ${threshold.nameZh} (${threshold.nameEn})
指标分类: ${threshold.category}
指标原理: ${threshold.principle}
当前数值: ${indicator.currentValue}
目标数值: ${threshold.targetValue}
触发条件: ${threshold.comparison === 'gte' ? '>=' : threshold.comparison === 'lte' ? '<=' : '='} ${threshold.targetValue}
触发时间: ${new Date().toISOString()}`;

    await this.notifier.notifyAll(title, message);
  }
}
