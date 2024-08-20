import instance from "./axios";

interface ActivityId {
  activityId: number;
}

interface ScheduleParams extends ActivityId {
  year: string;
  month: string;
}

export const getActivityDetailList = async ({ activityId }: ActivityId) => {
  try {
    const response = await instance.get(`/activities/${activityId}`);
    if (response.status !== 200) {
      throw new Error(`상세페이지 응답 상태 코드: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getActivityDetailReviews = async ({ activityId }: ActivityId) => {
  try {
    const response = await instance.get(`/activities/${activityId}/reviews`);
    if (response.status !== 200) {
      throw new Error(`리뷰 응답 상태 코드: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

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
      throw new Error(`스케쥴 응답 상태 코드: ${response.status}`);
    }
    const { data } = response;
    return data;
  } catch (error) {
    console.error(error);
  }
};
