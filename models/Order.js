const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: [true, "ফোন নম্বর প্রয়োজন"],
      // Remove unique constraint to allow testing with same numbers
      // If you want to enforce uniqueness in production, uncomment the next line:
      // unique: false, // Set to true for production
    },
    address: {
      type: String,
    },
    deliveryDate: {
      type: Date,
    },
    totalAmount: {
      type: Number,
    },
    measurementSketch: {
      type: String,
    },
    designReference: [
      {
        type: String,
      },
    ],
    specialNotes: {
      type: String,
    },
    measurements: {
      length: String,
      body: String,
      waist: String,
      hip: String,
      leg: String,
      armLength: String,
      armWidth: String,
      bottomRound: String,
    },
    status: {
      type: String,
      required: [true, "অর্ডার স্ট্যাটাস প্রয়োজন"],
      default: "pending",
      enum: {
        values: ["pending", "in-progress", "completed"],
        message: "অবৈধ স্ট্যাটাস"
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
orderSchema.index({ phoneNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order" , orderSchema);

module.exports = Order;