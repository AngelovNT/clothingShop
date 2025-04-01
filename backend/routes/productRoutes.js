// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProducts,
  getProductCategories
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/categories', getProductCategories);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
router.post('/add-products', protect, admin, addProducts);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
