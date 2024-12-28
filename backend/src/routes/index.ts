import express from 'express';
import { IndicatorController } from '../controllers/IndicatorController';

const router = express.Router();
const indicatorController = new IndicatorController();

router.get('/indicators', indicatorController.getAllIndicators);
router.get('/indicators/:id/history', indicatorController.getIndicatorHistory);
router.get('/indicators/triggered', indicatorController.getTriggeredIndicators);

export default router;
