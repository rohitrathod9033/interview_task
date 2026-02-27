import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    clientName: string;
    eventDate: Date;
    eventType: string;
    venue: string;
    totalAmount: number;
    notes?: string;
    createdAt: Date;
}

const OrderSchema: Schema = new Schema({
    clientName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventType: { type: String, required: true },
    venue: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
