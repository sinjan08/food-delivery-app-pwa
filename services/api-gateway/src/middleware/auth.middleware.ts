import { sendResponse } from "@/utils/response";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;

    // attach user context
    (req as any).user = payload;

    // propagate to downstream services
    req.headers["x-user-id"] = String(payload.id);
    req.headers["x-user-roles"] = payload.roles.join(",");

    next();
  } catch {
    sendResponse(res, {
      success: false,
      status: 401,
      message: "Unauthorized",
    });
  }
};
