"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordPayment = exports.getPaymentsForOrder = exports.getPayments = void 0;
const Payment_1 = require("../models/Payment");
const getPayments = async (req, res) => {
    try {
        const payments = await Payment_1.PaymentEntry.find().sort({ date: -1 });
        res.json(payments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};
exports.getPayments = getPayments;
const getPaymentsForOrder = async (req, res) => {
    try {
        const payments = await Payment_1.PaymentEntry.find({ orderId: req.params.id }).sort({ date: -1 });
        res.json(payments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments for order' });
    }
};
exports.getPaymentsForOrder = getPaymentsForOrder;
const recordPayment = async (req, res) => {
    try {
        const payment = new Payment_1.PaymentEntry(req.body);
        await payment.save();
        res.status(201).json(payment);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to record payment' });
    }
};
exports.recordPayment = recordPayment;
