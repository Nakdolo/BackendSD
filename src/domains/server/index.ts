import "express-async-errors";

import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import { Controller } from "../../controllers";
import { httpErrors } from "../../controllers/error";
import { requestLogs } from "../../controllers/logs";
import { NotFoundException } from "../exception";

export class ServerApp {
  public app: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.app.use(requestLogs);
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.app.use("*", () => {
      throw new NotFoundException();
    });
    this.app.use(httpErrors);
  }

  private initializeMiddlewares(): void {
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(this.customCors);
    this.app.use(express.json());
  }

  private customCors(_req: Request, res: Response, next: NextFunction): void {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PATCH, DELETE"
    );
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    next();
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use("/api", controller.router);
    });
  }

  public init(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port} | ${new Date()}`);
      console.log(`-----------------------------------------------`);
    });
  }
}
