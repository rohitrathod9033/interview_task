import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { PaymentEntry } from '../models/Payment';

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create order', details: error });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update order' });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Cascade delete associated payments
        await PaymentEntry.deleteMany({ orderId });

        res.json({ message: 'Order and associated payments deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
