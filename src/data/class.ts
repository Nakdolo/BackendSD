import { Document, Schema, model, Model } from "mongoose";

enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

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

export interface IClass extends Document {
  className: string;
  courseName: string;
  teacher: string;
  students: string[];
  schedule: {
    dayOfWeekLecture: DayOfWeek;
    startTimeLecture: string;
    endTimeLecture: string;
    lectureHours: number;
    officeLecture: string;

    dayOfWeekPractice: DayOfWeek;
    startTimePractice: string;
    endTimePractice: string;
    practiceHours: number;
    officePractice: string;
  };
  ects: number;
  attendance: {
    
    studentId: string;
    attended: AttendanceStatus;
    typeOfClass: TypeOfClass;
    date: Date;
    week: number;
  }[];
}

const ClassSchema = new Schema<IClass>(
  {
    className: { type: String, required: true },
    teacher: { type: String },
    students: [{ type: String }],
    courseName: {type: String},
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
  },
  { timestamps: true }
);

export const ClassModel: Model<IClass> = model("Class", ClassSchema);

export class ClassData {
  public static async getClassById(
    classId: string | number
  ): Promise<IClass | null> {
    try {
      const cls = await ClassModel.findById(classId);
      return cls;
    } catch (error) {
      console.error("Error fetching class by ID:", error);
      return null;
    }
  }

  public static async getClassByName(
    className: string
  ): Promise<IClass | null> {
    try {
      const cls = await ClassModel.findOne({ className });
      return cls;
    } catch (error) {
      console.error("Error fetching class by name:", error);
      return null;
    }
  }
}
