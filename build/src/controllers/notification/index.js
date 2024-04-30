"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const express_1 = require("express");
const notification_1 = require("../../domains/notification");
class NotificationController {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/notification/sent", this.sendNotification);
        this.router.post("/notification/get", this.getNotifications);
        this.router.post("/notification/sentToAll", this.notifyAll);
        this.router.post("/notification/markTheMessage", this.marked);
    }
    async sendNotification(req, res) {
        const result = await notification_1.Notification.sendNotification(req.body);
        res.status(200).send(result);
    }
    async getNotifications(req, res) {
        const result = await notification_1.Notification.getNotifications(req.body);
        res.status(200).send(result);
    }
    async notifyAll(req, res) {
        const result = await notification_1.Notification.sentNotificationsAll(req.body);
        res.status(200).send(result);
    }
    async marked(req, res) {
        const result = await notification_1.Notification.markTheMessage(req.body);
        res.status(200).send(result);
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=index.js.map