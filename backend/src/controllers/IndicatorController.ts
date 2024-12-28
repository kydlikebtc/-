import { Request, Response } from 'express';
import { Indicator } from '../models/Indicator';
import { IndicatorHistory } from '../models/IndicatorHistory';

export class IndicatorController {
  async getAllIndicators(req: Request, res: Response) {
    try {
      const indicators = await Indicator.find().sort('id');
      res.json(indicators);
    } catch {
      res.status(500).json({ message: 'Error fetching indicators' });
    }
  }

  async getIndicatorHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { days = 30 } = req.query;

      const history = await IndicatorHistory.find({
        indicatorId: parseInt(id),
        timestamp: {
          $gte: new Date(Date.now() - parseInt(days.toString()) * 24 * 60 * 60 * 1000)
        }
      }).sort('-timestamp');

      res.json(history);
    } catch {
      res.status(500).json({ message: 'Error fetching indicator history' });
    }
  }

  async getTriggeredIndicators(req: Request, res: Response) {
    try {
      const indicators = await Indicator.find({ isTriggered: true });
      res.json(indicators);
    } catch {
      res.status(500).json({ message: 'Error fetching triggered indicators' });
    }
  }
}
