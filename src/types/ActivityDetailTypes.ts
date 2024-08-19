export interface ReviewsItem {
  id?: number;
  user: ReviewUser;
  activityId?: number;
  content: string;
  rating?: number;
  createdAt?: string;
  updatedAt: string;
}

interface ReviewUser {
  id: number;
  nickname: string;
  profileImageUrl: string;
}
