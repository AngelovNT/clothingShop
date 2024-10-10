// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { getProducts, addProducts } = require('../controllers/productController');

// GET all products
router.get('/', getProducts);

// POST to add products
router.post('/add-products', addProducts);

module.exports = router;
