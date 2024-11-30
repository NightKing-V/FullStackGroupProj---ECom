require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
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

    // Hash passwords for all users before inserting them into the database
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        // Use the environment variable for salt value, fallback to 10 if not defined
        const saltRounds = process.env.SALT_VALUE || 10; // Default to 10 if SALT_VALUE is not set
        const salt = await bcrypt.genSalt(Number(saltRounds));  // Convert to number if it's a string
        const hashedPassword = await bcrypt.hash(user.password, salt);  // Hash the password
        return { ...user, password: hashedPassword };  // Return user with hashed password
      })
    );

    await User.insertMany(hashedUsers);
    await Product.insertMany(products);

    console.log('Seeding complete!');
    process.exit(); // Exit process after completion
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedData();
