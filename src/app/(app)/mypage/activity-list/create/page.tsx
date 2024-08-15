"use client";

import { useContext } from "react";
import { createActivity, CreateActivityBody } from "@api/activities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Editor from "../Editor";
import { MyActivityListContext } from "@context/MyActivityListContext";
import { MyActivityType } from "@customTypes/MyActivity-Status";

export default function RegisterActivity() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const context = useContext(MyActivityListContext);

  if (!context) {
    throw new Error("MyActivityListContext가 올바르게 제공되지 않았습니다.");
  }

  const { setMyActivityList } = context;

  const mutation = useMutation<MyActivityType, Error, CreateActivityBody>({
    mutationFn: (formData: CreateActivityBody) => {
      console.log("Form Data being sent:", formData); // 서버로 전송되는 데이터 확인
      return createActivity(formData); // MyActivityType 반환
    },
    onSuccess: (newActivity) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["myActivityList"] });

      // 컨텍스트 상태 업데이트
      setMyActivityList((prev) => [...prev, newActivity]);

      // 리스트 페이지로 이동
      router.push("/mypage/activity-list");
    },
    onError: (error) => {
      console.error("Error creating activity", error);
    },
  });

  const handleSubmit = async (formData: CreateActivityBody) => {
    mutation.mutate(formData);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary">내 체험 등록</h2>
      <Editor onSubmit={handleSubmit} />
    </div>
  );
}