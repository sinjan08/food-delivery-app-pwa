import { googleCallback } from "@/controllers/oAuth.controller";
import { sendOtp, verifyOtp } from "@/controllers/otp.controller";
import validate from "@/middleware/validate.middleware";
import { loginSchema, registerSchema } from "@/schemas/auth.schemas";
import { Router } from "express";
import passport from "passport";
import { adminCreateUser, forgotPassword, loginUser, logout, me, refresh, registerUser, resetPassword, sendVerificationEmail, verifyEmailLink } from "../controllers/auth.controller";
import requireAuth from "../middleware/auth.middleware";
import authorizeRole from "../middleware/authorize.middleware";

const router = Router();

// /auth/register
router.post("/register", validate(registerSchema), registerUser);

// /auth/login
router.post("/login", validate(loginSchema), loginUser);

// forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// google oauth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback)

// otp login routes
router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);

// private routes
router.get("/me", requireAuth, me);
router.post("/email-verify/send", requireAuth, sendVerificationEmail);
router.post("/email-verify", requireAuth, verifyEmailLink);
router.post("/refresh-token", requireAuth, refresh);
router.post("/logout", requireAuth, logout);

router.post("/admin/create-user", requireAuth, authorizeRole("ADMIN"), adminCreateUser);


export default router;
