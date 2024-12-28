import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export class Security {
  static encrypt(text: string, secretKey: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + encrypted + ':' + authTag.toString('hex');
  }

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

  static generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '24h'
    });
  }

  static verifyToken(token: string): Record<string, unknown> {
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as Record<string, unknown>;
  }

  static rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

  static authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }

      const decoded = Security.verifyToken(token);
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ message: 'Authentication failed' });
    }
  };
}
