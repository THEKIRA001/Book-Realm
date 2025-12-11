import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getUserOrders, createOrder } from '../controllers/orders.controller';

const router = Router();

router.get('/', authenticateToken, getUserOrders);
router.post('/', authenticateToken, createOrder);

export default router;
