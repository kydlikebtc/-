import axios, { AxiosError } from 'axios';
import nodemailer from 'nodemailer';
import logger from './logger';
import { join } from 'path';
import { mkdirSync } from 'fs';

interface NotificationResult {
  channel: 'email' | 'dingding' | 'wecom';
  success: boolean;
  error?: string;
}

export class Notifier {
  private static instance: Notifier;
  private emailTransporter: nodemailer.Transporter;
  private webhookUrls: Map<string, string>;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  private constructor() {
    this.validateEnvVars();
    this.initializeEmail();
    this.initializeWebhooks();
  }

  private validateEnvVars() {
    const requiredVars = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS',
      'ALERT_EMAIL'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      logger.warn('Missing required environment variables:', { missingVars });
    }
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
      ['dingding', process.env.DINGDING_WEBHOOK || ''],
      ['wecom', process.env.WECOM_WEBHOOK || '']
    ]);
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    channel: string,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        logger.warn(`Retrying ${channel} notification, attempts remaining: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.withRetry(operation, channel, retries - 1);
      }
      throw error;
    }
  }

  async sendEmail(subject: string, content: string): Promise<NotificationResult> {
    const to = process.env.ALERT_EMAIL;
    try {
      await this.withRetry(async () => {
        await this.emailTransporter.sendMail({
          from: process.env.SMTP_USER,
          to,
          subject,
          html: content
        });
      }, 'email');

      logger.info('Email notification sent successfully');
      return { channel: 'email', success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to send email notification:', { error: errorMessage });
      return { channel: 'email', success: false, error: errorMessage };
    }
  }

  async sendDingDing(message: string): Promise<NotificationResult> {
    try {
      const webhookUrl = this.webhookUrls.get('dingding');
      if (!webhookUrl) {
        throw new Error('DingDing webhook URL not configured');
      }

      await this.withRetry(async () => {
        await axios.post(webhookUrl, {
          msgtype: 'markdown',
          markdown: {
            title: '市场指标预警',
            text: message
          }
        });
      }, 'dingding');

      logger.info('DingDing notification sent successfully');
      return { channel: 'dingding', success: true };
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? `${error.message} (${error.response?.status})` 
        : error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to send DingDing notification:', { error: errorMessage });
      return { channel: 'dingding', success: false, error: errorMessage };
    }
  }

  async sendWecom(message: string): Promise<NotificationResult> {
    try {
      const webhookUrl = this.webhookUrls.get('wecom');
      if (!webhookUrl) {
        throw new Error('WeCom webhook URL not configured');
      }

      await this.withRetry(async () => {
        await axios.post(webhookUrl, {
          msgtype: 'markdown',
          markdown: {
            content: message
          }
        });
      }, 'wecom');

      logger.info('WeCom notification sent successfully');
      return { channel: 'wecom', success: true };
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? `${error.message} (${error.response?.status})` 
        : error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to send WeCom notification:', { error: errorMessage });
      return { channel: 'wecom', success: false, error: errorMessage };
    }
  }

  private formatMessage(title: string, message: string, type: 'email' | 'dingding' | 'wecom'): string {
    switch (type) {
      case 'email':
        return `
          <h2 style="color: #d9534f;">${title}</h2>
          <div style="font-family: monospace; white-space: pre-wrap; background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
            ${message}
          </div>
        `;
      case 'dingding':
        return `### ${title} ###\n\n${message}`;
      case 'wecom':
        return `**${title}**\n\n${message}`;
    }
  }

  async notifyAll(title: string, message: string): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];
    const alertEmail = process.env.ALERT_EMAIL;

    try {
      // Prepare notification promises
      const notificationPromises: Promise<NotificationResult>[] = [];

      // Add email notification if configured
      if (alertEmail) {
        notificationPromises.push(
          this.sendEmail(alertEmail, title, this.formatMessage(title, message, 'email'))
        );
      }

      // Add DingDing notification if configured
      if (this.webhookUrls.has('dingding')) {
        notificationPromises.push(
          this.sendDingDing(this.formatMessage(title, message, 'dingding'))
        );
      }


      // Add WeCom notification if configured
      if (this.webhookUrls.has('wecom')) {
        notificationPromises.push(
          this.sendWecom(this.formatMessage(title, message, 'wecom'))
        );
      }

      if (notificationPromises.length === 0) {
        logger.warn('No notification channels configured');
        return results;
      }

      // Send all notifications in parallel
      results.push(...await Promise.all(notificationPromises));

      // Log results
      const successCount = results.filter(r => r.success).length;
      logger.info(`Alert notifications sent: ${successCount}/${results.length} successful`);

      // Log failures in detail
      results.filter(r => !r.success).forEach(result => {
        logger.error(`${result.channel} notification failed:`, { error: result.error });
      });

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to send alert notifications:', { error: errorMessage });
      return results;
    }
  }
}
