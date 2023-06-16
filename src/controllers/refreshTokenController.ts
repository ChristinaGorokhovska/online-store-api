import { Request, Response } from "express";
import User from "../models/UserModel";
import { Jwt, VerifyCallback, VerifyErrors, sign, verify } from "jsonwebtoken";
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) return res.status(401).json({ message: "No cookies" });

    const foundUser = await User.findOne({ "refreshToken.token": refreshToken });
    if (!foundUser) return res.status(403).json({ message: "User is not found" });

    const verifyCallBack: VerifyCallback<Jwt> = (error: VerifyErrors | null, decoded: Jwt | undefined) => {
      if (error || typeof decoded?.payload == "string" || foundUser._id != decoded?.payload.userId) {
        res.status(403).json({ error: error });
        return;
      }

      const accessToken = sign(
        {
          userData: {
            userId: foundUser._id,
            email: foundUser.email,
            role: foundUser.role,
          },
        },
        ACCESS_TOKEN_SECRET as string,
        { expiresIn: "500s" }
      );

      res.status(200).json({ message: "Refreshed", accessToken });
    };

    verify(refreshToken, REFRESH_TOKEN_SECRET as string, { complete: true }, verifyCallBack);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
