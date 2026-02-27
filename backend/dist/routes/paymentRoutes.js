"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const paymentValidator_1 = require("../validators/paymentValidator");
const router = (0, express_1.Router)();
router.get('/', paymentController_1.getPayments);
router.post('/', paymentValidator_1.createPaymentValidation, paymentController_1.recordPayment);
// Note: /api/orders/:id/payments route technically maps closer to orders but handles payment data.
// We will expose a specific route for fetching payments by order ID via the payment router
// Example URL: /api/payments/order/:id
router.get('/order/:id', paymentValidator_1.paymentOrderParamsValidation, paymentController_1.getPaymentsForOrder);
exports.default = router;
