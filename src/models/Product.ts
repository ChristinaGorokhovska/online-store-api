import mongoose from "mongoose";
import { IProduct } from "./types";

export const ProductSchema = new mongoose.Schema<IProduct>({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  image: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  categories: [String],
  tags: [String],
  description: String,
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
