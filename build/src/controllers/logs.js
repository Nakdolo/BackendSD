"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogs = void 0;
const requestLogs = (req, _res, next) => {
    try {
        console.log(`NEW REQUEST | ${new Date()}`);
        console.log(`${req.method} - ${req.url}`);
        console.log("-----------------------------------------------");
    }
    catch (e) {
        console.log(e);
    }
    finally {
        next();
    }
};
exports.requestLogs = requestLogs;
//# sourceMappingURL=logs.js.map