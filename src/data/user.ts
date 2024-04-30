import { Document, Schema, model, Model } from "mongoose";

const COLLECTION_NAME = "UserData";

export enum UserRole {
  ADMIN = "admin",
  USER = "student",
  TEACHER = "teacher",
}

export interface IUser extends Document {
  ID: string;
  email: string;
  password: string;
  name: string;
  surName: string;
  phone: string;
  userRole: UserRole;
  clases: string[];
}

const UserSchema = new Schema<IUser>(
  {
    ID: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surName: { type: String, required: true },
    phone: { type: String, required: true },
    userRole: { type: String, enum: Object.values(UserRole), required: true },
    clases: [{ type: String }],
  },
  {
    collection: COLLECTION_NAME,
  }
);

export const UserModel: Model<IUser> = model<IUser>(
  COLLECTION_NAME,
  UserSchema
);

export class UserData {
  public static async getUserById(
    userId: string | number
  ): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }

  public static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ email: email });
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return null;
    }
  }

  public static async deleteUserByID(id: string): Promise<void> {
    const deletionResult = await UserModel.deleteOne({ ID: id });
  }

  public static async getUserByName(
    firstName: string,
    lastName: string
): Promise<IUser | null> {
    try {
        const users = await UserModel.find({ name: firstName, surName: lastName });

        if (users.length === 0) {
            return null; 
        }
        const user = users[0]; 
        if (!user.ID || !user.email || !user.name || !user.surName || !user.phone) {
            throw new Error("Incomplete user data");
        }

        return user as IUser;
    } catch (error) {
        console.error("Error fetching user by name and surname:", error);
        return null;
    }
}

  public static async getUserByIDD(ID: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ ID: ID });
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return null;
    }
  }
}
