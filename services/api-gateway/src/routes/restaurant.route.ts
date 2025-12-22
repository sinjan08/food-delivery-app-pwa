
import forwardToRestaurantService from "@/proxy/restaurant.proxy";
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Protected routes
router.use("/restaurants", authenticate, forwardToRestaurantService);

export default router;
