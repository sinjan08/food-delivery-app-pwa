import { Request, Response } from "express";
import logger from "../config/logger";
import authService from "../services/auth.service";
import { HTTP_STATUS, sendResponse } from "../utils/response";

export const registerUser = async (req: Request, res: Response) => {
  try {
    logger.debug('Register user controller called');
    // Extract user input from request body
    const { name, email, password, phone, address, zipCode, countryId, stateId, cityId } = req.body;

    // Call the registerUser service
    const result = await authService.registerSelf({
      name,
      email,
      password,
      phone,
      address,
      zipCode,
      countryId,
      stateId,
      cityId,
    });

    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.CREATED,
      message: 'User registered successfully',
      data: result,
    });
  } catch (err: any) {
    logger.error('Error in registerUser controller:', err);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + err.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    logger.debug('Login user controller called');
    // Extract user input from request body
    const { email, password } = req.body;

    // Call the loginUser service
    const result = await authService.login(email, password);

    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: 'User logged in successfully',
      data: result,
    });
  } catch (err: any) {
    logger.error('Error in loginUser controller:', err);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + err.message,
    })
  }
};

export const adminCreateUser = async (req: Request, res: Response) => {
  try {
    logger.debug('Admin create user controller called');
    // Extract user input from request body
    const { name, email, password, phone, address, zipCode, countryId, stateId, cityId, roleCode } = req.body;

    // Call the adminCreateUser service
    const result = await authService.adminCreateUser({
      name,
      email,
      password,
      phone,
      address,
      zipCode,
      countryId,
      stateId,
      cityId,
      roleCode,
    });

    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.CREATED,
      message: 'User created successfully',
      data: result,
    });
  } catch (err: any) {
    logger.error('Error in adminCreateUser controller:', err);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + err.message,
    });
  }
}


export const refresh = async (req: Request, res: Response) => {
  try {
    logger.debug('Refresh controller called');
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error: any) {
    logger.error('Error in refresh controller:', error);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + error.message,
    });
  }
}


export const logout = async (req: Request, res: Response) => {
  try {
    logger.debug('Logout controller called');
    const { refreshToken } = req.body;

    const result = await authService.logout(refreshToken);
    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: 'User logged out successfully',
      data: result,
    });
  } catch (error: any) {
    logger.error('Error in logout controller:', error);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + error.message,
    });
  }
}