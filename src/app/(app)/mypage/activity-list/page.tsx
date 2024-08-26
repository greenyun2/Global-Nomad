"use client";

import { useContext, useEffect } from "react";
import { deleteMyActivity, getMyActivities } from "@api/myActivites";
import Button from "@app/components/Button/Button";
import { MyActivityType } from "@customTypes/MyActivityStatusType";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import EmptyState from "@components/EmptyState/EmptyState";
import MyActivityComponent from "./MyActivity";
import { MyActivityListContext } from "@context/MyActivityListContext";

export default function ActivityList() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const context = useContext(MyActivityListContext);

  if (!context) {
    throw new Error(
      "MyActivityListContext이 컨텍스트가 올바르게 제공되지 않습니다.",
    );
  }

  const { myActivityList, setMyActivityList } = context;

  // useQuery를 사용하여 데이터를 패칭하고 컨텍스트와 동기화
  const { data } = useQuery<MyActivityType[]>({
    queryKey: ["myActivityList"],
    queryFn: async () => {
      const response = await getMyActivities();
      return response.activities as MyActivityType[]; // MyActivityType으로 캐스팅
    },
    initialData: myActivityList,
  });

  useEffect(() => {
    if (data) {
      setMyActivityList(data);
    }
  }, [data, setMyActivityList]);

  const mutation = useMutation<
    void,
    Error,
    number,
    { previousData: MyActivityType[] }
  >({
    mutationFn: deleteMyActivity,
    onMutate: async (activityId: number) => {
      await queryClient.cancelQueries({ queryKey: ["myActivityList"] });
      const previousData = queryClient.getQueryData<MyActivityType[]>([
        "myActivityList",
      ]);

      setMyActivityList((prev) =>
        prev.filter((activity) => activity.id !== activityId),
      );

      return { previousData: previousData || [] };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        setMyActivityList(context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myActivityList"] });
    },
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const handleRegisterClick = () => {
    router.push("/mypage/activity-list/create");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">내 체험 관리</h2>
        <Button
          size={"md"}
          color={"dark"}
          onClick={handleRegisterClick}
          className={""}
        >
          체험 등록하기
        </Button>
      </div>
      {myActivityList.length > 0 ? (
        <ul className="flex flex-col gap-4 xl:gap-6">
          {myActivityList.map((myActivity) => (
            <MyActivityComponent
              key={myActivity.id}
              {...myActivity}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      ) : (
        <EmptyState>아직 등록한 체험이 없어요</EmptyState>
      )}
    </div>
  );
}
