const mongoose = require('mongoose');

// Cart schema
const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
    unique: true,  // Ensures each user has only one cart
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',  // Reference to the Product model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,  // Minimum quantity should be 1
    },
    addedAt: {
      type: Date,
      default: Date.now,
    }
  }],
}, {
  timestamps: true,
});

// Pre-save hook: If the cart doesn't exist for a user, create an empty cart
CartSchema.pre('save', async function(next) {
  if (!this.isModified('user')) return next();
  
  const user = this.user;
  const cartExists = await mongoose.model('Cart').findOne({ user });
  
  if (!cartExists) {
    this.products = [];  // Initialize with an empty array
  }

  next();
});

module.exports = mongoose.model('Cart', CartSchema);
