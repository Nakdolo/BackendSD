"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationData = exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const COLLECTION_NAME = "NotificationData";
const NotificationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    data: { type: Date },
    marked: { type: Boolean },
}, {
    collection: COLLECTION_NAME,
});
exports.NotificationModel = (0, mongoose_1.model)(COLLECTION_NAME, NotificationSchema);
class NotificationData {
    static async addNotification(notificationData) {
        try {
            notificationData.data = new Date();
            await exports.NotificationModel.create(notificationData);
            return "Успешно отправлено";
        }
        catch (error) {
            console.error("Error adding notification:", error);
            throw new Error("Failed to add notification");
        }
    }
    static async updateNotification(id, notificationData) {
        try {
            const updatedNotification = await exports.NotificationModel.findByIdAndUpdate(id, notificationData, { new: true });
            return updatedNotification ? updatedNotification.toObject() : null;
        }
        catch (error) {
            console.error("Error updating notification:", error);
            throw new Error("Failed to update notification");
        }
    }
    static async getNotifications(data) {
        try {
            const notifications = await exports.NotificationModel.find({ to: data.to });
            return notifications;
        }
        catch (error) {
            console.error("Error getting notifications:", error);
            throw new Error("Failed to get notifications");
        }
    }
}
exports.NotificationData = NotificationData;
//# sourceMappingURL=notification.js.map