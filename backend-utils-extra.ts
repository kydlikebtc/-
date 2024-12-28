// package.json
{
  "name": "crypto-market-indicators",
  "version": "1.0.0",
  "description": "Cryptocurrency market indicators monitoring system",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "ioredis": "^5.3.2",
    "mongoose": "^8.0.3",
    "node-cache": "^5.1.2",
    "node-schedule": "^2.1.1",
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.4",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2",
    "eslint": "^8.55.0",
    "jest": "^29.7.0",
    "nodemon": "^3.0.2",
    "ts-jest": "^29.1.1",
    "typescript": "^5.3.3"
  }
}

// src/utils/notifier.ts
import axios from 'axios';
import nodemailer from 'nodemailer';
import logger from './logger';

export class Notifier {
  private static instance: Notifier;
  private emailTransporter: any;
  private webhookUrls: Map<string, string>;

  private constructor() {
    this.initializeEmail();
    this.initializeWebhooks();
  }

  static getInstance(): Notifier {
    if (!Notifier.instance) {
      Notifier.instance = new Notifier();
    }
    return Notifier.instance;
  }

  private initializeEmail() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  private initializeWebhooks() {
    this.webhookUrls = new Map([
      ['dingding', process.env.DINGDING_WEBHOOK],
      ['wecom', process.env.WECOM_WEBHOOK]
    ]);
  }

  async sendEmail(to: string, subject: string, content: string) {
    try {
      await this.emailTransporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html: content
      });
      logger.info('Email notification sent successfully');
    } catch (error) {
      logger.error('Failed to send email notification:', error);
    }
  }

  async sendDingDing(message: string) {
    try {
      const webhookUrl = this.webhookUrls.get('dingding');
      if (!webhookUrl) {
        throw new Error('DingDing webhook URL not configured');
      }

      await axios.post(webhookUrl, {
        msgtype: 'text',
        text: {
          content: message
        }
      });
      logger.info('DingDing notification sent successfully');
    } catch (error) {
      logger.error('Failed to send DingDing notification:', error);
    }
  }

  async sendWecom(message: string) {
    try {
      const webhookUrl = this.webhookUrls.get('wecom');
      if (!webhookUrl) {
        throw new Error('WeCom webhook URL not configured');
      }

      await axios.post(webhookUrl, {
        msgtype: 'text',
        text: {
          content: message
        }
      });
      logger.info('WeCom notification sent successfully');
    } catch (error) {
      logger.error('Failed to send WeCom notification:', error);
    }
  }
}

// src/utils/security.ts
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

export class Security {
  // 数据加密
  static encrypt(text: string, secretKey: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + encrypted + ':' + authTag.toString('hex');
  }

  // 数据解密
  static decrypt(encryptedText: string, secretKey: string): string {
    const [ivHex, encrypted, authTagHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secretKey), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // 生成JWT token
  static generateToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '24h'
    });
  }

  // 验证JWT token
  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  }

  // 请求限流中间件
  static rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 限制每个IP 100次请求
  });

  // API认证中间件
  static authenticate = (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }

      const decoded = Security.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Authentication failed' });
    }
  };
}

// src/tests/indicators.test.ts
import { Validator } from '../utils/validator';
import { DataUtils } from '../utils/helpers';
import { Security } from '../utils/security';

describe('Indicator Validation', () => {
  test('should validate correct indicator data', () => {
    const validData = {
      id: 1,
      category: 'Technical',
      nameZh: '测试指标',
      nameEn: 'Test Indicator',
      currentValue: 100,
      targetValue: '200',
      principle: 'Test principle',
      calculation: 'Test calculation',
      usage: 'Test usage',
      dataSource: 'https://example.com'
    };

    expect(() => Validator.validateIndicator(validData)).not.toThrow();
  });

  test('should reject invalid indicator data', () => {
    const invalidData = {
      id: -1, // Invalid ID
      category: '',
      nameZh: '',
      nameEn: '',
      currentValue: 'invalid',
      targetValue: '',
      principle: '',
      calculation: '',
      usage: '',
      dataSource: 'invalid-url'
    };

    expect(() => Validator.validateIndicator(invalidData)).toThrow();
  });
});

describe('Data Utils', () => {
  test('should calculate percentage change correctly', () => {
    expect(DataUtils.calculatePercentageChange(110, 100)).toBe(10);
    expect(DataUtils.calculatePercentageChange(90, 100)).toBe(-10);
  });

  test('should calculate moving average correctly', () => {
    const data = [1, 2, 3, 4, 5];
    const ma3 = DataUtils.calculateMA(data, 3);
    expect(ma3).toEqual([2, 3, 4]);
  });
});

describe('Security', () => {
  const secretKey = 'test-secret-key-32-chars-long-123';

  test('should encrypt and decrypt data correctly', () => {
    const originalText = 'test data';
    const encrypted = Security.encrypt(originalText, secretKey);
    const decrypted = Security.decrypt(encrypted, secretKey);
    expect(decrypted).toBe(originalText);
  });

  test('should generate and verify JWT token', () => {
    const payload = { userId: 1 };
    const token = Security.generateToken(payload);
    const decoded = Security.verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
  });
});

// Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]

// ecosystem.config.js (PM2配置)
module.exports = {
  apps: [{
    name: 'crypto-indicators',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development'
    }
  }]
};

// .env.example
PORT=3001
MONGODB_URI=mongodb://localhost:27017/crypto-indicators
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
DINGDING_WEBHOOK=https://oapi.dingtalk.com/robot/send?access_token=xxx
WECOM_WEBHOOK=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx
GLASSNODE_API_KEY=your-glassnode-api-key
COINGLASS_API_KEY=your-coinglass-api-key

// .gitignore
node_modules/
dist/
.env
logs/
*.log
coverage/
.DS_Store
