"use client";

import { useState } from "react";
import { createActivity, CreateActivityBody } from "@api/activities";
import FormErrorMessageModal from "@app/components/Form/FormErrorMessageModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Editor from "../Editor";
import { useDropdown } from "@hooks/useDropdown";

export default function RegisterActivity() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [popupMessage, setPopUpMessage] = useState<string | undefined>(
    undefined,
  );
  const { isOpen: isPopUpOpen, toggle: togglePopUp, ref } = useDropdown();

  const mutation = useMutation<void, Error, CreateActivityBody>({
    mutationFn: (formData: CreateActivityBody) => {
      console.log("Form Data being sent:", formData);
      return createActivity(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myActivityList"] });
      router.push("/mypage/activity-list");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        const status = axiosError.response?.status;
        const errorMessage =
          axiosError.response?.data.message ||
          "예상치 못한 오류가 발생했습니다.";

        if (status === 400) {
          setPopUpMessage(errorMessage || "잘못된 요청입니다.");
        } else if (status === 409) {
          setPopUpMessage("겹치는 예약 가능 시간대가 존재합니다.");
        } else if (status === 401) {
          setPopUpMessage("재로그인 후 다시 시도해주세요.");
        } else {
          setPopUpMessage(errorMessage);
        }
      } else {
        console.log("An unexpected error occurred", error);
        setPopUpMessage("예상치 못한 오류가 발생했습니다.");
      }
      togglePopUp();
    },
  });

  const handleSubmit = (formData: CreateActivityBody) => {
    mutation.mutate(formData);
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
      <div className="relative">
        <h2 className="text-3xl font-bold text-primary">내 체험 등록</h2>
        <Editor onSubmit={handleSubmit} />
      </div>
    </>
  );
}
