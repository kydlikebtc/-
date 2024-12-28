export class DataUtils {
  static calculatePercentageChange(current: number, previous: number): number {
    return ((current - previous) / previous) * 100;
  }

  static calculateMA(data: number[], period: number): number[] {
    if (data.length < period) {
      return [];
    }

    const result: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
    return result;
  }
}
