import { HTTP_STATUS, sendResponse } from "@/utils/response";
import { NextFunction, Request, Response } from "express";

export const multerErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    sendResponse(res, { success: false, status: HTTP_STATUS.BAD_REQUEST, message: err.message });
  }
  next();
};
