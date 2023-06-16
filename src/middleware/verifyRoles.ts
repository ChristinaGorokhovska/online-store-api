import { NextFunction, Request, Response } from "express";

const verifyRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.role) return res.status(400).json({ message: "Role is not provided" });

    const mathcedRole = roles.map((role: any) => role == req.role).find((val: any) => val === true);

    if (!mathcedRole) return res.status(401).json({ message: "Roles do not match" });
    next();
  };
};

export default verifyRoles;
