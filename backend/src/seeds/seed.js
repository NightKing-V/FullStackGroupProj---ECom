require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/dbConn');
const User = require('../models/User'); // Import your models
const Product = require('../models/Product'); // Example of another model

const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany(); // Clear the User collection
    await Product.deleteMany(); // Clear the Product collection

    console.log('Seeding data...');
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')));
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json')));

    await User.insertMany(users);
    await Product.insertMany(products);

    console.log('Seeding complete!');
    process.exit(); // Exit process after completion
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedData();
