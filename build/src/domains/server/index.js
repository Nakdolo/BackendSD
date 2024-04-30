"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerApp = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const error_1 = require("../../controllers/error");
const logs_1 = require("../../controllers/logs");
const exception_1 = require("../exception");
class ServerApp {
    app;
    port;
    constructor(controllers, port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.app.use(logs_1.requestLogs);
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.app.use("*", () => {
            throw new exception_1.NotFoundException();
        });
        this.app.use(error_1.httpErrors);
    }
    initializeMiddlewares() {
        this.app.use((0, compression_1.default)());
        this.app.use((0, cors_1.default)());
        this.app.use(this.customCors);
        this.app.use(express_1.default.json());
    }
    customCors(_req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, DELETE");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        next();
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/api", controller.router);
        });
    }
    init() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port} | ${new Date()}`);
            console.log(`-----------------------------------------------`);
        });
    }
}
exports.ServerApp = ServerApp;
//# sourceMappingURL=index.js.map