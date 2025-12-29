import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  category: string;
  isActive: boolean;
  isVerified: boolean;
  // Authentication
  email?: string;
  password?: string;
  // Contact Info
  contactPhone?: string;
  contactPerson?: string;
  // Approval Status
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  rejectedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    // Authentication
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    // Contact Info
    contactPhone: { type: String },
    contactPerson: { type: String },
    // Approval Status
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
  },
  {
    timestamps: true,
  }
);

const Brand: Model<IBrand> = mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);

export default Brand;
