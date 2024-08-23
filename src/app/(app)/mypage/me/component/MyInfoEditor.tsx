"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { updateMyInfo, uploadProfileImage, UserMe } from "@api/user";
import Button from "@app/components/Button/Button";
import FormErrorMessageModal from "@app/components/Form/FormErrorMessageModal";
import BasicInput from "@app/components/Input/BasicInput";
import { TUpdateMyInfoSchema, updateMyInfoSchema } from "@customTypes/Me";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useDropdown } from "@hooks/useDropdown";

type MyInfoEditorProps = {
  data: UserMe | null;
};

export default function MyInfoEditor({ data }: MyInfoEditorProps) {
  const queryClient = useQueryClient();
  const { isOpen: isPopUpOpen, toggle: togglePopUp, ref } = useDropdown();
  const [popupMessage, setPopUpMessage] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
  } = useForm<TUpdateMyInfoSchema>({
    resolver: zodResolver(updateMyInfoSchema),
    mode: "onChange",
  });

  // validation check를 할 schema를 생성합니다

  useEffect(() => {
    if (data) {
      setValue("nickname", data.nickname);
      setValue("email", data.email);
      setValue("profileImageUrl", data.profileImageUrl);
      setImagePreviewUrl(data.profileImageUrl);
    }
  }, [data, setValue]);

  const handleUpdateUserInfoSubmit = async (formdata: TUpdateMyInfoSchema) => {
    mutate(formdata);
  };
  const { mutate } = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile"],
      });
      setPopUpMessage("내 정보가 업데이트 됐습니다.");
      togglePopUp();
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message;
      errorMessage && setPopUpMessage(errorMessage);
      togglePopUp();
    },
  });

  const handleRemoveImage = () => {
    setImagePreviewUrl(null);
    setValue("profileImageUrl", "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (imagePreviewUrl) {
        setPopUpMessage("프로필 이미지는 최대 1개만 등록할 수 있습니다.");
        togglePopUp();
        return;
      }
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);

      setIsImageUploading(true);
      try {
        const response = await uploadProfileImage(file);
        setValue("profileImageUrl", response.data.profileImageUrl);
        setImagePreviewUrl(response.data.profileImageUrl);
        setIsImageUploading(false);
        toast.success("프로필 이미지 업로드 완료");
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.code == "ERR_NETWORK") {
          toast.error("파일 크기는 5MB보다 작아야 합니다.");
          setImagePreviewUrl(data?.profileImageUrl as string);
        }
      }
    }
  };

  return (
    <>
      {isPopUpOpen && (
        <FormErrorMessageModal
          errorMessage={popupMessage}
          toggle={togglePopUp}
          ref={ref}
        />
      )}
      <form
        onSubmit={handleSubmit(handleUpdateUserInfoSubmit)}
        className="flex flex-col gap-[20px]"
      >
        <section>
          <div className="flex flex-col gap-[16px]">
            <label
              htmlFor="profileImageUrl"
              className="text-2xl font-bold text-black"
            >
              프로필 이미지
            </label>
            <div className="flex items-center gap-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload-input"
                  className="hidden"
                />
                <label
                  htmlFor="image-upload-input"
                  className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
                >
                  <span className="text-2xl text-gray-300">+</span>
                  <span className="text-gray-500">이미지 등록</span>
                </label>
              </div>

              {imagePreviewUrl && (
                <div className="relative">
                  <div
                    className="h-24 w-24 rounded-lg bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${imagePreviewUrl})`,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-0 top-0 flex h-6 w-6 -translate-y-2 translate-x-2 transform items-center justify-center rounded-full bg-black text-white"
                  >
                    X
                  </button>
                </div>
              )}
              {errors.profileImageUrl && (
                <p className="text-sm text-red-500">
                  {errors.profileImageUrl.message}
                </p>
              )}
            </div>
          </div>
        </section>
        <section>
          <div className="flex flex-col gap-[16px]">
            <label htmlFor="nickname" className="text-2xl font-bold text-black">
              닉네임
            </label>
            <Controller
              name="nickname"
              control={control}
              render={({ field }) => (
                <BasicInput
                  id="nickname"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          {errors.nickname && (
            <p className="mt-[8px] text-[12px] text-red-100">
              {errors.nickname.message as string}
            </p>
          )}
        </section>
        <section>
          <div className="flex flex-col gap-[16px]">
            <label htmlFor="email" className="text-2xl font-bold text-black">
              이메일
            </label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <BasicInput
                  id="email"
                  type="text"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.email && (
            <p className="mt-[8px] text-[12px] text-red-100">
              {errors.email.message as string}
            </p>
          )}
        </section>
        <section>
          <div className="flex flex-col gap-[16px]">
            <label htmlFor="password" className="text-2xl font-bold text-black">
              비밀번호
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <BasicInput
                  id="password"
                  type="text"
                  placeholder="8자 이상 입력해 주세요"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.password && (
            <p className="mt-[8px] text-[12px] text-red-100">
              {errors.password.message as string}
            </p>
          )}
        </section>
        <section>
          <div className="flex flex-col gap-[16px]">
            <label
              htmlFor="confirmPassword"
              className="text-2xl font-bold text-black"
            >
              비밀번호 재입력
            </label>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <BasicInput
                  id="confirmPassword"
                  type="text"
                  placeholder="비밀번호를 한번 더 입력해 주세요"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-[8px] text-[12px] text-red-100">
              {errors.confirmPassword.message as string}
            </p>
          )}
        </section>

        <Button
          disabled={!isValid || isImageUploading}
          size={"md"}
          color={"dark"}
          className={"absolute right-0 top-0 w-[120px]"}
        >
          저장하기
        </Button>
      </form>
    </>
  );
}
