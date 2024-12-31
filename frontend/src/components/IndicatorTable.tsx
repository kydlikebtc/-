import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import type { Indicator, IndicatorCategory } from '../types';
import { INDICATOR_CATEGORIES } from '../types/indicator';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { formatValue } from '../utils';

interface IndicatorTableProps {
  indicators: Indicator[];
}

export const IndicatorTable: React.FC<IndicatorTableProps> = ({ 
  indicators 
}) => {
  const [sortField, setSortField] = useState<keyof Indicator>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<IndicatorCategory | ''>('');

  const filteredAndSortedIndicators = useMemo(() => {
    const result = selectedCategory
      ? indicators.filter(i => i.category === selectedCategory)
      : indicators;

    return result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (sortField === 'updatedAt') {
        const aDate = new Date(aValue as string | number | Date);
        const bDate = new Date(bValue as string | number | Date);
        return sortDirection === 'asc' 
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }
      
      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr, 'zh-CN')
        : bStr.localeCompare(aStr, 'zh-CN');
    });
  }, [indicators, selectedCategory, sortField, sortDirection]);

  const handleSort = (field: keyof Indicator) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: keyof Indicator) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
            序号 {renderSortIcon('id')}
          </TableHead>
          <TableHead>
            <div className="flex items-center space-x-2">
              <span onClick={() => handleSort('category')} className="cursor-pointer">
                分类 {renderSortIcon('category')}
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as IndicatorCategory | '')}
                className="ml-2 text-sm border rounded-md p-1"
              >
                <option value="">全部</option>
                {INDICATOR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </TableHead>
          <TableHead onClick={() => handleSort('nameZh')} className="cursor-pointer">
            指标名称 {renderSortIcon('nameZh')}
          </TableHead>
          <TableHead onClick={() => handleSort('currentValue')} className="cursor-pointer">
            当前值 {renderSortIcon('currentValue')}
          </TableHead>
          <TableHead onClick={() => handleSort('targetValue')} className="cursor-pointer">
            目标值 {renderSortIcon('targetValue')}
          </TableHead>
          <TableHead>状态</TableHead>
          <TableHead onClick={() => handleSort('updatedAt')} className="cursor-pointer">
            更新时间 {renderSortIcon('updatedAt')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAndSortedIndicators.map((indicator) => (
          <TableRow 
            key={indicator.id}
            className={indicator.targetValue !== undefined && indicator.currentValue >= indicator.targetValue
              ? 'bg-red-50'
              : undefined
            }
          >
            <TableCell>{indicator.id}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${indicator.category === 'Technical' ? 'bg-blue-100 text-blue-800' :
                  indicator.category === 'On-chain' ? 'bg-yellow-100 text-yellow-800' :
                  indicator.category === 'Market Structure' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'}`
              }>
                {indicator.category}
              </span>
            </TableCell>
            <TableCell>
              <div>{indicator.nameZh}</div>
              <div className="text-sm text-gray-500">{indicator.nameEn}</div>
              {indicator.principle && (
                <div className="text-xs text-gray-400 mt-1">{indicator.principle}</div>
              )}
            </TableCell>
            <TableCell className="font-mono">
              {formatValue(indicator.currentValue, 4)}
            </TableCell>
            <TableCell className="font-mono">
              {indicator.targetValue !== undefined ? formatValue(indicator.targetValue, 4) : '-'}
            </TableCell>
            <TableCell>
              {indicator.targetValue !== undefined ? (
                indicator.currentValue >= indicator.targetValue ? 
                  <span className="text-red-500 font-medium">已触发</span> : 
                  <span className="text-green-500 font-medium">正常</span>
              ) : (
                <span className="text-gray-400">未设置</span>
              )}
            </TableCell>
            <TableCell>
              {format(
                new Date(indicator.updatedAt),
                'yyyy年MM月dd日 HH:mm',
                { locale: zhCN }
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
