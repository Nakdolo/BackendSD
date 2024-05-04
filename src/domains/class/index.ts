import { BadRequestException } from "../exception";
import { ClassData, ClassModel, IClass } from "../../data/class";
import { UserData } from "../../data/user";

export type ClassCreateType = {
  ID: string;
  className: string;
  courseName: string;
  schedule: {
    dayOfWeekLecture: string;
    startTimeLecture: string;
    endTimeLecture: string;
    lectureHours: number;
    officeLecture: string;

    dayOfWeekPractice: string;
    startTimePractice: string;
    endTimePractice: string;
    practiceHours: number;
    officePractice: string;
  };
  ects: number;
};

enum TypeOfClass {
  Lecture = "Lecture",
  Practice = "Practice",
}

enum AttendanceStatus {
  Attended = "Attended",
  Absent = "Absent",
  Manual = "Manual",
  Permitted = "Permitted",
}

export type RegisterToClassType = {
  className: string;
  studentId: string;
};

export type ClassReturnType = {
  message: string;
};

export type StudentAttendanceType = {
  week: number;
  className: string;
  studentId: string;
  attended: AttendanceStatus;
  typeOfClass: TypeOfClass;
};

export type StudentsForAttendanceType = {
  className: string;
};

export type MyListType = {
  ID: string;
};

export type ProcentageType = {
  studentId: string;
};

export type ProcentageForUserType = {
  studentId: string;
  className: string;
};

export type ProcentageForUserReturnType = {
  Procentage : number;
  attendedLessons : number;
  absentLessons : number;
  premittedLessons : number;
  manualLessons : number;
  totalHours : number;
  courseName : string;
  studentName : string;
  studentSurname : string;
}

export class Class {
  public static async getClass(data: StudentAttendanceType): Promise<IClass> {
    const cls = await ClassData.getClassByName(data.className);

    if (!cls) {
      throw new BadRequestException("Class doesn't exist");
    }
    return cls;
  }
  public static async createClass(
    data: ClassCreateType
  ): Promise<ClassReturnType> {
    const existingClass = await ClassData.getClassByName(data.className);

    if (existingClass) {
      throw new BadRequestException("Class with this name already exists");
    }

    const teacher = await UserData.getUserByIDD(data.ID);

    if (!teacher) {
      throw new BadRequestException("Teacher doesn't exist");
    }

    teacher.clases.push(data.className);
    await teacher.save();

    const newClass = new ClassModel({
      className: data.className,
      teacher: teacher.name,
      schedule: data.schedule,
      courseName: data.courseName,
      ects: data.ects,
    });

    await newClass.save();

    return { message: "Class successfully created" };
  }

  public static async registerToClass(
    data: RegisterToClassType
  ): Promise<ClassReturnType> {
    const cls = await ClassData.getClassByName(data.className);
    const user = await UserData.getUserByIDD(data.studentId);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (!cls) {
      throw new BadRequestException("Class not found");
    }


    if (cls.students.includes(data.studentId)) {
      throw new BadRequestException("Student already registered");
    }

    user.clases.push(data.className);
    cls.students.push(data.studentId);

    await user.save();
    await cls.save();

    return { message: "Student successfully registered to class" };
  }

  public static async listClasses(): Promise<IClass[]> {
    try {
      const classes = await ClassModel.find();
      return classes;
    } catch (error) {
      console.error("Error fetching classes:", error);
      return [];
    }
  }

