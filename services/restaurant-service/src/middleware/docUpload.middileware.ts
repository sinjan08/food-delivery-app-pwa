import { NextFunction, Request, Response } from "express";

export const imageUploader = async (req: Request, res: Response, next: NextFunction) => {
  const { restaurantCode } = req.body;

  if (!restaurantCode) {
    return res.status(400).json({ message: "restaurantCode required" });
  }

  (req as any).uploadPath = `restaurant/${restaurantCode}/images`;
  next();
}

export const docUploader = async (req: Request, res: Response, next: NextFunction) => {
  const { restaurantCode } = req.body;

  if (!restaurantCode) {
    return res.status(400).json({ message: "restaurantCode required" });
  }

  (req as any).uploadPath = `restaurant/${restaurantCode}/documents`;
  next();
}