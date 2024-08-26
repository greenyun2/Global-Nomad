"use client";

import { createActivity, CreateActivityBody } from "@api/activities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Editor from "../Editor";
import { useState } from "react";
import { useDropdown } from "@hooks/useDropdown";
import FormErrorMessageModal from "@app/components/Form/FormErrorMessageModal";
import axios, { AxiosError } from "axios";

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
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          const status = axiosError.response.status;

          if (status === 400) {
            setPopUpMessage("제목은 문자열로 입력해주세요.");
            togglePopUp();
          } else if (status === 409) {
            setPopUpMessage("겹치는 예약 가능 시간대가 존재합니다.");
            togglePopUp();
            return;
          } else if (status === 401) {
            setPopUpMessage("재로그인이 후 다시 시도해주세요.");
            togglePopUp();
          } else {
            setPopUpMessage("예상치 못한 오류가 발생했습니다.");
            togglePopUp();
          }
        } else {
          setPopUpMessage("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
          togglePopUp();
        }
      } else {
        console.log("An unexpected error occurred", error);
        setPopUpMessage("예상치 못한 오류가 발생했습니다.");
        togglePopUp();
      }
    },
  });

  const handleSubmit = async (formData: CreateActivityBody) => {
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
