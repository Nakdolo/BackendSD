"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = exports.NotFoundException = exports.InternalServerErrorException = exports.BadRequestException = exports.UnauthorizedException = exports.HttpException = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class HttpException {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
    status;
    message;
}
exports.HttpException = HttpException;
class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized") {
        super(http_status_codes_1.default.UNAUTHORIZED, message);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class BadRequestException extends HttpException {
    constructor(message = "Bad Request") {
        super(http_status_codes_1.default.BAD_REQUEST, message);
    }
}
exports.BadRequestException = BadRequestException;
class InternalServerErrorException extends HttpException {
    constructor(message = "Internal Server Error") {
        super(http_status_codes_1.default.INTERNAL_SERVER_ERROR, message);
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
class NotFoundException extends HttpException {
    constructor(message = "Not Found") {
        super(http_status_codes_1.default.NOT_FOUND, message);
    }
}
exports.NotFoundException = NotFoundException;
class ForbiddenException extends HttpException {
    constructor(message = "Forbidden") {
        super(http_status_codes_1.default.FORBIDDEN, message);
    }
}
exports.ForbiddenException = ForbiddenException;
//# sourceMappingURL=index.js.map