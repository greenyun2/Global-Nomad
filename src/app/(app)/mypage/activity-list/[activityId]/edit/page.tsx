"use client";

import { useEffect, useState } from "react";
import { getActivityById } from "@api/activities";
import { updateMyActivity, UpdateActivityBody } from "@api/myActivites";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { EditorSchemaType } from "../../Editor";
import Editor from "../../Editor";

export default function EditActivity() {
  const router = useRouter();
  const { activityId } = useParams();
  const queryClient = useQueryClient();
  const [initialData, setInitialData] = useState<EditorSchemaType | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityData = await getActivityById(Number(activityId));

        const schedules = activityData.schedules.map((schedule) => ({
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        }));

        const subImageUrls = activityData.subImages.map(
          (image) => image.imageUrl,
        );

        // EditorSchemaType에 맞게 데이터를 변환하여 설정
        setInitialData({
          title: activityData.title ?? "",
          category: activityData.category ?? "",
          description: activityData.description ?? "",
          price: activityData.price ?? 0,
          address: activityData.address ?? "",
          bannerImageUrl: activityData.bannerImageUrl ?? "",
          schedules: schedules || [],
          subImageUrls: subImageUrls || [],
        });
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };

    fetchActivity();
  }, [activityId]);

  const handleSubmit = async (formData: EditorSchemaType) => {
    try {
      console.log("Updating activity with data:", formData);

      // UpdateMyActivity API를 호출하기 전에 데이터를 UpdateActivityBody 형식으로 변환
      const updateData: UpdateActivityBody = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        address: formData.address,
        bannerImageUrl: formData.bannerImageUrl,
        schedulesToAdd: formData.schedules,
        subImageUrlsToAdd: formData.subImageUrls,
        scheduleIdsToRemove: [], // 필요에 따라 수정
        subImageIdsToRemove: [], // 필요에 따라 수정
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
