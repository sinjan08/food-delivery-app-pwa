import logger from "@/config/logger";
import authService from "@/services/auth.service";
import { HTTP_STATUS, sendResponse } from "@/utils/response";
import { Request, Response } from "express";

export const googleCallback = async (req: Request, res: Response) => {
  try {
    logger.debug("Google OAuth Callback called");
    const user = req.user as any;

    const result = await authService.completeGoogleLogin(user);

    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: "User logged in via Google successfully",
      data: result,
    });
  } catch (err: any) {
    logger.error("Google OAuth Callback Error: ", err);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + err.message,
    });
  }
}