# 前端开发文档

## 1. 技术栈说明

### 1.1 核心技术
- React 18
- TypeScript
- TailwindCSS
- ShadcnUI
- Recharts

### 1.2 开发工具
- Vite
- ESLint
- Prettier
- Jest

## 2. 项目结构

```
frontend/
├── src/
│   ├── components/        # 组件
│   │   ├── common/       # 通用组件
│   │   ├── charts/       # 图表组件
│   │   └── layouts/      # 布局组件
│   ├── pages/            # 页面
│   ├── api/              # API调用
│   ├── hooks/            # 自定义Hooks
│   ├── utils/            # 工具函数
│   ├── types/            # 类型定义
│   └── styles/           # 样式文件
└── public/               # 静态资源
```

## 3. 组件说明

### 3.1 通用组件

#### Button 组件
```typescript
import { Button } from '@/components/ui/button'

<Button variant="outline" size="lg">
  Click me
</Button>
```

#### Card 组件
```typescript
import { Card } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>
    内容
  </CardContent>
</Card>
```

### 3.2 业务组件

#### IndicatorTable 组件
显示指标数据的表格组件
```typescript
interface IndicatorTableProps {
  indicators: Indicator[];
  onSort?: (field: string) => void;
  onFilter?: (filters: any) => void;
}
```

#### IndicatorChart 组件
指标趋势图表组件
```typescript
interface IndicatorChartProps {
  data: ChartData[];
  type: 'line' | 'bar';
  options?: ChartOptions;
}
```

## 4. 状态管理

### 4.1 数据流
```typescript
// 定义状态类型
interface State {
  indicators: Indicator[];
  loading: boolean;
  error: string | null;
}

// 使用状态
const [state, setState] = useState<State>({
  indicators: [],
  loading: false,
  error: null
});
```

### 4.2 Hooks使用

#### useIndicators Hook
```typescript
const useIndicators = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      // 获取数据逻辑
    };
    fetchData();
  }, []);

  return { indicators };
};
```

## 5. API 接口

### 5.1 基础配置
```typescript
// api/config.ts
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### 5.2 接口定义
```typescript
// api/indicators.ts
export const getIndicators = () => 
  api.get('/indicators');

export const getIndicatorHistory = (id: number) =>
  api.get(`/indicators/${id}/history`);
```

## 6. 样式指南

### 6.1 TailwindCSS配置
```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  },
  plugins: []
};
```

### 6.2 组件样式示例
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="p-4 hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-semibold text-gray-800">
      指标名称
    </h3>
  </Card>
</div>
```

## 7. 性能优化

### 7.1 代码分割
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));
```

### 7.2 性能监控
```typescript
import { useEffect } from 'react';

const usePerformanceMonitor = () => {
  useEffect(() => {
    // 性能监控逻辑
  }, []);
};
```

## 8. 测试

### 8.1 单元测试
```typescript
// __tests__/IndicatorTable.test.tsx
import { render, screen } from '@testing-library/react';
import { IndicatorTable } from '../components/IndicatorTable';

describe('IndicatorTable', () => {
  it('renders correctly', () => {
    render(<IndicatorTable indicators={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
```

### 8.2 集成测试
```typescript
describe('Dashboard integration', () => {
  it('loads and displays data', async () => {
    // 测试逻辑
  });
});
```

## 9. 构建部署

### 9.1 构建配置
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts']
        }
      }
    }
  }
});
```

### 9.2 部署步骤
1. 构建项目
```bash
npm run build
```

2. 检查构建产物
```bash
npm run preview
```

3. 部署到服务器
```bash
# 使用Docker部署
docker build -t frontend .
docker run -d -p 80:80 frontend
```

## 10. 常见问题

### 10.1 性能问题
- 大量数据渲染优化
- 防抖节流处理
- 内存泄漏处理

### 10.2 兼容性问题
- 浏览器兼容性处理
- 移动端适配
- 分辨率适配

## 11. 最佳实践

### 11.1 代码规范
- 使用TypeScript
- 遵循ESLint规则
- 保持代码整洁

### 11.2 组件设计
- 单一职责
- 可复用性
- 性能优化

### 11.3 状态管理
- 合理使用状态
- 避免过度设计
- 保持数据流清晰
