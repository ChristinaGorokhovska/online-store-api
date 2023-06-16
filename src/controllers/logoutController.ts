import { Request, Response } from "express";
import User from "../models/UserModel";

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req?.cookies?.jwt;
    if (!refreshToken) return res.status(401).json({ message: "No token" });

    const foundUser = await User.findOne({ _id: req.userId }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
      return res.status(409).json({ message: "User is not found" });
    }

    foundUser.refreshToken.token = "";
    foundUser.save();
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.status(200).json({ message: "Token is removed" });
  } catch (error) {}
};
