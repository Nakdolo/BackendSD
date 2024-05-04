import { Request, Response, Router } from "express";
import { Auth } from "../../domains/auth";
import { AuthMiddleware } from "../../domains/middleweres/auth";

export class AuthController {
  public router: Router;

  constructor() {
    this.router = Router();

    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post("/auth/login", AuthMiddleware.verifyLoginData, this.login);
    this.router.post(
      "/auth/signup",
      AuthMiddleware.verifySignupData,
      this.registration
    );
    this.router.post(
      "/auth/password_recovery",
      this.passwordRecovery
    );
    this.router.post("/auth/reset_password", this.resetPassword);
    this.router.get("/", this.test);
    this.router.post("/add", AuthMiddleware.verifySignupData,
    this.addUser)
    this.router.post("/delete", this.deleteUser),
    this.router.post("/find", this.findUser)
  }

  public async login(req: Request, res: Response): Promise<void> {
    const result = await Auth.login(req.body);
    res.status(200).send(result);
  }

  public async findUser(req: Request, res: Response): Promise<void> {
    const result = await Auth.findUser(req.body);
    res.status(200).send(result);
  }

  public async test(req: Request, res: Response): Promise<void> {
    res.status(200);
  }

  public async registration(req: Request, res: Response): Promise<void> {
    const result = await Auth.signup(req.body);
    res.status(200).send(result);
  }

  public async addUser(req: Request, res: Response): Promise<void> {
    const result = await Auth.addUser(req.body);
    res.status(200).send(result);
  }

  public async deleteUser(req: Request, res: Response) : Promise<void> {
    const result = await Auth.deleteUser(req.body);
    res.status(200).send(result);
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    const result = await Auth.resetPassword(req.body);
    res.status(200).send(result);
  }

  public async passwordRecovery(req: Request, res: Response): Promise<void> {
    const result = await Auth.passwordRecovery(req.body);
    res.status(200).send(result);
  }
}
