const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Order = require('./models/Order');

// Connect to DB
const connectDB = require('./config/db');
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@borkha-tailors.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Manager User',
    email: 'manager@borkha-tailors.com',
    password: 'manager123',
    role: 'manager'
  }
];

const orders = [
  {
    customerName: 'ফাতেমা খাতুন',
    phoneNumber: '01712345678',
    address: 'ঢাকা, বাংলাদেশ',
    deliveryDate: new Date('2025-01-25'),
    totalAmount: 2500,
    status: 'pending',
    specialNotes: 'একটু ঢিলা রাখতে হবে',
    measurements: {
      length: '42',
      body: '36',
      waist: '32',
      hip: '38'
    }
  },
  {
    customerName: 'সালমা বেগম',
    phoneNumber: '01987654321',
    address: 'চট্টগ্রাম, বাংলাদেশ',
    deliveryDate: new Date('2025-01-24'),
    totalAmount: 3200,
    status: 'in-progress',
    measurements: {
      length: '44',
      body: '38',
      waist: '34',
      hip: '40'
    }
  },
  {
    customerName: 'রুবিনা আক্তার',
    phoneNumber: '01556677889',
    address: 'সিলেট, বাংলাদেশ',
    deliveryDate: new Date('2025-01-20'),
    totalAmount: 2800,
    status: 'completed',
    measurements: {
      length: '40',
      body: '34',
      waist: '30',
      hip: '36'
    }
  }
];

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Order.deleteMany();

    // Hash passwords and insert users
    const hashedUsers = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return { ...user, password: hashedPassword };
    }));

    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Users inserted');

    // Insert orders
    const ordersWithUser = orders.map((order, index) => ({
      ...order,
      user: createdUsers[index % createdUsers.length]._id
    }));

    await Order.insertMany(ordersWithUser);
    console.log('Orders inserted');

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Order.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}