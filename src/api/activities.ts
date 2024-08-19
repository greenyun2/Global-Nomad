import instance from "@api/axios";

export interface CreateActivityBody {
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  schedules?: CreateScheduleBody[];
  bannerImageUrl: string;
  subImageUrls?: string[];
}

export interface CreateScheduleBody {
  date: string;
  startTime: string;
  endTime: string;
}

export const createActivity = async (
  activityData: CreateActivityBody,
): Promise<void> => {
  try {
    await instance.post("/activities", activityData);
    console.log("Activity created successfully");
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
};

export interface UploadImageResponse {
  activityImageUrl: string;
}

export const uploadActivityImage = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await instance.post<UploadImageResponse>(
      "/activities/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.activityImageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export interface SubImage {
  id: number;
  imageUrl: string;
}

export interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Activity {
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
  subImages: SubImage[];
  schedules: Schedule[];
}

export const getActivityById = async (
  activityId: number,
): Promise<Activity> => {
  try {
    const { data } = await instance.get<Activity>(`/activities/${activityId}`);
    console.log("Fetched activity data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching activity:", error);
    throw error;
  }
};
