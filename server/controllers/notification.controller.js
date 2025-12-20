import {
    getUnreadNotificationsByUserService,
    markAllAsSeenService,
} from "../services/notification.service.js";

/**
 * Get unread notifications for the logged-in user.
 */
export const getUnreadNotifications = async (req, res, next) => {
    try {
        const notifications = await getUnreadNotificationsByUserService(req.user._id);
        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mark all notifications as seen for the logged-in user.
 */
export const markNotificationsAsSeen = async (req, res, next) => {
    try {
        await markAllAsSeenService(req.user._id);
        res.status(200).json({
            success: true,
            message: "All notifications marked as seen",
        });
    } catch (error) {
        next(error);
    }
};
