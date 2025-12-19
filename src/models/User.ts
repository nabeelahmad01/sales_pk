import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  favorites: string[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  priceAlerts: boolean;
  saleExpiryAlerts: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    favorites: [{ type: String }],
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    priceAlerts: { type: Boolean, default: true },
    saleExpiryAlerts: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

