const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Order = require('./models/Order');

// Connect to DB
const connectDB = require('./config/db');
connectDB();

const checkData = async () => {
  try {
    // Get all orders
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders in the database:`);
    
    orders.forEach((order, index) => {
      console.log(`\nOrder ${index + 1}:`);
      console.log(`  ID: ${order._id}`);
      console.log(`  phoneNumber: ${order.phoneNumber}`);
      console.log(`  customerName: ${order.customerName}`);
      console.log(`  createdAt: ${order.createdAt}`);
    });
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkData();