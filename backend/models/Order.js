import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        title: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      default: "PENDING",
      required: true,
    },
    status: {
      type: String,
      enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
