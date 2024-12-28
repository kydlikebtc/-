# BTCtop - Crypto Market Top Signals Analysis Framework

A comprehensive framework for analyzing and monitoring cryptocurrency market indicators, providing real-time insights and alerts for market trends.

## Project Structure

```
project/
├── frontend/               # Frontend code
│   ├── src/
│   │   ├── components/    # Components
│   │   ├── pages/        # Pages
│   │   ├── api/          # API calls
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
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

## Technology Stack

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Recharts
- ShadcnUI

### Backend
- Node.js
- Express
- MongoDB
- Redis
- TypeScript

### System Architecture
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

## Features

- Real-time monitoring of 30+ market indicators
- Historical data tracking and analysis
- Anomaly detection and alerts
- Multiple notification channels (Email, DingDing, WeCom)
- Comprehensive data visualization
- Secure authentication and authorization

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- Redis

### Installation

1. Clone the repository
```bash
git clone https://github.com/kydlikebtc/BTCtop.git
cd BTCtop
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables
- Create `.env` files in both frontend and backend directories
- Set up necessary API keys and database connections

5. Start the services
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in a new terminal)
cd frontend
npm run dev
```

## Documentation

For detailed documentation about the indicators and their implementation, please refer to the `docs` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
