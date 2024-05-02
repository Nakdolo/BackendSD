"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const class_1 = require("../../data/class");
const notification_1 = require("../../data/notification");
const user_1 = require("../../data/user");
const exception_1 = require("../exception");
class Notification {
    static async sendNotification(data) {
        try {
            const user = await user_1.UserData.getUserByIDD(data.to);
            if (!user) {
                throw new exception_1.BadRequestException("User with this ID doesn't exist");
            }
            else {
                const notify = await notification_1.NotificationData.addNotification(data);
                if (!notify) {
                    throw new exception_1.BadRequestException("Wrong data");
                }
                return "Notification sent successfully";
            }
        }
        catch (error) {
            console.error("Error sending notification:", error);
            throw new Error("Failed to send notification");
        }
    }
    static async getNotifications(data) {
        try {
            const notifications = await notification_1.NotificationData.getNotifications(data);
            if (!notifications) {
                throw new exception_1.BadRequestException("Wrong data");
            }
            return notifications;
        }
        catch (error) {
            console.error("Error getting notifications:", error);
            throw new Error("Failed to get notifications");
        }
    }
    static async sentNotificationsAll(data) {
        try {
            const classToNotify = await class_1.ClassData.getClassByName(data.toClassName);
            if (!classToNotify) {
                throw new exception_1.BadRequestException("Wrong data");
            }
            const students = classToNotify.students;
            for (const studentId of students) {
                const notificationData = {
                    title: data.title,
                    message: data.message,
                    from: data.from,
                    to: studentId,
                    marked: false,
                };
                await Notification.sendNotification(notificationData);
            }
            return "Notifications sent successfully to all students in the class";
        }
        catch (error) {
            console.error("Error sending notifications to all:", error);
            throw new Error("Failed to send notifications to all");
        }
    }
    static async markTheMessage(objectId) {
        const findMessage = await notification_1.NotificationModel.findOneAndUpdate({ _id: objectId }, // Query to find the document by _id
        { marked: true }, // Update operation to set marked to true
        { new: true } // Option to return the updated document
        );
        if (!findMessage) {
            return "Message doesn't exist";
        }
        return "Message marked successfully";
    }
}
exports.Notification = Notification;
//# sourceMappingURL=index.js.map