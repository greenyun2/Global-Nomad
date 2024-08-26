import { getUserMeServer } from "@app/apiServer/getUserMeServer";
import axios, { AxiosError } from "axios";
import { error } from "console";
import instance from "./axios";

interface ActivityId {
  activityId: number;
}

interface ScheduleParams extends ActivityId {
  year: string;
  month: string;
}

interface ApplicationReservation extends ActivityId {
  scheduleId: number;
  headCount: number;
}

export const getActivityDetailList = async ({ activityId }: ActivityId) => {
  try {
    const response = await instance.get(`/activities/${activityId}`);
    if (response.status !== 200) {
      throw new Error(
        `스케쥴 응답 상태 코드: ${response.status}, message:${response.data?.message}`,
      );
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// export const getActivityDetailReviews = async ({ activityId }: ActivityId) => {
//   try {
//     const response = await instance.get(`/activities/${activityId}/reviews`);
//     if (response.status !== 200) {
//       throw new Error(
//         `스케쥴 응답 상태 코드: ${response.status}, message:${response.data?.message}`,
//       );
//     }
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

export const getActivityDetailSchedule = async ({
  activityId,
  year,
  month,
}: ScheduleParams) => {
  try {
    const response = await instance.get(
      `/activities/${activityId}/available-schedule?year=${year}&month=${month}`,
    );
    if (response.status !== 200) {
      throw new Error(
        `스케쥴 응답 상태 코드: ${response.status}, message:${response.data?.message}`,
      );
    }
    const { data } = response;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const postApplicationReservation = async ({
  activityId,
  scheduleId,
  headCount,
}: ApplicationReservation) => {
  try {
    const response = await instance.post(
      `/activities/${activityId}/reservations`,
      { scheduleId, headCount },
    );
    console.log(response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data.message;
    }
  }
};

export const deleteMyActivityPage = async ({ activityId }: ActivityId) => {
  try {
    await instance.delete(`/my-activities/${activityId}`);
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data.message;
    }
  }
};
