"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassData = exports.ClassModel = void 0;
const mongoose_1 = require("mongoose");
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek["Monday"] = "Monday";
    DayOfWeek["Tuesday"] = "Tuesday";
    DayOfWeek["Wednesday"] = "Wednesday";
    DayOfWeek["Thursday"] = "Thursday";
    DayOfWeek["Friday"] = "Friday";
    DayOfWeek["Saturday"] = "Saturday";
    DayOfWeek["Sunday"] = "Sunday";
})(DayOfWeek || (DayOfWeek = {}));
var TypeOfClass;
(function (TypeOfClass) {
    TypeOfClass["Lecture"] = "Lecture";
    TypeOfClass["Practice"] = "Practice";
})(TypeOfClass || (TypeOfClass = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["Attended"] = "Attended";
    AttendanceStatus["Absent"] = "Absent";
    AttendanceStatus["Manual"] = "Manual";
    AttendanceStatus["Permitted"] = "Permitted";
})(AttendanceStatus || (AttendanceStatus = {}));
const ClassSchema = new mongoose_1.Schema({
    className: { type: String, required: true },
    teacher: { type: String },
    students: [{ type: String }],
    courseName: { type: String },
    schedule: {
        dayOfWeekLecture: {
            type: String,
            enum: Object.values(DayOfWeek),
            required: true,
        },
        officeLecture: String,
        startTimeLecture: String,
        endTimeLecture: String,
        lectureHours: Number,
        dayOfWeekPractice: {
            type: String,
            enum: Object.values(DayOfWeek),
            required: true,
        },
        startTimePractice: String,
        endTimePractice: String,
        practiceHours: Number,
        officePractice: String,
    },
    ects: Number,
    attendance: [
        {
            studentId: { type: String },
            attended: {
                type: String,
                enum: Object.values(AttendanceStatus),
                required: true,
            },
            typeOfClass: {
                type: String,
                enum: Object.values(TypeOfClass),
                required: true,
            },
            week: Number,
            date: Date,
        },
    ],
}, { timestamps: true });
exports.ClassModel = (0, mongoose_1.model)("Class", ClassSchema);
class ClassData {
    static async getClassById(classId) {
        try {
            const cls = await exports.ClassModel.findById(classId);
            return cls;
        }
        catch (error) {
            console.error("Error fetching class by ID:", error);
            return null;
        }
    }
    static async getClassByName(className) {
        try {
            const cls = await exports.ClassModel.findOne({ className });
            return cls;
        }
        catch (error) {
            console.error("Error fetching class by name:", error);
            return null;
        }
    }
}
exports.ClassData = ClassData;
//# sourceMappingURL=class.js.map