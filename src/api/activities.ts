import instance from "@api/axios";
import { MyActivityType } from "@customTypes/MyActivity-Status";

export interface CreateActivityBody {
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  schedules: CreateScheduleBody[];
  bannerImageUrl: string;
  subImageUrls: string[];
}

export interface CreateScheduleBody {
  date: string;
  startTime: string;
  endTime: string;
}

export const createActivity = async (
  activityData: CreateActivityBody,
): Promise<MyActivityType> => {
  // MyActivityType을 반환하도록 변경
  try {
    const { data } = await instance.post<MyActivityType>(
      "/activities",
      activityData,
    );
    console.log("Activity created successfully:", data);
    return data; // 생성된 활동 데이터를 반환
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
