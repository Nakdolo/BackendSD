"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_dto_1 = require("../../../controllers/auth/dto/auth.dto");
const recovory_dto_1 = require("../../../controllers/auth/dto/recovory.dto");
const config_1 = require("../../config");
const exception_1 = require("../../exception");
const utils_1 = require("../../../utils");
const signup_dto_1 = require("../../../controllers/auth/dto/signup.dto");
class AuthMiddleware {
    static async verifyClientAccessToken(req, res, next) {
        const headers = req.headers.authorization || "";
        const arr = headers.split(" ");
        if (arr.length !== 2) {
            throw new exception_1.UnauthorizedException();
        }
        const tokenType = arr[0];
        const token = arr[1];
        if (tokenType !== "Bearer") {
            throw new exception_1.UnauthorizedException();
        }
        try {
            const verifyResult = (0, jsonwebtoken_1.verify)(token, config_1.Config.clientAuthSecretOrPrivateKey);
            req.body.user = verifyResult;
            return next();
        }
        catch (e) {
            console.log(e);
            throw new exception_1.UnauthorizedException();
        }
    }
    static async verifyLoginData(req, res, next) {
        const dto = (0, class_transformer_1.plainToClass)(auth_dto_1.LoginDto, req.body);
        const errorTexts = utils_1.Utils.getErrorMessages(await (0, class_validator_1.validate)(dto));
        if (errorTexts.length > 0) {
            throw new exception_1.BadRequestException(errorTexts);
        }
        next();
    }
    static async verifyRecovoryData(req, res, next) {
        const dto = (0, class_transformer_1.plainToClass)(recovory_dto_1.passwordRecovoryDto, req.body);
        const errorTexts = utils_1.Utils.getErrorMessages(await (0, class_validator_1.validate)(dto));
        if (errorTexts.length > 0) {
            throw new exception_1.BadRequestException(errorTexts);
        }
        next();
    }
    static async verifySignupData(req, res, next) {
        const dto = (0, class_transformer_1.plainToClass)(signup_dto_1.SignupDto, req.body);
        const errorTexts = utils_1.Utils.getErrorMessages(await (0, class_validator_1.validate)(dto));
        if (errorTexts.length > 0) {
            throw new exception_1.BadRequestException(errorTexts);
        }
        next();
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=index.js.map