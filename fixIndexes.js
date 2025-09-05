require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected at host: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const fixIndexes = async () => {
  try {
    // Get current indexes
    const currentIndexes = await Order.collection.indexes();
    console.log('Current indexes:');
    console.log(JSON.stringify(currentIndexes, null, 2));

    // Drop all indexes except _id
    for (const index of currentIndexes) {
      if (index.name !== '_id_') {
        console.log(`Dropping index: ${index.name}`);
        try {
          await Order.collection.dropIndex(index.name);
          console.log(`Successfully dropped index: ${index.name}`);
        } catch (error) {
          console.error(`Error dropping index ${index.name}:`, error.message);
        }
      }
    }

    // Create proper indexes based on current schema
    console.log('Creating proper indexes...');
    
    // Create text index for customer search
    await Order.collection.createIndex(
      { 
        "customerData.name": "text",
        "customerData.phone": "text",
        "customerData.address": "text"
      },
      { 
        name: "customer_search_text",
        background: true 
      }
    );
    console.log('Created text search index');

    // Create indexes for common query fields
    await Order.collection.createIndex({ "status": 1 }, { name: "status_1", background: true });
    await Order.collection.createIndex({ "orderDate": -1 }, { name: "orderDate_-1", background: true });
    await Order.collection.createIndex({ "deliveryDate": 1 }, { name: "deliveryDate_1", background: true });
    await Order.collection.createIndex({ "createdAt": -1 }, { name: "createdAt_-1", background: true });
    await Order.collection.createIndex({ "customerData.phone": 1 }, { name: "customerData.phone_1", background: true });
    
    // Create compound indexes for common queries
    await Order.collection.createIndex(
      { "status": 1, "orderDate": -1 }, 
      { name: "status_1_orderDate_-1", background: true }
    );
    
    console.log('All proper indexes created successfully');

    // Verify new indexes
    const newIndexList = await Order.collection.indexes();
    console.log('Final indexes:');
    console.log(JSON.stringify(newIndexList, null, 2));

  } catch (error) {
    console.error('Error fixing indexes:', error);
  }
};

const main = async () => {
  await connectDB();
  await fixIndexes();
  mongoose.connection.close();
  console.log('Index fix completed!');
};

main();