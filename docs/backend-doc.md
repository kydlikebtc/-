# 后端开发文档

## 1. 技术架构

### 1.1 技术栈
- Node.js
- Express
- TypeScript
- MongoDB
- Redis
- Jest

### 1.2 项目结构
```
backend/
├── src/
│   ├── routes/           # 路由定义
│   ├── controllers/      # 控制器
│   ├── services/         # 业务服务
│   ├── models/           # 数据模型
│   ├── utils/            # 工具类
│   └── config/           # 配置文件
├── tests/                # 测试文件
└── docs/                 # API文档
```

## 2. 数据模型

### 2.1 指标模型 (Indicator)
```typescript
// models/Indicator.ts
interface IIndicator extends Document {
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
  updatedAt: Date;
}

const IndicatorSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  category: { type: String, required: true },
  nameZh: { type: String, required: true },
  nameEn: { type: String, required: true },
  currentValue: { type: Schema.Types.Mixed, required: true },
  targetValue: { type: String, required: true },
  principle: {