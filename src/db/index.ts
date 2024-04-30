import mongoose from "mongoose";
import { Config } from "../domains/config";

export class Database {
  public static async initMainDatabaseClient(): Promise<void> {
    try {
      await mongoose.connect(Config.mainDatabaseConnectionUrl);
      console.log("Connected to the MongoDB");
      console.log("-----------------------------------------------");
    } catch (error) {
      console.error("DB connection error:", error);
      throw error;
    }
  }
}
