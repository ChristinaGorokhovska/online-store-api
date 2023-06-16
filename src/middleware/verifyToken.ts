import { Response, NextFunction, Request } from "express";
import { Jwt, VerifyCallback, VerifyErrors, verify } from "jsonwebtoken";
const { ACCESS_TOKEN_SECRET } = process.env;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Authorization header is not correct" });

  const token = authHeader.split(" ")[1];

  const verifyCallBack: VerifyCallback<Jwt> = (error: VerifyErrors | null, decoded: Jwt | undefined) => {
    if (error) {
      res.status(403).json({ error: error });
      return;
    }
    if (!decoded || typeof decoded.payload == "string") {
      return res.status(403).json({ error: "Token can not be decoded" });
    }

    req.userId = decoded.payload["userData"].userId;
    req.email = decoded.payload["userData"].email;
    req.role = decoded.payload["userData"].role;

    next();
  };

  verify(token, ACCESS_TOKEN_SECRET as string, { complete: true }, verifyCallBack);
};

export default verifyToken;
