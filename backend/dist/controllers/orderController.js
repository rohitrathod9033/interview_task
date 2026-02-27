"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrders = void 0;
const Order_1 = require("../models/Order");
const Payment_1 = require("../models/Payment");
const getOrders = async (req, res) => {
    try {
        const orders = await Order_1.Order.find().sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
exports.getOrders = getOrders;
const createOrder = async (req, res) => {
    try {
        const order = new Order_1.Order(req.body);
        await order.save();
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create order', details: error });
    }
};
exports.createOrder = createOrder;
const updateOrder = async (req, res) => {
    try {
        const order = await Order_1.Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update order' });
    }
};
exports.updateOrder = updateOrder;
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order_1.Order.findByIdAndDelete(orderId);
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        // Cascade delete associated payments
        await Payment_1.PaymentEntry.deleteMany({ orderId });
        res.json({ message: 'Order and associated payments deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
exports.deleteOrder = deleteOrder;
