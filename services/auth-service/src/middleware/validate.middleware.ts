import { HTTP_STATUS, sendResponse } from "@/utils/response";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

const validate =
  (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (err: any) {
        if (err instanceof ZodError) {

          const firstErrorMessage = err.issues[0].message; // <--- FIX HERE

          return sendResponse(res, {
            success: false,
            status: HTTP_STATUS.BAD_REQUEST,
            message: firstErrorMessage,
          });
        }

        return sendResponse(res, {
          success: false,
          status: HTTP_STATUS.SERVER_ERROR,
          message: "Something went wrong",
        });
      }
    };

export default validate;