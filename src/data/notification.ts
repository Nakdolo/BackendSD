import { Document, Schema, model, Model } from "mongoose";
import { GetNotificationsType } from "../domains/notification";

const COLLECTION_NAME = "NotificationData";

export interface INotification extends Document {
  title: string;
  message: string;
  from: string;
  to: string;
  data: Date;
  marked: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    data: { type: Date },
    marked: { type: Boolean },
  },
  {
    collection: COLLECTION_NAME,
  }
);

export const NotificationModel: Model<INotification> = model<INotification>(
  COLLECTION_NAME,
  NotificationSchema
);

export class NotificationData {
  public static async addNotification(
    notificationData: Partial<INotification>
  ): Promise<string> {
    try {
      notificationData.data = new Date();

      await NotificationModel.create(notificationData);
      return "Успешно отправлено";
    } catch (error) {
      console.error("Error adding notification:", error);
      throw new Error("Failed to add notification");
    }
  }

  public static async updateNotification(
    id: string,
    notificationData: Partial<INotification>
  ): Promise<INotification | null> {
    try {
      const updatedNotification = await NotificationModel.findByIdAndUpdate(
        id,
        notificationData,
        { new: true }
      );
      return updatedNotification ? updatedNotification.toObject() : null;
    } catch (error) {
      console.error("Error updating notification:", error);
      throw new Error("Failed to update notification");
    }
  }

  public static async getNotifications(
    data: GetNotificationsType
  ): Promise<INotification[]> {
    try {
      const notifications = await NotificationModel.find({ to: data.to });
      return notifications;
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw new Error("Failed to get notifications");
    }
  }
}
