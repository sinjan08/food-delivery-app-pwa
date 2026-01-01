import { HTTP_STATUS, sendResponse } from "@/utils/response";
import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  sendResponse(res, {
    success: false,
    status: HTTP_STATUS.SERVER_ERROR,
    message: "Something went wrong",
  });
}
