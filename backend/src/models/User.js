const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Cart = require('./Cart');

// User schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = process.env.SALT_VALUE || 10;
    const salt = await bcrypt.genSalt(Number(saltRounds));
    
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Post-save hook: Automatically create a cart when a new user is added
UserSchema.post('save', function (doc, next) {
  console.log('User saved:', doc._id);

  const cart = new Cart({
    user: doc._id,
    products: []
  });

  cart.save()
    .then(() => {
      console.log('Cart created for user:', doc._id);
      next();
    })
    .catch((err) => {
      console.error('Error creating cart for user:', doc._id, err);
      next(err);
    });
});



// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
