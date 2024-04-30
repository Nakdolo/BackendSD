"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../domains/config");
class Database {
    static async initMainDatabaseClient() {
        try {
            await mongoose_1.default.connect(config_1.Config.mainDatabaseConnectionUrl);
            console.log("Connected to the MongoDB");
            console.log("-----------------------------------------------");
        }
        catch (error) {
            console.error("DB connection error:", error);
            throw error;
        }
    }
}
exports.Database = Database;
//# sourceMappingURL=index.js.map