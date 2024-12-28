import { IIndicator } from '../types/indicator';

export interface IValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  static validateIndicator(data: IIndicator): void {
    if (data.id < 0) {
      throw new Error('Invalid ID');
    }
    if (!data.category) {
      throw new Error('Category is required');
    }
    if (!data.nameZh || !data.nameEn) {
      throw new Error('Name is required in both languages');
    }
    if (typeof data.currentValue !== 'number') {
      throw new Error('Current value must be a number');
    }
    if (!data.targetValue) {
      throw new Error('Target value is required');
    }
    if (!data.principle || !data.calculation || !data.usage) {
      throw new Error('Principle, calculation, and usage are required');
    }
    if (!this.isValidUrl(data.dataSource)) {
      throw new Error('Invalid data source URL');
    }
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
