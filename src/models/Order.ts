import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  // Product/Sale Info
  saleId: string;
  brandId: string;
  brandName: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  // Payment
  paymentMethod: 'card' | 'jazzcash' | 'easypaisa' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  transactionId?: string;
  // Order Status
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  // Notes
  customerNotes?: string;
  adminNotes?: string;
  // Timestamps
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    // Customer Info
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerCity: { type: String, required: true },
    // Product/Sale Info
    saleId: { type: String, required: true },
    brandId: { type: String, required: true },
    brandName: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    // Payment
    paymentMethod: { type: String, enum: ['card', 'jazzcash', 'easypaisa', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paymentId: { type: String },
    transactionId: { type: String },
    // Order Status
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
      default: 'pending' 
    },
    // Notes
    customerNotes: { type: String },
    adminNotes: { type: String },
    // Timestamps
    confirmedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Generate unique order ID before saving (using pre-save without next callback)
OrderSchema.pre('save', function() {
  if (!this.orderId) {
    const date = new Date();
    const prefix = 'SS';
    const timestamp = date.getFullYear().toString().slice(-2) + 
                     (date.getMonth() + 1).toString().padStart(2, '0') + 
                     date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderId = `${prefix}${timestamp}${random}`;
  }
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
