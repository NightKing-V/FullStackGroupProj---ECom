const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await cart.save();

    return res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.products = cart.products.filter(p => p.product.toString() !== productId);

    await cart.save();

    return res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Update product quantity in cart
exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cart.products[productIndex].quantity = quantity;

    await cart.save();

    return res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// List all items in the user's cart
exports.listCartItems = async (req, res) => {
    try {
      const userId = req.user.userId;

      const cart = await Cart.findOne({ user: userId }).populate('products.product');
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      return res.status(200).json({
        products: cart.products.map(item => {
 
          const product = item.product;
          const quantity = parseFloat(item.quantity);
          const price = parseFloat(product.Price);
          const totalPrice = (quantity * price).toFixed(2);
      
          return {
            productId: product._id,      
            productName: product.Name,       
            productPrice: price,      
            quantity: quantity,   
            totalPrice: parseFloat(totalPrice), 
            productColor: item.productColor,
            productSize: item.productSize,  
            addedAt: item.addedAt
          };
        })
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  