import mongoose, { Schema, Document } from 'mongoose';

export interface IIndicatorHistory extends Document {
  indicatorId: number;
  value: number | string;
  timestamp: Date;
}

const IndicatorHistorySchema = new Schema({
  indicatorId: { type: Number, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'indicatorId',
    granularity: 'hours'
  }
});

// Create index to improve query performance
IndicatorHistorySchema.index({ indicatorId: 1, timestamp: -1 });

export const IndicatorHistory = mongoose.model<IIndicatorHistory>('IndicatorHistory', IndicatorHistorySchema);
