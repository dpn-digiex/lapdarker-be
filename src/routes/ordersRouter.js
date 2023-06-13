import express from 'express';
import { addOrders, updateOrders, getOrders, getDetailOrder, deleteOrders } from '../app/controllers/OrdersController.js';
import { verifyToken } from '../app/middlewares/index.js';

const router = express.Router();

router.post('/post', addOrders);

router.get('/get-all', verifyToken, getOrders);
// router.get('/get', verifyToken, getOrdersFollowType);
router.patch('/update', verifyToken, updateOrders);

router.get('/:id',verifyToken, getDetailOrder);

router.post('/delete',verifyToken, deleteOrders);

export default router;
