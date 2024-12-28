import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { Notifier } from '../utils/notifier';
import logger from '../utils/logger';
import { AnomalyDetectionService } from '../services/AnomalyDetectionService';
import { IIndicator } from '../types/indicator';

// Mock the logger
jest.mock('../utils/logger', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

describe('Notifier', () => {
  let notifier: Notifier;

  beforeEach(() => {
    // Mock environment variables
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'password';
    process.env.ALERT_EMAIL = 'alerts@example.com';
    process.env.DINGDING_WEBHOOK = 'https://dingding.example.com/webhook';
    process.env.WECOM_WEBHOOK = 'https://wecom.example.com/webhook';

    notifier = Notifier.getInstance();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Email Notifications', () => {
    it('should send email successfully', async () => {
      const title = 'Test Alert';
      const message = 'This is a test message';
      
      await notifier.sendEmail(title, message);
      
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Email sent successfully')
      );
    });

    it('should handle email sending failure', async () => {
      const mockSendMail = require('nodemailer').createTransport().sendMail;
      mockSendMail.mockRejectedValueOnce(new Error('SMTP error'));

      const title = 'Test Alert';
      const message = 'This is a test message';
      
      await expect(notifier.sendEmail(title, message))
        .rejects.toThrow('Failed to send email');
      
      expect(logger.error).toHaveBeenCalled();
    });

    it('should retry failed email attempts', async () => {
      const mockSendMail = require('nodemailer').createTransport().sendMail;
      mockSendMail
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockResolvedValueOnce({ messageId: 'test-id' });

      const title = 'Test Alert';
      const message = 'This is a test message';
      
      
      await notifier.sendEmail(title, message);
      
      expect(mockSendMail).toHaveBeenCalledTimes(2);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Email sent successfully')
      );
    });
  });

  describe('DingDing Notifications', () => {
    it('should send DingDing message successfully', async () => {
      const message = 'This is a test message';
      
      await notifier.sendDingDing(message);
      
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('DingDing message sent successfully')
      );
    });

    it('should handle DingDing sending failure', async () => {
      const mockPost = require('axios').post;
      mockPost.mockRejectedValueOnce(new Error('Network error'));

      const message = 'This is a test message';
      
      await expect(notifier.sendDingDing(message))
        .rejects.toThrow('Failed to send DingDing message');
      
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('WeCom Notifications', () => {
    it('should send WeCom message successfully', async () => {
      const message = 'This is a test message';
      
      await notifier.sendWecom(message);
      
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('WeCom message sent successfully')
      );
    });

    it('should handle WeCom sending failure', async () => {
      const mockPost = require('axios').post;
      mockPost.mockRejectedValueOnce(new Error('Network error'));

      const message = 'This is a test message';
      
      await expect(notifier.sendWecom(message))
        .rejects.toThrow('Failed to send WeCom message');
      
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('Multilingual Support', () => {
    it('should handle multilingual messages correctly', async () => {
      const title = '测试警报 Test Alert';
      const message = '这是一个测试消息。This is a test message.';
      
      await notifier.notifyAll(title, message);
      
      // Verify email content
      const mockSendMail = require('nodemailer').createTransport().sendMail;
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('测试警报'),
          text: expect.stringContaining('这是一个测试消息')
        })
      );

      // Verify DingDing content
      const mockPost = require('axios').post;
      expect(mockPost).toHaveBeenCalledWith(
        process.env.DINGDING_WEBHOOK,
        expect.objectContaining({
          text: expect.objectContaining({
            content: expect.stringContaining('这是一个测试消息')
          })
        })
      );
    });
  });

  describe('Integration with Anomaly Detection', () => {
    it('should notify when indicator threshold is breached', async () => {
      const anomalyService = new AnomalyDetectionService(notifier);
      const indicator: IIndicator = {
        id: 1,
        nameEn: 'Net Unrealized Profit/Loss',
        nameZh: 'NUPL指标',
        currentValue: 0.8,
        targetValue: 0.75,
        category: 'On-chain',
        updatedAt: new Date()
      };

      await anomalyService.detectAnomalies(indicator);

      // Verify notifications were sent
      const mockSendMail = require('nodemailer').createTransport().sendMail;
      expect(mockSendMail).toHaveBeenCalled();
      expect(require('axios').post).toHaveBeenCalledTimes(2); // DingDing and WeCom
    });
  });

  describe('Error Handling', () => {
    it('should continue with other channels if one fails', async () => {
      const mockSendMail = require('nodemailer').createTransport().sendMail;
      mockSendMail.mockRejectedValueOnce(new Error('SMTP error'));

      const title = 'Test Alert';
      const message = 'This is a test message';
      
      await notifier.notifyAll(title, message);
      
      // Verify DingDing and WeCom were still called
      expect(require('axios').post).toHaveBeenCalledTimes(2);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to send email'),
        expect.any(Error)
      );
    });

    it('should handle missing environment variables gracefully', async () => {
      delete process.env.SMTP_HOST;
      delete process.env.DINGDING_WEBHOOK;
      delete process.env.WECOM_WEBHOOK;

      const title = 'Test Alert';
      const message = 'This is a test message';

      await notifier.notifyAll(title, message);
      expect(logger.warn).toHaveBeenCalledTimes(3);
    });
  });
});
