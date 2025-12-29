import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPriceAlert extends Document {
  userId: mongoose.Types.ObjectId;
  saleId: mongoose.Types.ObjectId;
  email: string;
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PriceAlertSchema = new Schema<IPriceAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    saleId: { type: Schema.Types.ObjectId, ref: 'Sale', required: true },
    email: { type: String, required: true },
    targetPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    isTriggered: { type: Boolean, default: false },
    triggeredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
PriceAlertSchema.index({ userId: 1, saleId: 1 });
PriceAlertSchema.index({ isActive: 1, isTriggered: 1 });

const PriceAlert: Model<IPriceAlert> = 
  mongoose.models.PriceAlert || mongoose.model<IPriceAlert>('PriceAlert', PriceAlertSchema);

export default PriceAlert;
