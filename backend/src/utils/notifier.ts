import axios from 'axios';
import nodemailer from 'nodemailer';
import logger from './logger';

export class Notifier {
  private static instance: Notifier;
  private emailTransporter: nodemailer.Transporter;
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

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
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

  async sendDingDing(message: string): Promise<void> {
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

  async sendWecom(message: string): Promise<void> {
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
