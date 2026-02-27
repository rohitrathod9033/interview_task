"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const payment_validator_1 = require("../validators/payment.validator");
const router = (0, express_1.Router)();
router.get('/', payment_controller_1.getPayments);
router.post('/', payment_validator_1.createPaymentValidation, payment_controller_1.recordPayment);
// Note: /api/orders/:id/payments route technically maps closer to orders but handles payment data.
// We will expose a specific route for fetching payments by order ID via the payment router
// Example URL: /api/payments/order/:id
router.get('/order/:id', payment_validator_1.paymentOrderParamsValidation, payment_controller_1.getPaymentsForOrder);
exports.default = router;
