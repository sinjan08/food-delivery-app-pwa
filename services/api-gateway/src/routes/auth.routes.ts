
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import forwardToAuthService from "../proxy/auth.proxy";

const router = Router();

router.get("/auth/", (req, res) => res.send("API Gateway is working with version route"));

// Public routes
router.post("/auth/login", forwardToAuthService);
router.post("/auth/register", forwardToAuthService);
router.post("/auth/refresh", forwardToAuthService);

// Protected routes
router.use("/auth", authenticate, forwardToAuthService);

export default router;
