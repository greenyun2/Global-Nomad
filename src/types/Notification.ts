interface Notifications {
  id: number;
  teamId: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface NotificationData {
  totalCount: number;
  notifications: Notifications[];
  cursorId: number;
}
