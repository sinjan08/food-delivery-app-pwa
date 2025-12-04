import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = Router();

// /auth/register
router.post("/register", registerUser);

// /auth/login
router.post("/login", loginUser);

export default router;
