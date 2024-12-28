import React from 'react';
import { IndicatorChart } from './IndicatorChart';
import type { Indicator } from '../types';
import { INDICATOR_CATEGORIES } from '../types/indicator';

interface IndicatorChartGridProps {
  indicators: Indicator[];
}


export const IndicatorChartGrid: React.FC<IndicatorChartGridProps> = ({ indicators }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {INDICATOR_CATEGORIES.map((category) => (
        <div key={category} className="p-4 bg-white rounded-lg shadow">
          <IndicatorChart 
            indicators={indicators} 
            category={category} 
          />
        </div>
      ))}
    </div>
  );
};
