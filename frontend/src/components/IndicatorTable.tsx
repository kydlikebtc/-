import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
