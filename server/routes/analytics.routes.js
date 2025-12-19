import { Router } from "express";
import {
    getMetrics,
    getResolutionTime,
    getAgentStats,
    getCategoryStats,
    getTrends,
} from "../controllers/analytics.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const analyticsRouter = Router();

// All analytics routes require admin or support_agent role
analyticsRouter.get("/metrics", authorize(["admin", "support_agent"]), getMetrics);
analyticsRouter.get("/resolution-time", authorize(["admin", "support_agent"]), getResolutionTime);
analyticsRouter.get("/agent-performance", authorize(["admin", "support_agent"]), getAgentStats);
analyticsRouter.get("/category-breakdown", authorize(["admin", "support_agent"]), getCategoryStats);
analyticsRouter.get("/trends", authorize(["admin", "support_agent"]), getTrends);

export default analyticsRouter;
