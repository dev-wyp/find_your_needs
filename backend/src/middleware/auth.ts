// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AuthRequest extends Request {
  userId?: string;
}

export interface SuperAdminRequest extends Request {
  user?: any;
}

export const isSuperAdmin = (req: SuperAdminRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  // Assuming you have JWT token with user info
  try {
    const decoded: any = require("jsonwebtoken").verify(token, JWT_SECRET);

    console.log(decoded);
    
    if (decoded.role !== "superAdmin") {
      return res.status(403).json({ message: "Forbidden: Super Admins only" });
    }

    // Attach user to request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
