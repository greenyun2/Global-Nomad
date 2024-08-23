"use client";

import { createActivity, CreateActivityBody } from "@api/activities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Editor from "../Editor";

export default function RegisterActivity() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      console.error("Error creating activity", error);
    },
  });

  const handleSubmit = async (formData: CreateActivityBody) => {
    mutation.mutate(formData);
  };

  return (
    <div className="relative">
      <h2 className="text-3xl font-bold text-primary">내 체험 등록</h2>
      <Editor onSubmit={handleSubmit} />
    </div>
  );
}
