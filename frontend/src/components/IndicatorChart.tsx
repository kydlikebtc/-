import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import type { Indicator } from '../types';
import type { IndicatorCategory } from '../types/indicator';
import { toNumber } from '../utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IndicatorChartProps {
  indicators: Indicator[];
  category?: IndicatorCategory;
}

const CHART_COLORS = {
  current: 'rgb(75, 192, 192)',
  target: 'rgb(255, 99, 132)',
  Technical: 'rgb(54, 162, 235)',
  'On-chain': 'rgb(255, 206, 86)',
  'Market Structure': 'rgb(75, 192, 192)',
  'Sentiment': 'rgb(153, 102, 255)',
};

export const IndicatorChart: React.FC<IndicatorChartProps> = ({ 
  indicators,
  category 
}) => {
  const filteredIndicators = useMemo(() => 
    category ? indicators.filter(i => i.category === category) : indicators,
    [indicators, category]
  );

  const data = useMemo(() => ({
    labels: filteredIndicators.map(i => i.nameZh),
    datasets: [
      {
        label: '当前值',
        data: filteredIndicators.map(i => toNumber(i.currentValue)),
        borderColor: CHART_COLORS.current,
        backgroundColor: CHART_COLORS.current + '40',
        tension: 0.1,
        fill: true
      },
      {
        label: '目标值',
        data: filteredIndicators.map(i => i.targetValue !== undefined ? toNumber(i.targetValue) : null),
        borderColor: CHART_COLORS.target,
        backgroundColor: CHART_COLORS.target + '40',
        borderDash: [5, 5],
        tension: 0.1,
        fill: false
      }
    ]
  }), [filteredIndicators]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: category ? `${category}指标趋势` : '全部指标趋势'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const indicator = filteredIndicators[context.dataIndex];
            const value = context.parsed.y;
            if (!value) return '';
            return `${context.dataset.label}: ${value.toFixed(2)}${
              indicator.principle ? `\n说明: ${indicator.principle}` : ''
            }`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
};
