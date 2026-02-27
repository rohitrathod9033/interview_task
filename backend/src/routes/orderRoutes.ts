import { Router } from 'express';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../controllers/orderController';
import { createOrderValidation, updateOrderValidation, orderIdValidation } from '../validators/orderValidator';

const router = Router();

router.get('/', getOrders);
router.post('/', createOrderValidation, createOrder);
router.put('/:id', updateOrderValidation, updateOrder);
router.delete('/:id', orderIdValidation, deleteOrder);

export default router;
