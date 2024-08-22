import { z } from "zod";

export const updateMyInfoSchema = z
  .object({
    email: z
      .string({ required_error: "이메일을 입력해 주세요" })
      .email({ message: "잘못된 이메일입니다." }),
    password: z
      .string({ required_error: "비밀번호를 입력해 주세요" })
      .min(8, { message: "8자리 이상 입력해 주세요" }),
    confirmPassword: z.string(),
    nickname: z
      .string()
      .min(1, { message: "닉네임을 입력해 주세요" })
      .max(10, { message: "닉네임은 10자 이하로 작성해주세요." }),
    profileImageUrl: z.string(),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export type TUpdateMyInfoSchema = z.infer<typeof updateMyInfoSchema>;

export type UploadProfileImageResponse = {
  profileImageUrl: string;
};
