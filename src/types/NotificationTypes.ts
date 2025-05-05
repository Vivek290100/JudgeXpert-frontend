export interface Notification {
    _id: string;
    message: string;
    slug: string;
    createdAt: string;
    isRead: boolean;
  }
  
  export interface NotificationApiResponse {
    success: boolean;
    message: string;
    data: Notification[];
  }