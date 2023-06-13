import express from 'express';
import { logOut, postInfoUserLogin, generateNewAccessToken, getAllOrders } from '../app/controllers/UserController.js';
import { verifyToken } from '../app/middlewares/index.js';
const router = express.Router();
router.post('/refresh-access-token', generateNewAccessToken);
router.post('/post-login', postInfoUserLogin);
router.post('/logout', verifyToken, logOut);
router.get('/admin/orders', verifyToken, getAllOrders);
export default router;
