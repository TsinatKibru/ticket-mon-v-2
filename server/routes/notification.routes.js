import express from "express";
import {
    getUnreadNotifications,
    markNotificationsAsSeen,
} from "../controllers/notification.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all notification routes
router.use(authorize());

router.get("/unread", getUnreadNotifications);
router.post("/mark-seen", markNotificationsAsSeen);

export default router;
