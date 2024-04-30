"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
class Token {
    static signTokenForUser(data, options) {
        const payload = data;
        const accessToken = (0, jsonwebtoken_1.sign)(payload, config_1.Config.clientAuthSecretOrPrivateKey, options);
        return {
            accessToken,
        };
    }
    static generateToken(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
exports.Token = Token;
//# sourceMappingURL=index.js.map