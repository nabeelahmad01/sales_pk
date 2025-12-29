import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  brandId?: mongoose.Types.ObjectId;
  saleId?: mongoose.Types.ObjectId;
  usageLimit?: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number },
    maxDiscount: { type: Number },
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand' },
    saleId: { type: Schema.Types.ObjectId, ref: 'Sale' },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Index for efficient code lookup
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, endDate: 1 });

const Coupon: Model<ICoupon> = 
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
