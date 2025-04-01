// controllers/productController.js
const Product = require('../models/product');

// Add products from JSON
const addProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      console.error('Invalid data format: products is not an array');
      return res.status(400).json({ error: 'Invalid data format' });
    }

    console.log('Received products data:', products); // Log the products data for debugging

    // Insert products into the database
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
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search,
      sort = 'name',
      order = 'asc'
    } = req.query;

    // Build query
    const query = {};
    
    // Add category filter if provided
    if (category) {
      query.category = category;
    }
    
    // Add search filter if provided
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Count total products matching the query
    const total = await Product.countDocuments(query);
    
    // Get products with pagination and sorting
    const products = await Product.find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
      stock
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.updatedAt = Date.now();
    
    const updatedProduct = await product.save();
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await product.deleteOne();
    
    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Get product categories
const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = { 
  addProducts, 
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories
};
