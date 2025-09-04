const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    measurementSketch: {
      type: String,
    },
    designReference: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      required: true,
      default: "pending",
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

const Order = mongoose.model("Order" , orderSchema);


module.exports = Order;