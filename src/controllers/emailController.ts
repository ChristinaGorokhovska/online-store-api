import { Request, Response } from "express";
import User from "../models/UserModel";

// Change email
export const changeEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Properties are required" });

    if (await User.findOne({ email: email }).exec())
      return res.status(409).json({ message: `User with such email (${email}) exists` });

    await User.findOneAndUpdate({ _id: req.userId }, { email: email });
    return res.status(200).json({ message: "Email is updated" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
