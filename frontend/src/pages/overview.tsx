import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { IndicatorTable } from '../components/IndicatorTable';
import { IndicatorChart } from '../components/IndicatorChart';
import { fetchIndicators } from '../api';
import type { Indicator } from '../types/indicator';

const Overview = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIndicators();
        setIndicators(data);
      } catch {
        setError('Failed to load indicators');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

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
              <p>{indicators.filter(i => i.currentValue >= i.targetValue).length}</p>
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
          <IndicatorTable indicators={indicators} />
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

export default Overview;
