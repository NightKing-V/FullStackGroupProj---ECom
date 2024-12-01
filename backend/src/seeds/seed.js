require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const connectDB = require('../config/dbConn');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart')

const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();

    console.log('Seeding data...');
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')));
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json')));

    // Hash passwords for all users before inserting them into the database
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const saltRounds = process.env.SALT_VALUE || 10;
        const salt = await bcrypt.genSalt(Number(saltRounds));
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    const insertedUsers = await User.insertMany(hashedUsers);
    await Product.insertMany(products);

    // create carts for each user inserted
    for (const user of insertedUsers) {
      const cart = new Cart({
        user: user._id,
        products: []
      });

      await cart.save();
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedData();
