import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentEntry extends Document {
    orderId: mongoose.Types.ObjectId;
    amount: number;
    date: Date;
}

const PaymentEntrySchema: Schema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

export const PaymentEntry = mongoose.model<IPaymentEntry>('PaymentEntry', PaymentEntrySchema);
