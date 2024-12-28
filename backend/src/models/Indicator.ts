import mongoose, { Schema, Document } from 'mongoose';

export interface IIndicator extends Document {
  id: number;
  category: string;
  nameZh: string;
  nameEn: string;
  currentValue: number | string;
  targetValue: string;
  principle: string;
  calculation: string;
  usage: string;
  dataSource: string;
  isTriggered: boolean;
  updatedAt: Date;
}

const IndicatorSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  category: { type: String, required: true },
  nameZh: { type: String, required: true },
  nameEn: { type: String, required: true },
  currentValue: { type: Schema.Types.Mixed, required: true },
  targetValue: { type: String, required: true },
  principle: { type: String, required: true },
  calculation: { type: String, required: true },
  usage: { type: String, required: true },
  dataSource: { type: String, required: true },
  isTriggered: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

export const Indicator = mongoose.model<IIndicator>('Indicator', IndicatorSchema);
