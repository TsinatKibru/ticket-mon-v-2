import Notification from "../models/notification.model.js";

/**
 * Saves a new notification to the database.
 */
export const createNotificationService = async (data) => {
    const notification = new Notification(data);
    return await notification.save();
};

/**
 * Retrieves unread notifications for a specific user.
 */
export const getUnreadNotificationsByUserService = async (userId) => {
    return await Notification.find({ recipient: userId, seen: false })
        .sort({ createdAt: -1 })
        .populate("sender", "name")
        .populate("ticket", "title");
};

/**
 * Marks all unread notifications for a user as seen.
 */
export const markAllAsSeenService = async (userId) => {
    return await Notification.updateMany(
        { recipient: userId, seen: false },
        { $set: { seen: true } }
    );
};
