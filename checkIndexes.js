const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Order = require('./models/Order');

// Connect to DB
const connectDB = require('./config/db');
connectDB();

const checkAndFixIndexes = async () => {
  try {
    // Get the collection
    const collection = mongoose.connection.collection('orders');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:');
    console.log(JSON.stringify(indexes, null, 2));
    
    // Check for unique indexes on phoneNumber
    const phoneNumberUniqueIndex = indexes.find(index => 
      index.key.phoneNumber === 1 && index.unique === true
    );
    
    if (phoneNumberUniqueIndex) {
      console.log('Found unique index on phoneNumber:', phoneNumberUniqueIndex.name);
      console.log('Dropping unique index...');
      
      // Drop the unique index
      await collection.dropIndex(phoneNumberUniqueIndex.name);
      console.log('Unique index dropped successfully');
    } else {
      console.log('No unique index found on phoneNumber');
    }
    
    // Create a regular index (non-unique) on phoneNumber
    console.log('Creating regular index on phoneNumber...');
    await collection.createIndex({ phoneNumber: 1 });
    console.log('Regular index created successfully');
    
    console.log('Index check and fix completed!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAndFixIndexes();