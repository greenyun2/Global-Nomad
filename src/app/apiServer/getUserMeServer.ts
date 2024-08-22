import { UserMe } from "@api/user";
import axiosServer from "@app/apiServer/axiosServer";

export const getUserMeServer = async (): Promise<UserMe> => {
  const response = await axiosServer.get("/users/me");
  return response.data;
};
