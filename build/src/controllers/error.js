"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpErrors = void 0;
const exception_1 = require("../domains/exception");
const httpErrors = (err, _req, res, _next) => {
    console.log(err);
    if (err instanceof exception_1.HttpException) {
        res
            .status(err.status)
            .send({
            statusCode: err.status,
            message: err.message,
        })
            .end();
        return;
    }
    res
        .status(500)
        .send({
        statusCode: 500,
        message: "Internal Server Error",
    })
        .end();
};
exports.httpErrors = httpErrors;
//# sourceMappingURL=error.js.map