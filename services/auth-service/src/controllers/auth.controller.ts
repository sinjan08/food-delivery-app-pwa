import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  return res.json({ msg: "Register API works" });
};

export const loginUser = async (req: Request, res: Response) => {
  return res.json({ msg: "Login API works" });
};
