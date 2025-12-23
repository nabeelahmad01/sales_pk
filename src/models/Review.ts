import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  userName: string;
  brandId: string;
  brandName: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    brandId: { type: String, required: true },
    brandName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    helpful: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
