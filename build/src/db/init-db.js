"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = void 0;
const index_1 = require("./index");
const initDatabase = async () => {
    console.log(`-----------------------------------------------`);
    console.log(`init database | ${new Date()}`);
    console.log(`-----------------------------------------------`);
    await index_1.Database.initMainDatabaseClient();
};
exports.initDatabase = initDatabase;
//# sourceMappingURL=init-db.js.map