import mongoose from "mongoose";
import { ICart } from "./types";

export const CartSchema = new mongoose.Schema<ICart>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    bill: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
