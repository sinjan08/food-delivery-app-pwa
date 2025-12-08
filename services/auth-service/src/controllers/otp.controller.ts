import logger from "@/config/logger";
import authService from "@/services/auth.service";
import { HTTP_STATUS, sendResponse } from "@/utils/response";
import { Request, Response } from "express";

export const sendOtp = async (req: Request, res: Response) => {
  try {
    logger.debug("Send OTP called");
    const { phoneNumber } = req.body;
    const otp = await authService.generateOtp(phoneNumber);
    if (!otp) {
      sendResponse(res, {
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Failed to generate OTP",
      });
    } else {
      sendResponse(res, {
        success: true,
        status: HTTP_STATUS.OK,
        message: "OTP sent successfully",
        data: otp,
      });
    }
  } catch (err: any) {
    logger.error("Send OTP Error: ", err);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + err.message,
    });
  }
}


export const verifyOtp = async (req: Request, res: Response) => {
  try {
    logger.debug("Verify OTP called");
    const { phoneNumber, otp } = req.body;
    const result = await authService.verifyOtp(phoneNumber, otp);
    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: "OTP verified successfully",
      data: result,
    });
  } catch (err: any) {
    logger.error("Verify OTP Error: ", err);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + err.message,
    });
  }
}