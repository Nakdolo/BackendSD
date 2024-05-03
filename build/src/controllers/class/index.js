"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassController = void 0;
const express_1 = require("express");
const class_1 = require("../../domains/class");
class ClassController {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/class/create", this.create);
        this.router.post("/class/register", this.register);
        this.router.post("/class/list", this.list);
        this.router.post("/class/students", this.students);
        this.router.post("/class/attend", this.attend);
        this.router.post("/class/procentage", this.procentage);
        this.router.post("/class/procentageForUser", this.procentageForUser);
        this.router.post("/class/myList", this.myList);
        this.router.post("/class/getClass", this.getClass);
    }
    async procentageForUser(req, res) {
        const result = await class_1.Class.procentageForUser(req.body);
        res.status(200).send(result);
    }
    async create(req, res) {
        const result = await class_1.Class.createClass(req.body);
        res.status(200).send(result);
    }
    async myList(req, res) {
        const result = await class_1.Class.myList(req.body);
        res.status(200).send(result);
    }
    async register(req, res) {
        const result = await class_1.Class.registerToClass(req.body);
        res.status(200).send(result);
    }
    async list(req, res) {
        const result = await class_1.Class.listClasses();
        res.status(200).send(result);
    }
    async students(req, res) {
        const result = await class_1.Class.studentsForAttendance(req.body);
        res.status(200).send(result);
    }
    async attend(req, res) {
        const result = await class_1.Class.attend(req.body);
        res.status(200).send(result);
    }
    async procentage(req, res) {
        const result = await class_1.Class.calculateOverallAttendance(req.body);
        res.status(200).send(result);
    }
    async getClass(req, res) {
        const result = await class_1.Class.getClass(req.body);
        res.status(200).send(result);
    }
}
exports.ClassController = ClassController;
//# sourceMappingURL=index.js.map