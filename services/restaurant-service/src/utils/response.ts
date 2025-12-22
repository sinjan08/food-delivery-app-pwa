import { Response } from "express";

/**
 * Generic API response shape
 */
export interface ApiResponse<T = unknown, M = unknown> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  metadata?: M;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Unified API response handler
 */
export const sendResponse = <
  T = unknown,
  M = unknown
>(
  res: Response,
  {
    success = true,
    status = 200,
    message = "",
    data,
    metadata,
    errorCode,
  }: {
    success?: boolean;
    status?: number;
    message?: string;
    data?: T;
    metadata?: M;
    errorCode?: number; // used when success = false
  }
): Response<ApiResponse<T, M>> => {

  const response: ApiResponse<T, M> = {
    success,
    status,
    message,
  };

  if (success) {
    if (data !== undefined) response.data = data;
    if (metadata !== undefined) response.metadata = metadata;
  } else {
    response.error = {
      code: errorCode || status,
      message: message || "Something went wrong",
    };
  }

  return res.status(status).json(response);
};

/**
 * HTTP status codes (Enum recommended)
 */
export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}
