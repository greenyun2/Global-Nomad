"use client";

import { useState } from "react";
import { getActivityById } from "@api/activities";
import { updateMyActivity, UpdateActivityBody } from "@api/myActivites";
import FormErrorMessageModal from "@app/components/Form/FormErrorMessageModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter, useParams } from "next/navigation";
import Editor, { ModifiedEditorSchemaType } from "../../Editor";
import { useDropdown } from "@hooks/useDropdown";

export default function EditActivity() {
  const router = useRouter();
  const { activityId } = useParams();
  const queryClient = useQueryClient();
  const [popupMessage, setPopUpMessage] = useState<string | undefined>(
    undefined,
  );
  const { isOpen: isPopUpOpen, toggle: togglePopUp, ref } = useDropdown();

  const { data: initialData, error } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: async () => await getActivityById(Number(activityId)),
    staleTime: 1000 * 60 * 5,
  });

  if (error) {
    setPopUpMessage("활동 데이터를 가져오는 데 문제가 발생했습니다.");
  }

  const handleSubmit = async (formData: ModifiedEditorSchemaType) => {
    try {
      const updateData: UpdateActivityBody = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        address: formData.address,
        bannerImageUrl: formData.bannerImageUrl,
        schedulesToAdd: formData.schedulesToAdd,
        subImageUrlsToAdd: formData.subImageUrlsToAdd,
        scheduleIdsToRemove: formData.scheduleIdsToRemove,
        subImageIdsToRemove: formData.subImageIdsToRemove,
      };

      console.log(updateData);
      await updateMyActivity(Number(activityId), updateData);
      queryClient.invalidateQueries({ queryKey: ["myActivityList"] });
      router.push("/mypage/activity-list");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response) {
          const status = axiosError.response.status;

          if (status === 400) {
            const errorMessage =
              axiosError.response.data.message || "잘못된 요청입니다.";
            setPopUpMessage(errorMessage);
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
        console.error("An unexpected error occurred", error);
        setPopUpMessage("예상치 못한 오류가 발생했습니다.");
        togglePopUp();
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
      <div className="relative">
        <h2 className="text-3xl font-bold text-primary">내 체험 수정</h2>
        {initialData ? (
          <Editor initialData={initialData} onSubmit={handleSubmit} />
        ) : (
          "로딩 중..."
        )}
      </div>
    </>
  );
}
