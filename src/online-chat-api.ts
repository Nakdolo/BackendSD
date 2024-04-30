import { AuthController } from "./controllers/auth";
import { ClassController } from "./controllers/class";
import { NotificationController } from "./controllers/notification";
import { initDatabase } from "./db/init-db";
import { Config } from "./domains/config";
import { ServerApp } from "./domains/server";

const app = new ServerApp(
  [new AuthController(), new NotificationController(), new ClassController()],
  Config.clientApiPort
);

const init = async (): Promise<void> => {
  app.init();
};

initDatabase().then(init);
