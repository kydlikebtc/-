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

Backend Configuration:
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure the following services in your `.env` file:

Database Configuration:
- `MONGODB_URI`: MongoDB connection string (default: mongodb://127.0.0.1:27017/crypto-indicators)
- `REDIS_HOST`: Redis host (default: 127.0.0.1)
- `REDIS_PORT`: Redis port (default: 6379)

API Provider Configurations:
a) TradingView API
- `TRADINGVIEW_API_BASE_URL`: TradingView API base URL
- `TRADINGVIEW_API_KEY`: Your TradingView API key

b) Glassnode API
- `GLASSNODE_API_BASE_URL`: Glassnode API base URL
- `GLASSNODE_API_KEY`: Your Glassnode API key

c) Coinglass API
- `COINGLASS_API_BASE_URL`: Coinglass API base URL
- `COINGLASS_API_KEY`: Your Coinglass API key

d) BlockchainCenter API
- `BLOCKCHAINCENTER_API_BASE_URL`: BlockchainCenter API base URL
- `BLOCKCHAINCENTER_API_KEY`: Your BlockchainCenter API key

e) Prediction Service API
- `PREDICTION_API_BASE_URL`: Prediction service API base URL
- `PREDICTION_API_KEY`: Your prediction service API key

f) MicroStrategy API
- `MICROSTRATEGY_API_BASE_URL`: MicroStrategy API base URL

Notification Configurations:
a) Email (SMTP) Settings
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port (default: 587)
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `ALERT_EMAIL`: Email address to receive alerts

b) Webhook Settings
- `DINGDING_WEBHOOK`: DingDing webhook URL with access token
- `WECOM_WEBHOOK`: WeCom webhook URL with key

3. Obtain API Keys:
- TradingView: Visit [TradingView](https://www.tradingview.com/brokerage-integration/)
- Glassnode: Register at [Glassnode](https://glassnode.com)
- Coinglass: Sign up at [Coinglass](https://coinglass.com)
- BlockchainCenter: Contact [BlockchainCenter](https://www.blockchaincenter.net)
- Prediction Service: Register through their platform

Frontend Configuration:
- Create `.env` file in the frontend directory
- Configure the backend API endpoint

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
