import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

const basicAxiosInstance = axios.create({
  baseURL: "https://sp-globalnomad-api.vercel.app/6-12",
  withCredentials: false,
});

const axiosServer = axios.create({
  baseURL: "https://sp-globalnomad-api.vercel.app/6-12",
  withCredentials: false,
});

export default axiosServer;

axiosServer.interceptors.request.use(
  (config) => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    console.log(
      "🔥 axiosServer: current accessToken from browser cookie 👉",
      accessToken,
    );

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosServer.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const cookieStore = cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        // 코드 수정 내용
        // const accessToken = cookieStore.get("accessToken")?.value;

        // @ 기존 에러를 던져주는 조건이 !refreshToken 에서
        // accessToken있고 refreshToken이 없을때 오류가 발생하도록 수정했습니다.

        // if (accessToken && !refreshToken) {
        //   throw new Error("No refresh token available.");
        // }

        // @ 리프레쉬토큰을 갱신받는 과정에서 refreshToken이 있다면 새로운 토큰을 요청하게 수정했습니다.
        // let getRefreshToken;
        // if (refreshToken) {
        //   const response = await basicAxiosInstance.post(
        //     "https://sp-globalnomad-api.vercel.app/6-12/auth/tokens",
        //     "",
        //     {
        //       headers: {
        //         Authorization: `Bearer ${refreshToken}`,
        //       },
        //     },
        //   );

        //   const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        //     response.data;

        //   if (originalRequest.headers) {
        //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        //   }

        //   getRefreshToken = basicAxiosInstance(originalRequest);
        // }
        // return getRefreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available.");
        }

        const response = await basicAxiosInstance.post(
          "https://sp-globalnomad-api.vercel.app/6-12/auth/tokens",
          "",
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return basicAxiosInstance(originalRequest);
      } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
      }
    }

    return Promise.reject(error);
  },
);
