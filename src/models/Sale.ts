import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISale extends Document {
  title: string;
  description: string;
  brandId: string;
  brandName: string;
  category: string;
  discountPercentage: number;
  originalPrice?: number;
  salePrice?: number;
  image: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isFeatured: boolean;
  link: string;
  affiliateUrl?: string;
  affiliateClicks: number;
  views: number;
  savesCount: number;
  priceHistory: { price: number; date: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema = new Schema<ISale>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    brandId: { type: String, required: true },
    brandName: { type: String, required: true },
    category: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    originalPrice: { type: Number },
    salePrice: { type: Number },
    image: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    link: { type: String, required: true },
    affiliateUrl: { type: String },
    affiliateClicks: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    savesCount: { type: Number, default: 0 },
    priceHistory: [{ price: Number, date: Date }],
  },
  {
    timestamps: true,
  }
);

// Check if model already exists (for hot reload in development)
const Sale: Model<ISale> = mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);

export default Sale;
