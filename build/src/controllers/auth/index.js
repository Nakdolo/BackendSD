"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = require("express");
const auth_1 = require("../../domains/auth");
const auth_2 = require("../../domains/middleweres/auth");
class AuthController {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/auth/login", auth_2.AuthMiddleware.verifyLoginData, this.login);
        this.router.post("/auth/signup", auth_2.AuthMiddleware.verifySignupData, this.registration);
        this.router.post("/auth/password_recovery", this.passwordRecovery);
        this.router.post("/auth/reset_password", this.resetPassword);
        this.router.get("/", this.test);
        this.router.post("/add", auth_2.AuthMiddleware.verifySignupData, this.addUser);
        this.router.post("/delete", this.deleteUser),
            this.router.post("/find", this.findUser);
    }
    async login(req, res) {
        const result = await auth_1.Auth.login(req.body);
        res.status(200).send(result);
    }
    async findUser(req, res) {
        const result = await auth_1.Auth.findUser(req.body);
        res.status(200).send(result);
    }
    async test(req, res) {
        res.status(200);
    }
    async registration(req, res) {
        const result = await auth_1.Auth.signup(req.body);
        res.status(200).send(result);
    }
    async addUser(req, res) {
        const result = await auth_1.Auth.addUser(req.body);
        res.status(200).send(result);
    }
    async deleteUser(req, res) {
        const result = await auth_1.Auth.deleteUser(req.body);
        res.status(200).send(result);
    }
    async resetPassword(req, res) {
        const result = await auth_1.Auth.resetPassword(req.body);
        res.status(200).send(result);
    }
    async passwordRecovery(req, res) {
        const result = await auth_1.Auth.passwordRecovery(req.body);
        res.status(200).send(result);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=index.js.map