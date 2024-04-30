import { Request, Response, Router } from "express";
import { Auth } from "../../domains/auth";
import { AuthMiddleware } from "../../domains/middleweres/auth";

export class AttendanceController {
  public router: Router;

  constructor() {
    this.router = Router();

    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post("/attendance");

  }

  public async attendance(req: Request, res: Response): Promise<void> {
    const result = await Auth.login(req.body);
    res.status(200).send(result);
  }

  
}
