const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check if a user is an admin
const checkAdmin = async (email) => {
  try {
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`User found: ${user.name} (${user.email})`);
    console.log(`Role: ${user.role}`);
    console.log(`Is admin: ${user.role === 'admin'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin status:', error);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Please provide an email address');
  console.log('Usage: node checkAdmin.js <email>');
  process.exit(1);
}

checkAdmin(email); 