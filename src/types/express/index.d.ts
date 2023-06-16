import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId: Types.ObjectId;
      email: string;
      role: string;
    }
  }
}
