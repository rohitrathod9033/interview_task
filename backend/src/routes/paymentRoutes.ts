import { Router } from 'express';
import { getPayments, getPaymentsForOrder, recordPayment } from '../controllers/paymentController';
import { createPaymentValidation, paymentOrderParamsValidation } from '../validators/paymentValidator';

const router = Router();

router.get('/', getPayments);
router.post('/', createPaymentValidation, recordPayment);

// Note: /api/orders/:id/payments route technically maps closer to orders but handles payment data.
// We will expose a specific route for fetching payments by order ID via the payment router
// Example URL: /api/payments/order/:id
router.get('/order/:id', paymentOrderParamsValidation, getPaymentsForOrder);

export default router;
