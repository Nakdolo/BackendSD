import { NotificationDto } from "../../controllers/notification/dto/notification.dto";
import { ClassData } from "../../data/class";
import {
  INotification,
  NotificationData,
  NotificationModel,
} from "../../data/notification";
import { UserData } from "../../data/user";
import { BadRequestException } from "../exception";

export type GetNotificationsType = {
  to: string;
};

export type sentNotificationsToAllType = {
  title: string;
  message: string;
  from: string;
  toClassName: string;
  marked: boolean;
};

export class Notification {
  public static async sendNotification(data: NotificationDto): Promise<string> {
    try {
      const user = await UserData.getUserByIDD(data.to);
      if (!user) {
        throw new BadRequestException("User with this ID doesn't exist");
      } else {
        const notify = await NotificationData.addNotification(data);
        if (!notify) {
          throw new BadRequestException("Wrong data");
        }
        return "Notification sent successfully";
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      throw new Error("Failed to send notification");
    }
  }

  public static async getNotifications(
    data: GetNotificationsType
  ): Promise<INotification[]> {
    try {
      const notifications = await NotificationData.getNotifications(data);
      if (!notifications) {
        throw new BadRequestException("Wrong data");
      }

      return notifications;
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw new Error("Failed to get notifications");
    }
  }

  public static async sentNotificationsAll(
    data: sentNotificationsToAllType
  ): Promise<string> {
    try {
      const classToNotify = await ClassData.getClassByName(data.toClassName);

      if (!classToNotify) {
        throw new BadRequestException("Wrong data");
      }

      const students = classToNotify.students;

      for (const studentId of students) {
        const notificationData: NotificationDto = {
          title: data.title,
          message: data.message,
          from: data.from,
          to: studentId,
          marked: false,
        };
        await Notification.sendNotification(notificationData);
      }

      return "Notifications sent successfully to all students in the class";
    } catch (error) {
      console.error("Error sending notifications to all:", error);
      throw new Error("Failed to send notifications to all");
    }
  }

  public static async markTheMessage(
    objectId: string 
): Promise<string> {
    const findMessage = await NotificationModel.findOneAndUpdate(
        { _id: objectId }, // Query to find the document by _id
        { marked: true }, // Update operation to set marked to true
        { new: true } // Option to return the updated document
    );

    if (!findMessage) {
        return "Message doesn't exist";
    }

    return "Message marked successfully";
}

}
