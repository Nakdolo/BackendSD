import { Request, Response, Router } from "express";
import { Notification } from "../../domains/notification";

export class NotificationController {
  public router: Router;

  constructor() {
    this.router = Router();

    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post("/notification/sent",this.sendNotification);
    this.router.post("/notification/get",this.getNotifications);
    this.router.post("/notification/sentToAll",this.notifyAll);
    this.router.post("/notification/markTheMessage",this.marked);
  }

  public async sendNotification(req: Request, res: Response): Promise<void> {
    const result = await Notification.sendNotification(req.body);
    res.status(200).send(result);
  }

  public async getNotifications(req: Request, res: Response): Promise<void> {
    const result = await Notification.getNotifications(req.body);
    res.status(200).send(result);
  }

  public async notifyAll(req: Request, res: Response) : Promise<void> {
    const result = await Notification.sentNotificationsAll(req.body) 
    res.status(200).send(result)
  }

  public async marked(req: Request, res: Response) : Promise<void> {
    const result = await Notification.markTheMessage(req.body)
    res.status(200).send(result)
  }
  
}
