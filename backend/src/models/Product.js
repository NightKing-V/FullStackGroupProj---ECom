const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Brand: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Benefits: {
    type: [String],
    required: true,
  },
  ProductDetails: {
    Weight: {
      type: String,
      required: false,
    },
    'Heel-to-toe drop': {
      type: String,
      required: false,
    },
    'Intended Use': {
      type: String,
      required: false,
    },
    ReflectiveDetails: {
      type: String,
      required: false,
    },
    Fit: {
      type: String,
      required: false,
    },
    Closure: {
      type: String,
      required: false,
    },
    UpperMaterial: {
      type: String,
      required: false,
    },
    Lining: {
      type: String,
      required: false,
    },
    Outsole: {
      type: String,
      required: false,
    },
    MidsoleDrop: {
      type: String,
      required: false,
    },
    Color: {
      type: String,
      required: true,
    },
    RecycledContent: {
      type: String,
      required: false,
    },
  },
  Images: {
    type: [String],
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', ProductSchema);
