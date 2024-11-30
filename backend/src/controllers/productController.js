const Product = require('../models/Product');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { ID, Name, Category, Brand, Price, Description, Benefits, ProductDetails, Images } = req.body;
    const product = new Product({
      ID,
      Name,
      Category,
      Brand,
      Price,
      Description,
      Benefits,
      ProductDetails,
      Images
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ ID: req.params.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { ID } = req.params;
    const updates = req.body;

    const product = await Product.findOneAndUpdate({ ID }, updates, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { ID } = req.params;

    const product = await Product.findOneAndDelete({ ID });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
