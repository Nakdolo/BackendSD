"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = exports.UserModel = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
const COLLECTION_NAME = "UserData";
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "student";
    UserRole["TEACHER"] = "teacher";
})(UserRole || (exports.UserRole = UserRole = {}));
const UserSchema = new mongoose_1.Schema({
    ID: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surName: { type: String, required: true },
    phone: { type: String, required: true },
    userRole: { type: String, enum: Object.values(UserRole), required: true },
    clases: [{ type: String }],
}, {
    collection: COLLECTION_NAME,
});
exports.UserModel = (0, mongoose_1.model)(COLLECTION_NAME, UserSchema);
class UserData {
    static async getUserById(userId) {
        try {
            const user = await exports.UserModel.findById(userId);
            return user;
        }
        catch (error) {
            console.error("Error fetching user by ID:", error);
            return null;
        }
    }
    static async getUserByEmail(email) {
        try {
            const user = await exports.UserModel.findOne({ email: email });
            return user;
        }
        catch (error) {
            console.error("Error fetching user by email:", error);
            return null;
        }
    }
    static async deleteUserByID(id) {
        const deletionResult = await exports.UserModel.deleteOne({ ID: id });
    }
    static async getUserByName(firstName, lastName) {
        try {
            const users = await exports.UserModel.find({ name: firstName, surName: lastName });
            if (users.length === 0) {
                return null;
            }
            const user = users[0];
            if (!user.ID || !user.email || !user.name || !user.surName || !user.phone) {
                throw new Error("Incomplete user data");
            }
            return user;
        }
        catch (error) {
            console.error("Error fetching user by name and surname:", error);
            return null;
        }
    }
    static async getUserByIDD(ID) {
        try {
            const user = await exports.UserModel.findOne({ ID: ID });
            return user;
        }
        catch (error) {
            console.error("Error fetching user by email:", error);
            return null;
        }
    }
}
exports.UserData = UserData;
//# sourceMappingURL=user.js.map