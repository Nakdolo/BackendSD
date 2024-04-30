"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./controllers/auth");
const class_1 = require("./controllers/class");
const notification_1 = require("./controllers/notification");
const init_db_1 = require("./db/init-db");
const config_1 = require("./domains/config");
const server_1 = require("./domains/server");
const app = new server_1.ServerApp([new auth_1.AuthController(), new notification_1.NotificationController(), new class_1.ClassController()], config_1.Config.clientApiPort);
const init = async () => {
    app.init();
};
(0, init_db_1.initDatabase)().then(init);
//# sourceMappingURL=online-chat-api.js.map