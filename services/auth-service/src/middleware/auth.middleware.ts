import { NextFunction, Request, Response } from "express";
import jwt from "../utils/jwt";
import { HTTP_STATUS, sendResponse } from "../utils/response";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, {
        success: false,
        status: HTTP_STATUS.UNAUTHORIZED,
        message: 'Unauthorized: No token provided',
      });
    }
    // getting token from header
    const token = authHeader.split(' ')[1];
    // verifying token
    const decodded = jwt.verify(token);
    if (!decodded) {
      return sendResponse(res, {
        success: false,
        status: HTTP_STATUS.UNAUTHORIZED,
        message: 'Unauthorized: Invalid token',
      });
    }
    // attaching decoded user to request object
    req.user = decodded;
    // proceed to next middleware or route handler
    next();
  } catch (err: any) {
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occured at middleware: ' + err.message,
    });
  }
}

export default requireAuth;