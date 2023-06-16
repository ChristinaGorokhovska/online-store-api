import mongoose from "mongoose";
import { IUser, role } from "./types";

export const UserSchema = new mongoose.Schema<IUser>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(role), default: role.customer, required: true },
    refreshToken: {
      token: { type: String, default: "" },
      modifiedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
