import mongoose from "mongoose";

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the User model
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product", // Reference to the Product model
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    taxPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    isDelivered: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Create the Order model
const Order = mongoose.model("Order", orderSchema);

export default Order;
