require('dotenv').config(); 
const mongoose = require('mongoose');
const connectDB = require('../config/dbConn');

const User = require('../models/User');
const Product = require('../models/Product');

// more models

const truncateData = async () => {
  try {
    await connectDB();

    console.log('Dropping collections...');

    // Drop the collections (this removes both data and schema)
    await User.collection.drop(); 
    await Product.collection.drop();
    // more collections
    
    console.log('Collections dropped successfully.');

    mongoose.connection.close();
    console.log('Database connection closed.');
    
    process.exit();
  } catch (error) {
    console.error('Error during dropping collections:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

truncateData();
