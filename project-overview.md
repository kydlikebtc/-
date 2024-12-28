# 加密货币市场指标监控系统

## 1. 项目概述

### 1.1 系统功能
- 实时监控30个关键市场指标
- 历史数据分析和可视化
- 指标异常预警
- 数据导出和报告生成

### 1.2 系统架构
```
├── 前端层 (React + TypeScript)
│   ├── 用户界面
│   ├── 数据可视化
│   └── 状态管理
├── 后端层 (Node.js + Express)
│   ├── API服务
│   ├── 数据处理
│   └── 业务逻辑
└── 数据层
    ├── MongoDB (主数据库)
    └── Redis (缓存)
```

### 1.3 技术栈
- 前端
  * React 18
  * TypeScript
  * TailwindCSS
  * Recharts
  * ShadcnUI

- 后端
  * Node.js
  * Express
  * MongoDB
  * Redis
  * TypeScript

### 1.4 核心功能
1. 指标监控
   - 实时数据更新
   - 历史趋势分析
   - 异常检测

2. 数据分析
   - 技术指标计算
   - 市场情绪分析
   - 预警信号生成

3. 系统功能
   - 用户认证
   - 数据权限
   - 系统监控

## 2. 项目结构

```
project/
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/        # 页面
│   │   ├── api/          # API调用
│   │   └── utils/        # 工具函数
│   └── public/           # 静态资源
├── backend/               # 后端代码
│   ├── src/
│   │   ├── routes/       # 路由
│   │   ├── controllers/  # 控制器
│   │   ├── models/       # 数据模型
│   │   ├── services/     # 业务服务
│   │   └── utils/        # 工具类
│   └── tests/            # 测试文件
└── docs/                 # 项目文档
```

## 3. 开发环境

### 3.1 环境要求
- Node.js >= 18.0.0
- MongoDB >= 6.0
- Redis >= 7.0
- TypeScript >= 5.0

### 3.2 开发工具
- VS Code
- MongoDB Compass
- Redis Desktop Manager
- Postman

## 4. 快速开始

### 4.1 环境准备
```bash
# 安装Node.js依赖
npm install

# 启动数据库
docker-compose up -d
```

### 4.2 开发启动
```bash
# 启动前端开发服务器
cd frontend
npm run dev

# 启动后端服务
cd backend
npm run dev
```

### 4.3 生产部署
```bash
# 构建前端
cd frontend
npm run build

# 构建后端
cd backend
npm run build

# 启动服务
npm run start
```

## 5. 接口文档

参见 [API文档](./api-docs.md)

## 6. 测试

### 6.1 运行测试
```bash
# 运行所有测试
npm run test

# 运行特定测试
npm run test:unit
npm run test:integration
```

### 6.2 测试覆盖率
```bash
npm run test:coverage
```

## 7. 部署

### 7.1 部署架构
![部署架构](./deployment.png)

### 7.2 部署步骤
1. 环境配置
2. 代码部署
3. 服务启动
4. 监控配置

## 8. 维护

### 8.1 日常维护
- 日志检查
- 性能监控
- 数据备份

### 8.2 故障处理
- 错误告警
- 问题诊断
- 应急响应

## 9. 贡献指南

### 9.1 开发流程
1. Fork项目
2. 创建特性分支
3. 提交变更
4. 发起Pull Request

### 9.2 代码规范
- ESLint配置
- Prettier格式化
- TypeScript规范

## 10. 许可证

MIT License
