import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS, sendResponse } from "../utils/response";

const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user is authenticated
      const user = (req as any).user;
      if (!user) {
        sendResponse(res, {
          success: false,
          status: HTTP_STATUS.UNAUTHORIZED,
          message: "Unauthorized: No token provided",
        });
        return;
      }
      // getting user roles
      const userRoles = user.roles as string[];
      // Check if user has the required role
      const hasRole = userRoles && userRoles.some((r) => roles.includes(r));
      if (!hasRole) {
        sendResponse(res, {
          success: false,
          status: HTTP_STATUS.FORBIDDEN,
          message: "Forbidden: User does not have the required role",
        });
        return;
      }

      // User is authorized, proceed to next middleware or route handler
      next();
    } catch (err: any) {
      sendResponse(res, {
        success: false,
        status: HTTP_STATUS.SERVER_ERROR,
        message: "An error occurred in authorization middleware: " + err.message,
      });
    }
  };
};

export default authorizeRole;