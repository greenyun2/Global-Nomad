"use client";

import { useEffect, useState } from "react";
import { getActivityById } from "@api/activities";
import { updateMyActivity, UpdateActivityBody } from "@api/myActivites";
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
    const fetchActivity = async () => {
      try {
        const activityData = await getActivityById(Number(activityId));

        const schedulesToAdd = activityData.schedules.map((schedule) => ({
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        }));

        const subImageUrlsToAdd = activityData.subImages.map(
          (image) => image.imageUrl,
        );

        setInitialData({
          title: activityData.title ?? "",
          category: activityData.category ?? "",
          description: activityData.description ?? "",
          price: activityData.price ?? 0,
          address: activityData.address ?? "",
          bannerImageUrl: activityData.bannerImageUrl ?? "",
          schedulesToAdd: schedulesToAdd,
          subImageUrlsToAdd: subImageUrlsToAdd,
          scheduleIdsToRemove: [],
          subImageIdsToRemove: [],
        });
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };

    fetchActivity();
  }, [activityId]);

  const handleSubmit = async (formData: UpdateActivityBody) => {
    try {
      console.log("Updating activity with data:", formData);
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