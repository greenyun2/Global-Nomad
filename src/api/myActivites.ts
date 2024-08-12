import instance from "@api/axios";

export const deleteMyActivity = async (activityId: number): Promise<void> => {
  try {
    const response = await instance.delete(`/my-activities/${activityId}`);
  } catch (error) {
    throw error;
  }
};
