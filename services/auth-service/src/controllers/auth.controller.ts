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


export const me = async (req: Request, res: Response) => {
  try {
    logger.debug('Me controller called');
    const user = (req as any).user;

    const rsult = await authService.getLoggedInUser(user.id);

    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: 'Fetched logged in user successfully',
      data: rsult,
    });
  } catch (error: any) {
    logger.error('Error in me controller:', error);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + error.message,
    });
  }
}

export const sendVerificationEmail = async (req: Request, res: Response) => {
  try {
    logger.debug('Send verification email controller called');
    const user = (req as any).user;
    const result = await authService.sendVerificationMail(user.id);
    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: 'Verification email sent successfully',
      data: result,
    });
  } catch (error: any) {
    logger.error('Error in sendVerificationEmail controller:', error);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + error.message,
    });
  }
}


export const verifyEmailLink = async (req: Request, res: Response) => {
  try {
    logger.debug('Verify email link controller called');
    const { token, uid } = req.query;
    const result = await authService.verifyEmailLink(token as any, uid);
    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: 'Email verified successfully',
      data: result,
    });
  } catch (error: any) {
    logger.error('Error in verifyEmailLink controller:', error);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + error.message,
    });
  }
}


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    logger.debug('Forgot password controller called');
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: 'Password reset link sent successfully',
      data: result,
    });
  } catch (error: any) {
    logger.error('Error in forgotPassword controller:', error);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + error.message,
    });
  }
}


export const resetPassword = async (req: Request, res: Response) => {
  try {
    logger.debug('Reset password controller called');

    const { token, uid, password } = req.body;

    if (!token || !uid || !password) {
      return sendResponse(res, {
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Token, user ID, and new password are required',
      });
    }

    await authService.resetPassword(token, uid, password);

    return sendResponse(res, {
      success: true,
      status: HTTP_STATUS.OK,
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    logger.error('Error in resetPassword controller:', error);

    return sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: error.message || 'An error occurred while resetting password',
    });
  }
};
