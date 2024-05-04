"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const bcryptjs_1 = require("bcryptjs");
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_1 = require("../../data/user");
const exception_1 = require("../exception");
const token_1 = require("../token");
class Auth {
    static async login(data) {
        let user;
        if (data.idOrEmail.includes("@")) {
            user = await user_1.UserData.getUserByEmail(data.idOrEmail);
        }
        else {
            user = await user_1.UserData.getUserByIDD(data.idOrEmail);
        }
        if (!user) {
            throw new exception_1.BadRequestException("Неверные учетные данные");
        }
        if (!this.comparePasswords(user.password, data.password)) {
            throw new exception_1.BadRequestException("Неверные учетные данные");
        }
        const token = token_1.Token.signTokenForUser({
            id: user._id,
        }, {
            expiresIn: data.rememberMe ? "1h" : "6h",
        });
        return {
            token,
            userEmail: user.email,
            userRole: user.userRole,
            UserName: user.name,
            UserSurname: user.surName,
            phone: user.phone,
            ID: user.ID,
        };
    }
    static classifyInput(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const idRegex = /^\d+$/;
        if (emailRegex.test(input)) {
            return { type: "email", value: { email: input } };
        }
        else if (idRegex.test(input)) {
            return { type: "ID", value: { ID: input } };
        }
        else {
            // Handling name and surname requires another approach
            const parts = input.split(" ");
            if (parts.length === 2) {
                return {
                    type: "nameAndSurname",
                    value: { name: parts[0], surName: parts[1] },
                };
            }
        }
        return { type: "unknown", value: null };
    }
    static async findUser(data) {
        const result = this.classifyInput(data.ID);
        if (result.type === "unknown") {
            throw new exception_1.BadRequestException("User doesn't exist");
        }
        const user = await user_1.UserModel.findOne(result.value);
        if (!user) {
            throw new exception_1.BadRequestException("User not found");
        }
        return {
            ID: user.ID,
            userEmail: user.email,
            userRole: user.userRole,
            userName: user.name,
            userSurname: user.surName,
            phone: user.phone,
        };
    }
    static async signup(data) {
        const userByEmail = await user_1.UserData.getUserByEmail(data.email);
        const userBYID = await user_1.UserData.getUserByIDD(data.ID);
        if (userBYID) {
            throw new exception_1.BadRequestException("ID должен быть уникальным");
        }
        if (userByEmail) {
            throw new exception_1.BadRequestException("Пользователь с таким email уже существует");
        }
        const hashPassword = this.hashPassword(data.password);
        const newUser = new user_1.UserModel({
            user: data.ID,
            email: data.email,
            password: hashPassword,
            name: data.name,
            surName: data.surName,
            phone: data.phone,
            userRole: data.userRole,
        });
        await newUser.save();
        const token = token_1.Token.signTokenForUser({
            id: newUser._id,
        }, {
            expiresIn: "1h",
        });
        return {
            token,
            userEmail: newUser.email,
            userRole: newUser.userRole,
            UserName: newUser.name,
            UserSurname: newUser.surName,
            phone: newUser.phone,
            ID: newUser.ID,
        };
    }
    static async addUser(data) {
        const userByEmail = await user_1.UserData.getUserByEmail(data.email);
        const userBYID = await user_1.UserData.getUserByIDD(data.ID);
        if (userBYID) {
            throw new exception_1.BadRequestException("ID должен быть уникальным");
        }
        if (userByEmail) {
            throw new exception_1.BadRequestException("Пользователь с таким email уже существует");
        }
        const hashPassword = this.hashPassword(data.password);
        const newUser = new user_1.UserModel({
            ID: data.ID,
            email: data.email,
            password: hashPassword,
            name: data.name,
            surName: data.surName,
            phone: data.phone,
            userRole: data.userRole,
        });
        await newUser.save();
        const token = token_1.Token.signTokenForUser({
            id: newUser._id,
        }, {
            expiresIn: "1h",
        });
        return {
            token,
        };
    }
    static async deleteUser(data) {
        const userByID = await user_1.UserData.getUserByIDD(data.ID);
        if (!userByID) {
            throw new exception_1.BadRequestException("Пользователь с идентификатором " + data.ID + " не был найден.");
        }
        await user_1.UserData.deleteUserByID(userByID.ID);
        return "Пользователь с идентификатором " + data.ID + " был успешно удален.";
    }
    static async passwordRecovery(data) {
        const user = await user_1.UserData.getUserByEmail(data.email);
        if (!user) {
            throw new exception_1.BadRequestException("Неверные учетные данные");
        }
        const codeForRecovery = token_1.Token.generateToken(8);
        const mailOptions = {
            from: "kandoanimeg@gmail.com",
            to: user.email,
            subject: "Password Reset",
            text: `Sup bro.Code for reset your password: ${codeForRecovery}`,
        };
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                user: "kandoanimeg@gmail.com",
                pass: "vsqv cqwn yrrq irbu",
            },
        });
        transporter.sendMail(mailOptions);
        return {
            codeForRecovery: codeForRecovery,
            user: user.email,
        };
    }
    static async resetPassword(data) {
        const user = await user_1.UserData.getUserByEmail(data.email);
        if (!user) {
            throw new exception_1.BadRequestException("Неверные учетные данные");
        }
        if (data.recoveryCode == data.savedRecevoryCode) {
            const hashPassword = this.hashPassword(data.password);
            user.password = hashPassword;
            await user.save();
        }
        else {
            throw new exception_1.BadRequestException("Неверный код");
        }
        return "Password updated successfully";
    }
    static comparePasswords(hashPassword, password) {
        return (0, bcryptjs_1.compareSync)(password, hashPassword);
    }
    static hashPassword(password) {
        const salt = (0, bcryptjs_1.genSaltSync)(10);
        return (0, bcryptjs_1.hashSync)(password, salt);
    }
}
exports.Auth = Auth;
//# sourceMappingURL=index.js.map