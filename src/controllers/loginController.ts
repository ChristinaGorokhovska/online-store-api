import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/UserModel";
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Has no required properties" });

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) return res.status(409).json({ message: `User is not found` });

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) return res.status(400).json({ message: "Password is not valid" });

    const accessToken = jwt.sign(
      {
        userData: {
          userId: foundUser._id,
          email: foundUser.email,
          role: foundUser.role,
        },
      },
      ACCESS_TOKEN_SECRET as string,
      { expiresIn: "60s" }
    );

    const refreshToken = jwt.sign(
      {
        userId: foundUser._id,
      },
      REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken.token = refreshToken;
    foundUser.refreshToken.modifiedAt = new Date(Date.now());

    foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const role = foundUser.role;

    return res.status(200).json({ message: "Authorizated", role, accessToken });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
