import express from 'express';
import { 
  getAllUsers, 
  deactivateUser, 
  deleteUser,
  adminLogout,
  getAdminProfile,
  // getAllOrders, 
  // updateOrderStatus, 
  // getDashboardStats, 
  // manageSiteSettings 
  adminSignUp,adminLogin,checkAdmin
} from '../controllers/adminController.js';
import { authAdmin } from '../middleware/authAdmin.js'; // Authentication middleware

const router = express.Router();
// Admin registration
router.post('/register', adminSignUp);

// Admin login
router.post('/login', adminLogin);

// Admin logout
router.post('/logout', authAdmin, adminLogout);


router.get('/profile', authAdmin, getAdminProfile);
router.get("/check-admin",authAdmin,checkAdmin)
// // User Management Routes
// router.get('/users', authAdmin, getAllUsers);
// router.put('/users/:id/deactivate', authAdmin, deactivateUser);
// router.delete('/users/:id', authAdmin, deleteUser);

// // Order Management Routes
// router.get('/orders', authAdmin, getAllOrders);
// router.put('/orders/:id/status', authAdmin, updateOrderStatus);

// // Dashboard & Settings Routes
// router.get('/dashboard', authAdmin, getDashboardStats);
// router.put('/settings', authAdmin, manageSiteSettings);

export default router;
