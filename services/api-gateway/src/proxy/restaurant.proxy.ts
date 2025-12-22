import { HTTP_STATUS, sendResponse } from "@/utils/response";
import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;
const API_VERSION = process.env.API_VERSION

export const forwardToRestaurantService = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const originalUrl = req.originalUrl;
    const replacedUrl = originalUrl.replace(`/api/v${API_VERSION}`, "");
    const endpoint = `${RESTAURANT_SERVICE_URL}${replacedUrl}`;

    const response = await axios({
      method: req.method as any,
      url: endpoint,
      data: req.body,

      headers: {
        authorization,
        "content-type": "application/json",
        "x-user-id": req.headers["x-user-id"],
        "x-user-roles": req.headers["x-user-roles"],
      },

      timeout: 10000,
    });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    sendResponse(res, { success: false, status: HTTP_STATUS.SERVER_ERROR, message: err.message });
  }
};

export default forwardToRestaurantService;