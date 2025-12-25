import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  views: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, default: 'ShowSales Team' },
    category: { type: String, default: 'Shopping Tips' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;

