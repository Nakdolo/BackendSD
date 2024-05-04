"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const exception_1 = require("../exception");
const class_1 = require("../../data/class");
const user_1 = require("../../data/user");
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
var SessionType;
(function (SessionType) {
    SessionType["Lecture"] = "Lecture";
    SessionType["Practice"] = "Practice";
})(SessionType || (SessionType = {}));
function getSessionDay(classData, type) {
    return type === SessionType.Lecture
        ? classData.schedule.dayOfWeekLecture
        : classData.schedule.dayOfWeekPractice;
}
function getSessionStartTime(classData, type) {
    return type === SessionType.Lecture
        ? classData.schedule.startTimeLecture
        : classData.schedule.startTimePractice;
}
function getSessionEndTime(classData, type) {
    return type === SessionType.Lecture
        ? classData.schedule.endTimeLecture
        : classData.schedule.endTimePractice;
}
function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}
class Class {
    static async getClass(data) {
        const cls = await class_1.ClassData.getClassByName(data.className);
        if (!cls) {
            throw new exception_1.BadRequestException("Class doesn't exist");
        }
        return cls;
    }
    static hasTimeConflictForCreate(newSchedule, existingSchedule) {
        function timeToMinutes(time) {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        }
        function isOverlapping(newDay, newStart, newEnd, existingDay, existingStart, existingEnd) {
            if (newDay !== existingDay) {
                return false;
            }
            const startNew = timeToMinutes(newStart);
            const endNew = timeToMinutes(newEnd);
            const startExisting = timeToMinutes(existingStart);
            const endExisting = timeToMinutes(existingEnd);
            return !(endNew <= startExisting || startNew >= endExisting);
        }
        if (isOverlapping(newSchedule.dayOfWeekLecture, newSchedule.startTimeLecture, newSchedule.endTimeLecture, existingSchedule.dayOfWeekLecture, existingSchedule.startTimeLecture, existingSchedule.endTimeLecture)) {
            return true;
        }
        if (isOverlapping(newSchedule.dayOfWeekPractice, newSchedule.startTimePractice, newSchedule.endTimePractice, existingSchedule.dayOfWeekPractice, existingSchedule.startTimePractice, existingSchedule.endTimePractice)) {
            return true;
        }
        return false;
    }
    static async createClass(data) {
        const existingClass = await class_1.ClassData.getClassByName(data.className);
        if (existingClass) {
            throw new exception_1.BadRequestException("Class with this name already exists");
        }
        const teacher = await user_1.UserData.getUserByIDD(data.ID);
        if (!teacher) {
            throw new exception_1.BadRequestException("Teacher doesn't exist");
        }
        const teacherClasses = await class_1.ClassModel.find({
            teacher: teacher.name,
        }).exec();
        for (const existingClass of teacherClasses) {
            if (this.hasTimeConflictForCreate(data.schedule, existingClass.schedule)) {
                throw new exception_1.BadRequestException("Scheduling conflict with another class");
            }
        }
        teacher.clases.push(data.className);
        await teacher.save();
        const newClass = new class_1.ClassModel({
            className: data.className,
            teacher: teacher.name,
            schedule: data.schedule,
            courseName: data.courseName,
            ects: data.ects,
        });
        await newClass.save();
        return { message: "Class successfully created" };
    }
    static async registerToClass(data) {
        // Fetch class and user documents
        const cls = await class_1.ClassData.getClassByName(data.className);
        const user = await user_1.UserData.getUserByIDD(data.studentId);
        if (!user) {
            throw new exception_1.BadRequestException("User not found");
        }
        if (!cls) {
            throw new exception_1.BadRequestException("Class not found");
        }
        if (cls.students.includes(data.studentId)) {
            throw new exception_1.BadRequestException("Student already registered");
        }
        for (const className of user.clases) {
            const existingClass = await class_1.ClassData.getClassByName(className);
            if (existingClass && this.hasTimeConflict(cls, existingClass)) {
                throw new exception_1.BadRequestException("Scheduling conflict with another class");
            }
        }
        user.clases.push(data.className);
        cls.students.push(data.studentId);
        await cls.save();
        await user.save();
        return { message: "Student successfully registered to class" };
    }
    static hasTimeConflict(newClass, existingClass) {
        return [SessionType.Lecture, SessionType.Practice].some((sessionType) => {
            const dayNew = getSessionDay(newClass, sessionType);
            const startNew = timeToMinutes(getSessionStartTime(newClass, sessionType));
            const endNew = timeToMinutes(getSessionEndTime(newClass, sessionType));
            const dayExisting = getSessionDay(existingClass, sessionType);
            const startExisting = timeToMinutes(getSessionStartTime(existingClass, sessionType));
            const endExisting = timeToMinutes(getSessionEndTime(existingClass, sessionType));
            return (dayNew === dayExisting &&
                !(endNew <= startExisting || startNew >= endExisting));
        });
    }
    static async listClasses() {
        try {
            const classes = await class_1.ClassModel.find();
            return classes;
        }
        catch (error) {
            console.error("Error fetching classes:", error);
            return [];
        }
    }
    static async attend(data) {
        const cls = await class_1.ClassData.getClassByName(data.className);
        if (!cls) {
            throw new exception_1.BadRequestException("Class not found");
        }
        const studentIndex = cls.students.findIndex((student) => student.toString() === data.studentId);
        if (studentIndex === -1) {
            throw new exception_1.BadRequestException(`Student with ID ${data.studentId} not found in class ${data.className}`);
        }
        const attendanceRecord = {
            week: data.week,
            studentId: data.studentId,
            date: new Date(),
            attended: data.attended,
            typeOfClass: data.typeOfClass,
        };
        cls.attendance.push(attendanceRecord);
        await cls.save();
    }
    static async myList(data) {
        const user = await user_1.UserData.getUserByIDD(data.ID);
        if (!user) {
            throw new exception_1.BadRequestException("User doesn't exist");
        }
        const classes = await class_1.ClassModel.find({ className: user.clases });
        return classes;
    }
    static async studentsForAttendance(data) {
        const cls = await class_1.ClassData.getClassByName(data.className);
        if (!cls) {
            throw new exception_1.BadRequestException("Class not found");
        }
        return cls.students;
    }
    static async calculateOverallAttendance(data) {
        const user = await user_1.UserData.getUserByIDD(data.studentId);
        if (!user) {
            throw new exception_1.BadRequestException("User not found");
        }
        const userClasses = user.clases;
        const overallAttendance = {};
        for (const className of userClasses) {
            const cls = await class_1.ClassData.getClassByName(className);
            const weeksInSemester = 15;
            if (!cls) {
                throw new exception_1.BadRequestException(`Class ${className} not found`);
            }
            const totalHoursInSemester = cls.schedule.lectureHours + cls.schedule.practiceHours;
            const attendanceRecords = cls.attendance.filter((record) => record.studentId === data.studentId);
            const attendedLessons = attendanceRecords.filter((record) => record.attended === AttendanceStatus.Attended).length;
            const absentLessons = attendanceRecords.filter((record) => record.attended === AttendanceStatus.Absent).length;
            const permittedLessons = attendanceRecords.filter((record) => record.attended === AttendanceStatus.Permitted).length;
            const manualLessons = attendanceRecords.filter((record) => record.attended === AttendanceStatus.Manual).length;
            const overallAttendancePercentage = totalHoursInSemester === 0
                ? "0"
                : ((totalHoursInSemester / weeksInSemester) * absentLessons).toFixed(2);
            const absentPresentage = parseFloat(overallAttendancePercentage);
            const message = `overall : ${absentPresentage}%, attended lessons: ${attendedLessons}, absent lessons: ${absentLessons}, permitted lessons: ${permittedLessons}, manual lessons: ${manualLessons}, total hours: ${cls.schedule.lectureHours + cls.schedule.lectureHours}, courseName: ${cls.courseName}`;
            overallAttendance[cls.className] = message;
        }
        return overallAttendance;
    }
    static async procentageForUser(data) {
        const user = await user_1.UserData.getUserByIDD(data.studentId);
        if (!user) {
            throw new exception_1.BadRequestException("User not found");
        }
        const cls = await class_1.ClassData.getClassByName(data.className);
        const weeksInSemester = 15;
        if (!cls) {
            throw new exception_1.BadRequestException(`Class ${cls} not found`);
        }
        const totalHoursInSemester = cls.schedule.lectureHours + cls.schedule.practiceHours;
        const attendanceRecords = cls.attendance.filter((record) => record.studentId === data.studentId);
        const attendedLessons = attendanceRecords.filter((record) => record.attended === AttendanceStatus.Attended).length;
        const absentLessons = attendanceRecords.filter((record) => record.attended === AttendanceStatus.Absent).length;
        const permittedLessons = attendanceRecords.filter((record) => record.attended === AttendanceStatus.Permitted).length;
        const manualLessons = attendanceRecords.filter((record) => record.attended === AttendanceStatus.Manual).length;
        const overallAttendancePercentage = totalHoursInSemester === 0
            ? "0"
            : ((totalHoursInSemester / weeksInSemester) * absentLessons).toFixed(2);
        const absentPresentage = parseFloat(overallAttendancePercentage);
        return {
            Procentage: absentPresentage,
            attendedLessons: attendedLessons,
            absentLessons: absentLessons,
            premittedLessons: permittedLessons,
            manualLessons: manualLessons,
            courseName: cls.courseName,
            totalHours: cls.schedule.lectureHours + cls.schedule.lectureHours,
            studentName: user.name,
            studentSurname: user.surName,
        };
    }
    static async attendanceForUser(data) {
        const user = await user_1.UserData.getUserByIDD(data.studentId);
        const cls = await class_1.ClassData.getClassByName(data.className);
        if (!cls || !user) {
            throw new exception_1.BadRequestException("Class or user doesn't exist");
        }
        const userAttendances = cls.attendance.filter((attendance) => attendance.studentId === data.studentId);
        return { attendance: userAttendances };
    }
}
exports.Class = Class;
//# sourceMappingURL=index.js.map