// src/types/index.ts
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

// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IndicatorTable } from '../components/IndicatorTable';
import { IndicatorChart } from '../components/IndicatorChart';
import { fetchIndicators } from '../api';
import type { Indicator } from '../types';

const Dashboard = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIndicators();
        setIndicators(data);
      } catch (err) {
        setError('Failed to load indicators');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // 每5分钟更新一次数据
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
            <StatsCard
              title="已触发指标"
              value={indicators.filter(i => i.currentValue >= i.targetValue).length}
              total={indicators.length}
            />
            <StatsCard
              title="最近更新"
              value={new Date().toLocaleString()}
            />
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

// src/components/IndicatorTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Indicator } from '../types';

interface IndicatorTableProps {
  indicators: Indicator[];
}

export const IndicatorTable: React.FC<IndicatorTableProps> = ({ indicators }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>序号</TableHead>
          <TableHead>分类</TableHead>
          <TableHead>指标名称</TableHead>
          <TableHead>当前值</TableHead>
          <TableHead>目标值</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>更新时间</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {indicators.map((indicator) => (
          <TableRow key={indicator.id}>
            <TableCell>{indicator.id}</TableCell>
            <TableCell>{indicator.category}</TableCell>
            <TableCell>
              <div>{indicator.nameZh}</div>
              <div className="text-sm text-gray-500">{indicator.nameEn}</div>
            </TableCell>
            <TableCell>{indicator.currentValue}</TableCell>
            <TableCell>{indicator.targetValue}</TableCell>
            <TableCell>
              {typeof indicator.currentValue === 'number' && 
               typeof indicator.targetValue === 'number' && 
               indicator.currentValue >= indicator.targetValue ? 
                <span className="text-red-500">已触发</span> : 
                <span className="text-green-500">正常</span>
              }
            </TableCell>
            <TableCell>{new Date(indicator.updatedAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// src/api/index.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const fetchIndicators = async () => {
  const response = await axios.get(`${API_BASE_URL}/indicators`);
  return response.data;
};

export const fetchIndicatorHistory = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/indicators/${id}/history`);
  return response.data;
};
