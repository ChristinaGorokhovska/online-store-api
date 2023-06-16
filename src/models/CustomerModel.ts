import mongoose from "mongoose";
import { ICustomer } from "./types";

export const CustomerSchema = new mongoose.Schema<ICustomer>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    birthDate: Date,
    phone: { type: String, required: true },
    shippingAddress: { country: String, city: String, state: String, street: String, zip: String, building: String },
  },
  { timestamps: true }
);

const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
export default Customer;
