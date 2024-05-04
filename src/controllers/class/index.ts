import { Request, Response, Router } from "express";
import { Class } from "../../domains/class";

export class ClassController {
  public router: Router;

  constructor() {
    this.router = Router();

    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post("/class/create", this.create);
    this.router.post("/class/register", this.register);
    this.router.post("/class/list", this.list);
    this.router.post("/class/students", this.students);
    this.router.post("/class/attend", this.attend);
    this.router.post("/class/procentage", this.procentage);
    this.router.post("/class/procentageForUser", this.procentageForUser);
    this.router.post("/class/myList", this.myList);
    this.router.post("/class/getClass", this.getClass);
    this.router.post("/class/attendanceForUser", this.attendanceUser);
  }

  public async attendanceUser(req: Request, res: Response) : Promise<void> {
    const result = await Class.attendanceForUser(req.body);
    res.status(200).send(result)
  }

  public async procentageForUser(req: Request, res: Response): Promise<void> {
    const result = await Class.procentageForUser(req.body);
    res.status(200).send(result);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const result = await Class.createClass(req.body);
    res.status(200).send(result);
  }

  public async myList(req: Request, res: Response): Promise<void> {
    const result = await Class.myList(req.body);
    res.status(200).send(result);
  }

  public async register(req: Request, res: Response): Promise<void> {
    const result = await Class.registerToClass(req.body);
    res.status(200).send(result);
  }

  public async list(req: Request, res: Response): Promise<void> {
    const result = await Class.listClasses();
    res.status(200).send(result);
  }

  public async students(req: Request, res: Response): Promise<void> {
    const result = await Class.studentsForAttendance(req.body);
    res.status(200).send(result);
  }

  public async attend(req: Request, res: Response): Promise<void> {
    const result = await Class.attend(req.body);
    res.status(200).send(result);
  }

  public async procentage(req: Request, res: Response): Promise<void> {
    const result = await Class.calculateOverallAttendance(req.body);
    res.status(200).send(result);
  }

  public async getClass(req: Request, res: Response): Promise<void> {
    const result = await Class.getClass(req.body);
    res.status(200).send(result);
  }
}
