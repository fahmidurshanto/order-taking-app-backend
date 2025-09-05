const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Order = require('./models/Order');

// Connect to DB
const connectDB = require('./config/db');
connectDB();

const cleanupData = async () => {
  try {
    // Remove all orders with undefined phoneNumber
    const result = await Order.deleteMany({ 
      $or: [
        { phoneNumber: { $exists: false } },
        { phoneNumber: null },
        { phoneNumber: "" }
      ]
    });
    
    console.log(`Removed ${result.deletedCount} orders with undefined/null phoneNumber`);
    
    // Also remove any orders with undefined customerName if needed
    const result2 = await Order.deleteMany({ 
      $or: [
        { customerName: { $exists: false } },
        { customerName: null },
        { customerName: "" }
      ]
    });
    
    console.log(`Removed ${result2.deletedCount} orders with undefined/null customerName`);
    
    console.log('Database cleanup completed!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

cleanupData();