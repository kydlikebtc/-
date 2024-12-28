import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-indicators'
  },
  apis: {
    glassnode: {
      baseUrl: 'https://api.glassnode.com',
      apiKey: process.env.GLASSNODE_API_KEY
    },
    coinglass: {
      baseUrl: 'https://open-api.coinglass.com',
      apiKey: process.env.COINGLASS_API_KEY
    },
    tradingview: {
      baseUrl: 'https://api.tradingview.com',
      apiKey: process.env.TRADINGVIEW_API_KEY
    },
    blockchaincenter: {
      baseUrl: 'https://api.blockchaincenter.net',
      apiKey: process.env.BLOCKCHAINCENTER_API_KEY
    },
    microstrategy: {
      baseUrl: 'https://api.microstrategy.com'
    },
    prediction: {
      baseUrl: 'https://api.prediction-service.com',
      apiKey: process.env.PREDICTION_API_KEY
    },
    binance: {
      baseUrl: 'https://api.binance.com',
      apiKey: process.env.BINANCE_API_KEY,
      apiSecret: process.env.BINANCE_API_SECRET
    }
  },
  update: {
    interval: '*/5 * * * *' // 每5分钟更新一次
  }
};
