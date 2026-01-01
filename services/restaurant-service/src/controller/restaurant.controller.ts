import logger from "@/config/logger";
import restaurantService from "@/services/restaurant.service";
import { postRequest } from "@/utils/axiosHelper";
import { HTTP_STATUS, sendResponse } from "@/utils/response";
import { Request, Response } from "express";
import path from "path";


/**
 * 
 * ? ==========================================
 * *        Restaurant On-Board proccess
 * ? ==========================================
 * 
 * * #1 - Owner registration
 * * #2 - Restaurant Details Info save with working timings
 * * #3 - Restaurant Images upload
 * * #4 - Restaurant Documents upload
 * * #5 - Restaurant Menu upload
 * 
 */

/**
 * * #1 - Owner registration
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<Object>} The response object
 * @throws {Error} If an error occurs during registration
 */
export const registerRestaurant = async (req: Request, res: Response) => {
  try {
    logger.debug('Register restaurant controller called');
    const { name, ownerName, email, phone, password } = req.body;
    // register a user and get user id
    const authResponse = await postRequest('/auth/register', {
      name: ownerName,
      email,
      phone,
      password,
      roleCode: 'RESTAURANT'
    });

    logger.debug(authResponse);

    if (!authResponse.success) {
      logger.info('User registration successfully');
      const ownerId = authResponse?.data?.id;

      await restaurantService.updateFormStepNumber(ownerId, 1);
      return sendResponse(res, {
        success: false,
        status: HTTP_STATUS.CREATED,
        message: "Restaurant registered successfully",
        data: { ownerId, restaurantName: name }
      })
    } else {
      logger.error('User registration failed');
      sendResponse(res, {
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: authResponse.message
      })
    }

  } catch (error: any) {
    logger.error('Error in registerRestaurant controller:', error);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + error.message,
    })
  }
}


/**
 * * #2 - Restaurant Details Info save with working timings
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<Object>} The response object
 * @throws {Error} If an error occurs during saving details
 */
export const saveRestaurantDetails = async (req: Request, res: Response) => {
  try {
    logger.debug('Register restaurant controller called');
    const {
      name,
      ownerId,
      address,
      landmark,
      countryId,
      stateId,
      cityId,
      pincode,
      categoryId,
      description,
      voiceNoteDirection,
      workingDays,
      openTiming,
      closeTiming,
    } = req.body;

    // saving details of restaurant
    const saveResponse = await restaurantService.saveDetailsInfo({
      name,
      ownerId,
      address,
      landmark,
      countryId,
      stateId,
      cityId,
      pincode,
      categoryId,
      description,
      voiceNoteDirection,
      workingDays,
      openTiming,
      closeTiming,
    });

    if (saveResponse) {
      await restaurantService.updateFormStepNumber(ownerId, 2);

      return sendResponse(res, {
        success: true,
        status: HTTP_STATUS.CREATED,
        message: "Details saved successfully",
        data: saveResponse
      })
    } else {
      return sendResponse(res, {
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Details failed to save",
      })
    }
  } catch (error: any) {
    logger.error('Error in saveing restaurant details:', error);
    sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'An error occurred: ' + error.message,
    })
  }
}


/**
 * * #3 - Restaurant Images upload
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} The response object
 * @throws {Error} If an error occurs while uploading the images
 */
export const uploadRestaurantImages = async (req: Request, res: Response) => {
  try {
    logger.debug("Restaurant Image upload controller called");

    const { restaurantId, imageType, restaurantCode } = req.body;

    if (!req.files || !Array.isArray(req.files)) {
      return sendResponse(res, {
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: "No files uploaded",
      });
    }

    const savedImages = [];
    const uploadPath = (req as any).uploadPath;

    for (const file of req.files) {
      const dbPath = path.posix.join(
        "uploads",
        uploadPath,
        file.filename
      );

      const saveResponse = await restaurantService.saveRestaurantImages({
        restaurantId,
        imageType,
        path: dbPath,
      });

      savedImages.push(saveResponse);
    }

    return sendResponse(res, {
      success: true,
      status: HTTP_STATUS.CREATED,
      message: "Images uploaded successfully",
      data: {
        restaurantId,
        restaurantCode,
        images: savedImages,
      },
    });
  } catch (error: any) {
    logger.error("Error in upload restaurant images:", error);

    return sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: "An error occurred: " + error.message,
    });
  }
};


export const uploadRestaurantDocs = async (req: Request, res: Response) => {
  try {
    logger.debug("Restaurant Document upload controller called");

    const { restaurantId, docType, restaurantCode } = req.body;

    if (!req.file) {
      return sendResponse(res, {
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: "No file uploaded",
      });
    }

    const uploadPath = (req as any).uploadPath;

    const dbPath = path.posix.join(
      "uploads",
      uploadPath,
      req.file.filename
    );

    const saveResponse = await restaurantService.saveRestaurantDocs({
      restaurantId,
      docType,
      path: dbPath,
    });

    return sendResponse(res, {
      success: true,
      status: HTTP_STATUS.CREATED,
      message: "Document uploaded successfully",
      data: {
        restaurantId,
        restaurantCode,
        doc: saveResponse,
      },
    });
  } catch (error: any) {
    logger.error("Error in upload restaurant documents:", error);

    return sendResponse(res, {
      success: false,
      status: HTTP_STATUS.SERVER_ERROR,
      message: "An error occurred: " + error.message,
    });
  }
};
