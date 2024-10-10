// controllers/productController.js
const Product = require('../models/product');

// Add products from JSON
// Assuming this is part of your productsController.js
const addProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      console.error('Invalid data format: products is not an array');
      return res.status(400).json({ error: 'Invalid data format' });
    }

    console.log('Received products data:', products); // Log the products data for debugging

    // Insert products into the database (replace this with your actual implementation)
    const insertedProducts = await Product.insertMany(products);

    console.log('Products successfully inserted:', insertedProducts);
    res.status(201).json(insertedProducts);
  } catch (error) {
    console.error('Error adding products:', error); // Log detailed error message
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

module.exports = { addProducts, getProducts };
