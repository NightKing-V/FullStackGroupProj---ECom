const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// User login (returns a JWT token)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`Login Request: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error); 
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, firstName, lastName, address, role, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({
      email,
      firstName,
      lastName,
      address,
      role,
      password,
    });
    await user.save();

    res.status(201).json({ message: "User registerd successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
