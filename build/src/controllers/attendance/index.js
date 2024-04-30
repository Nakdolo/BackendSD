"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const express_1 = require("express");
const auth_1 = require("../../domains/auth");
class AttendanceController {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/attendance");
    }
    async attendance(req, res) {
        const result = await auth_1.Auth.login(req.body);
        res.status(200).send(result);
    }
}
exports.AttendanceController = AttendanceController;
//# sourceMappingURL=index.js.map