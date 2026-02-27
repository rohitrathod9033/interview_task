import { Request, Response } from 'express';
import { PaymentEntry } from '../models/Payment';

export const getPayments = async (req: Request, res: Response) => {
    try {
        const payments = await PaymentEntry.find().sort({ date: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};

export const getPaymentsForOrder = async (req: Request, res: Response) => {
    try {
        const payments = await PaymentEntry.find({ orderId: req.params.id }).sort({ date: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments for order' });
    }
};

export const recordPayment = async (req: Request, res: Response) => {
    try {
        const payment = new PaymentEntry(req.body);
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: 'Failed to record payment' });
    }
};
