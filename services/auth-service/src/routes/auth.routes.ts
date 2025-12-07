import validate from "@/middleware/validate.middleware";
import { loginSchema, registerSchema } from "@/schemas/auth.schemas";
import { Router } from "express";
import { adminCreateUser, loginUser, logout, refresh, registerUser } from "../controllers/auth.controller";
import requireAuth from "../middleware/auth.middleware";
import authorizeRole from "../middleware/authorize.middleware";

const router = Router();

// /auth/register
router.post("/register", validate(registerSchema), registerUser);

// /auth/login
router.post("/login", validate(loginSchema), loginUser);

// private routes
router.post("/refresh-token", requireAuth, refresh);
router.post("/logout", requireAuth, logout);

router.post("/admin/create-user", requireAuth, authorizeRole("ADMIN"), adminCreateUser);


export default router;
