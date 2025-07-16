// routes/orders.routes.js
import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  getAllOrders,
  updateOrder,
  deleteOrder
} from '../controllers/order.controller.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Route pour créer une commande - accessible à tous
router.post('/', createOrder);

// Routes protégées - nécessitent une authentification
router.get('/me', protect, getUserOrders);
router.get('/:id', protect, getOrderById);

// Routes admin - nécessitent une authentification et privilèges admin
router.get('/', protect, requireAdmin, getAllOrders);
router.put('/:id', protect, requireAdmin, updateOrder);
router.delete('/:id', protect, requireAdmin, deleteOrder);

export default router;
