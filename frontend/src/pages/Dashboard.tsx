import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { IndicatorTable } from '../components/IndicatorTable';
import { IndicatorChart } from '../components/IndicatorChart';
import type { Indicator } from '../types/indicator';
import { generateTestIndicators } from '../utils/testData';

const Dashboard = () => {
  const [indicators, setIndicators] = useState<Indicator[]>(() => generateTestIndicators(30));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // For development, use test data and simulate updates
    const simulateDataUpdate = () => {
      setIndicators(generateTestIndicators(30));
      setLoading(false);
    };

    simulateDataUpdate();
    // Refresh test data every 5 minutes to simulate updates
    const interval = setInterval(simulateDataUpdate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>市场指标概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stats-card">
              <h3>已触发指标</h3>
              <p>{indicators.filter(i => i.currentValue >= (i.targetValue ?? 0)).length}</p>
              <p>共 {indicators.length} 个</p>
            </div>
            <div className="stats-card">
              <h3>最近更新</h3>
              <p>{new Date().toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>指标详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[calc(100vh-24rem)] overflow-auto">
            <div className="min-w-full">
              <IndicatorTable indicators={indicators} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>历史趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <IndicatorChart indicators={indicators} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