  public static async attend(data: StudentAttendanceType): Promise<void> {
    const cls = await ClassData.getClassByName(data.className);

    if (!cls) {
      throw new BadRequestException("Class not found");
    }

    const studentIndex = cls.students.findIndex(
      (student) => student.toString() === data.studentId
    );

    if (studentIndex === -1) {
      throw new BadRequestException(
        `Student with ID ${data.studentId} not found in class ${data.className}`
      );
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

  public static async myList(data: MyListType): Promise<IClass[]> {
    const user = await UserData.getUserByIDD(data.ID);

    if (!user) {
      throw new BadRequestException("User doesn't exist");
    }

    const classes = await ClassModel.find({ className: user.clases });
    return classes;
  }

  public static async studentsForAttendance(
    data: StudentsForAttendanceType
  ): Promise<string[]> {
    const cls = await ClassData.getClassByName(data.className);

    if (!cls) {
      throw new BadRequestException("Class not found");
    }

    return cls.students;
  }

  public static async calculateOverallAttendance(
    data: ProcentageType
  ): Promise<{ [className: string]: string }> {
    const user = await UserData.getUserByIDD(data.studentId);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    const userClasses = user.clases;
    const overallAttendance: { [className: string]: string } = {};

    for (const className of userClasses) {
      const cls = await ClassData.getClassByName(className);
      const weeksInSemester = 15;

      if (!cls) {
        throw new BadRequestException(`Class ${className} not found`);
      }
      const totalHoursInSemester =
        cls.schedule.lectureHours + cls.schedule.practiceHours;

      const attendanceRecords = cls.attendance.filter(
        (record) => record.studentId === data.studentId
      );

      const attendedLessons = attendanceRecords.filter(
        (record) => record.attended === AttendanceStatus.Attended
      ).length;

      const absentLessons = attendanceRecords.filter(
        (record) => record.attended === AttendanceStatus.Absent
      ).length;

      const permittedLessons = attendanceRecords.filter(
        (record) => record.attended === AttendanceStatus.Permitted
      ).length;

      const manualLessons = attendanceRecords.filter(
        (record) => record.attended === AttendanceStatus.Manual
      ).length;

      const overallAttendancePercentage =
        totalHoursInSemester === 0
          ? "0"
          : ((totalHoursInSemester / weeksInSemester) * absentLessons).toFixed(
              2
            );

      const absentPresentage = parseFloat(overallAttendancePercentage);

      const message = `overall : ${absentPresentage}%, attended lessons: ${attendedLessons}, absent lessons: ${absentLessons}, permitted lessons: ${permittedLessons}, manual lessons: ${manualLessons}, total hours: ${
        cls.schedule.lectureHours + cls.schedule.lectureHours
      }, courseName: ${cls.courseName}`;

      overallAttendance[cls.className] = message;
    }

    return overallAttendance;
  }

  public static async procentageForUser(
    data: ProcentageForUserType
  ): Promise<ProcentageForUserReturnType> {
    const user = await UserData.getUserByIDD(data.studentId);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    const cls = await ClassData.getClassByName(data.className);

    const weeksInSemester = 15;

    if (!cls) {
      throw new BadRequestException(`Class ${cls} not found`);
    }
    const totalHoursInSemester =
      cls.schedule.lectureHours + cls.schedule.practiceHours;

    const attendanceRecords = cls.attendance.filter(
      (record) => record.studentId === data.studentId
    );

    const attendedLessons = attendanceRecords.filter(
      (record) => record.attended === AttendanceStatus.Attended
    ).length;

    const absentLessons = attendanceRecords.filter(
      (record) => record.attended === AttendanceStatus.Absent
    ).length;

    const permittedLessons = attendanceRecords.filter(
      (record) => record.attended === AttendanceStatus.Permitted
    ).length;

    const manualLessons = attendanceRecords.filter(
      (record) => record.attended === AttendanceStatus.Manual
    ).length;

    const overallAttendancePercentage =
      totalHoursInSemester === 0
        ? "0"
        : ((totalHoursInSemester / weeksInSemester) * absentLessons).toFixed(2);

    const absentPresentage = parseFloat(overallAttendancePercentage);

    return {
      Procentage : absentPresentage,
      attendedLessons: attendedLessons,
      absentLessons: absentLessons,
      premittedLessons: permittedLessons,
      manualLessons : manualLessons,
      courseName: cls.courseName,
      totalHours : cls.schedule.lectureHours + cls.schedule.lectureHours,
      studentName : user.name,
      studentSurname : user.surName
    };
  }
}
