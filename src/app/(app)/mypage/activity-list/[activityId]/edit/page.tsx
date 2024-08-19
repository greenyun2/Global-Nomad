"use client";

import { useEffect, useState } from "react";
import { getActivityById } from "@api/activities";
import { updateMyActivity, UpdateActivityBody } from "@api/myActivites";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Editor from "../../Editor";
import { EditorSchemaType } from "../../Editor";

export default function EditActivity() {
  const router = useRouter();
  const { activityId } = useParams();
  const queryClient = useQueryClient();
  const [initialData, setInitialData] = useState<any | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityData = await getActivityById(Number(activityId));
        setInitialData(activityData); // getActivityById의 결과를 그대로 사용
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };

    fetchActivity();
  }, [activityId]);

  const handleSubmit = async (formData: EditorSchemaType) => {
    try {
      // 폼 데이터를 UpdateActivityBody 형식으로 변환
      const updateData: UpdateActivityBody = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        address: formData.address,
        bannerImageUrl: formData.bannerImageUrl,
        schedulesToAdd: formData.schedules,
        subImageUrlsToAdd: formData.subImageUrls,
        scheduleIdsToRemove: formData.scheduleIdsToRemove,
        subImageIdsToRemove: formData.subImageIdsToRemove,
      };

      await updateMyActivity(Number(activityId), updateData);
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