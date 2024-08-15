import instance from "@api/axios";
import { CreateScheduleBody } from "./activities";

export const deleteMyActivity = async (activityId: number): Promise<void> => {
  try {
    const response = await instance.delete(`/my-activities/${activityId}`);
  } catch (error) {
    throw error;
  }
};

export interface UpdateActivityBody {
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  schedules?: CreateScheduleBody[] | null;
  subImageUrls?: string[] | null;
}

export const updateMyActivity = async (
  activityId: number,
  updateData: UpdateActivityBody,
): Promise<void> => {
  try {
    const { data } = await instance.patch(
      `/my-activities/${activityId}`,
      updateData,
    );
    console.log("Activity updated successfully:", data);
  } catch (error) {
    console.error("Error updating activity:", error);
    throw error;
  }
};

export interface MyActivity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MyActivitiesResponse {
  cursorId: number;
  totalCount: number;
  activities: MyActivity[];
}

export const getMyActivities = async (): Promise<MyActivitiesResponse> => {
  try {
    const { data } = await instance.get<MyActivitiesResponse>("/my-activities");
    console.log("Fetched activities data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
};
