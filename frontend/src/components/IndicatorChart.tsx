import React from 'react';
import { Line } from 'react-chartjs-2';
import type { Indicator } from '../types';

interface IndicatorChartProps {
  indicators: Indicator[];
}

export const IndicatorChart: React.FC<IndicatorChartProps> = ({ indicators }) => {
  const data = {
    labels: indicators.map(i => i.nameZh),
    datasets: [
      {
        label: '当前值',
        data: indicators.map(i => i.currentValue),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '指标趋势'
      }
    }
  };

  return <Line data={data} options={options} />;
};
