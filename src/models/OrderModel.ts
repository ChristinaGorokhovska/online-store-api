import mongoose from "mongoose";
import { IOrder, statusOrder } from "./types";

export const OrderSchema = new mongoose.Schema<IOrder>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      { productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, quantity: { type: Number, default: 1 } },
    ],
    bill: { type: Number, required: true, default: 0 },
    status: { type: String, enum: Object.values(statusOrder), default: statusOrder.unprocessed },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
