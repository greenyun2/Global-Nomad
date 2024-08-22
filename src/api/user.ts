import instance from "@api/axios";
import { TUpdateMyInfoSchema } from "@customTypes/Me";

export interface UserMe {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserMe = async (): Promise<UserMe> => {
  const { data } = await instance.get("/users/me");
  console.log("Fetched user profile data:", data);
  return data;
};
const defaultProfileImageUrl =
  "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/6-12_690_1724296976407.jpeg";

export const updateMyInfo = async (formdata: TUpdateMyInfoSchema) => {
  const response = await instance.patch("/users/me", {
    nickname: formdata.nickname,
    profileImageUrl: formdata.profileImageUrl || defaultProfileImageUrl,
    newPassword: formdata.password,
  });
  return response.data;
};

export const uploadProfileImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await instance.post("/users/me/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};
