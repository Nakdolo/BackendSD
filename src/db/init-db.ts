import { Database } from "./index";

export const initDatabase = async (): Promise<void> => {
  console.log(`-----------------------------------------------`);
  console.log(`init database | ${new Date()}`);
  console.log(`-----------------------------------------------`);

  await Database.initMainDatabaseClient();
};
