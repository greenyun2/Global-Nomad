"use client";

import { useEffect, useState } from "react";
import { updateMyActivity, UpdateActivityBody } from "@api/myActivites";
import { MyActivityType } from "@customTypes/MyActivity-Status";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Editor from "../../Editor";

export default function EditActivity() {
  const router = useRouter();
  const { activityId } = useParams();
  const queryClient = useQueryClient();
  const [initialData, setInitialData] = useState<UpdateActivityBody | null>(
    null,
  );

  useEffect(() => {
    const activityList = queryClient.getQueryData<MyActivityType[]>([
      "myActivityList",
    ]);
    const activityData = activityList?.find(
      (activity) => activity.id === Number(activityId),
    );

    if (activityData) {
      setInitialData({
        title: activityData.title ?? "",
        category: activityData.category ?? "",
        description: activityData.description ?? "",
        price: activityData.price ?? 0,
        address: activityData.address ?? "",
        bannerImageUrl: activityData.bannerImageUrl ?? "",
        // schedules: activityData.schedules, //
        // subImageUrls: activityData.subImageUrls, //
      });
    }
  }, [activityId, queryClient]);

  const handleSubmit = async (formData: UpdateActivityBody) => {
    try {
      await updateMyActivity(Number(activityId), formData);
      queryClient.invalidateQueries({ queryKey: ["myActivityList"] });
      router.push("/mypage/activity-list");
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary">내 체험 수정</h2>
      {initialData ? (
        <Editor initialData={initialData} onSubmit={handleSubmit} />
      ) : (
        "로딩 중..."
      )}
    </div>
  );
}
