const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user); // Debug log
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log('Found', orders.length, 'orders'); // Debug log
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: '_orders আনতে সমস্যা হয়েছে' });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'অর্ডার খুঁজে পাওয়া যায়নি' });
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'অর্ডার আনতে সমস্যা হয়েছে' });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
  try {
    console.log('Received order data:', req.body); // Debug log
    
    const {
      customerName,
      phoneNumber,
      address,
      totalAmount,
      deliveryDate,
      measurementSketch,
      designReference,
      specialNotes,
      measurements,
      sketchData, // This contains the canvas data
      additionalNotes
    } = req.body;

    // Validate required fields
    if (!phoneNumber) {
      return res.status(400).json({ message: "ফোন নম্বর প্রয়োজন" });
    }

    // Handle measurement sketch data from canvas
    let processedMeasurementSketch = measurementSketch || '';
    if (sketchData && sketchData.imageData) {
      processedMeasurementSketch = sketchData.imageData;
    }

    // Handle measurements object
    let processedMeasurements = {
      length: '',
      body: '',
      waist: '',
      hip: '',
      leg: '',
      armLength: '',
      armWidth: '',
      bottomRound: ''
    };
    
    if (measurements && typeof measurements === 'object') {
      processedMeasurements = {
        length: measurements.length || '',
        body: measurements.body || '',
        waist: measurements.waist || '',
        hip: measurements.hip || '',
        leg: measurements.leg || '',
        armLength: measurements.armLength || '',
        armWidth: measurements.armWidth || '',
        bottomRound: measurements.bottomRound || ''
      };
    }

    // Log the data we're about to save
    console.log('Creating order with:', {
      customerName,
      phoneNumber,
      address,
      totalAmount: totalAmount || 0,
      deliveryDate,
      measurementSketch: processedMeasurementSketch,
      designReference,
      specialNotes: specialNotes || additionalNotes || '',
      measurements: processedMeasurements,
      status: "pending",
    });

    const order = new Order({
      customerName: customerName || '',
      phoneNumber: phoneNumber || '',
      address: address || '',
      totalAmount: totalAmount || 0,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      measurementSketch: processedMeasurementSketch,
      designReference: Array.isArray(designReference) ? designReference : [],
      specialNotes: specialNotes || additionalNotes || '',
      measurements: processedMeasurements,
      status: "pending",
    });

    console.log('Order object before save:', order); // Debug log
    
    const createdOrder = await order.save();
    console.log('Order created successfully:', createdOrder._id); // Debug log
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // Handle duplicate key errors
    if (error.code === 11000) {
      console.error('Duplicate key error:', error);
      // Extract the field that caused the duplicate error
      const duplicateField = Object.keys(error.keyPattern)[0];
      const duplicateValue = error.keyValue[duplicateField];
      return res.status(400).json({ 
        message: `এই ${duplicateField} "${duplicateValue}" ইতিমধ্যে ব্যবহৃত হয়েছে` 
      });
    }
    res.status(500).json({ message: 'অর্ডার তৈরি করতে সমস্যা হয়েছে' });
  }
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      address,
      totalAmount,
      deliveryDate,
      measurementSketch,
      designReference,
      specialNotes,
      measurements,
      sketchData, // This contains the canvas data
      additionalNotes
    } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
      // Handle measurement sketch data from canvas
      let processedMeasurementSketch = measurementSketch || order.measurementSketch;
      if (sketchData && sketchData.imageData) {
        processedMeasurementSketch = sketchData.imageData;
      }

      // Handle measurements object
      let processedMeasurements = order.measurements;
      if (measurements && typeof measurements === 'object') {
        processedMeasurements = {
          length: measurements.length || order.measurements.length,
          body: measurements.body || order.measurements.body,
          waist: measurements.waist || order.measurements.waist,
          hip: measurements.hip || order.measurements.hip,
          leg: measurements.leg || order.measurements.leg,
          armLength: measurements.armLength || order.measurements.armLength,
          armWidth: measurements.armWidth || order.measurements.armWidth,
          bottomRound: measurements.bottomRound || order.measurements.bottomRound
        };
      }

      order.customerName = customerName || order.customerName;
      order.phoneNumber = phoneNumber || order.phoneNumber;
      order.address = address || order.address;
      order.totalAmount = totalAmount || order.totalAmount || 0;
      order.deliveryDate = deliveryDate ? new Date(deliveryDate) : order.deliveryDate;
      order.measurementSketch = processedMeasurementSketch;
      order.designReference = Array.isArray(designReference) ? designReference : order.designReference;
      order.specialNotes = specialNotes || additionalNotes || order.specialNotes;
      order.measurements = processedMeasurements;

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'অর্ডার খুঁজে পাওয়া যায়নি' });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'অর্ডার আপডেট করতে সমস্যা হয়েছে' });
  }
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'অবৈধ স্ট্যাটাস' });
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'অর্ডার খুঁজে পাওয়া যায়নি' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'অর্ডার স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে' });
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await Order.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'অর্ডার সফলভাবে মুছে ফেলা হয়েছে' });
    } else {
      res.status(404).json({ message: 'অর্ডার খুঁজে পাওয়া যায়নি' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'অর্ডার মুছে ফেলতে সমস্যা হয়েছে' });
  }
});

// @desc    Get order stats
// @route   GET /api/orders/stats
// @access  Private
const getOrderStats = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const inProgressOrders = await Order.countDocuments({ status: 'in-progress' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });

    res.status(200).json({
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'পরিসংখ্যান আনতে সমস্যা হয়েছে' });
  }
});

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats,
  updateOrderStatus
};