"use client";

import { useContext, useEffect, useState } from "react";
import { deleteMyActivity, getMyActivities } from "@api/myActivites";
import Button from "@app/components/Button/Button";
import FormErrorMessageModal from "@app/components/Form/FormErrorMessageModal";
import { MyActivityType } from "@customTypes/MyActivityStatusType";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import EmptyState from "@components/EmptyState/EmptyState";
import ConfirmModal from "./ConfirmModal";
import MyActivityComponent from "./MyActivity";
import { useDropdown } from "@hooks/useDropdown";
import { MyActivityListContext } from "@context/MyActivityListContext";

export default function ActivityList() {
  const {
    isOpen: isPopUpOpen,
    toggle: togglePopUp,
    ref: refPopUp,
  } = useDropdown();
  const {
    isOpen: isConfirmOpen,
    toggle: toggleConfirm,
    ref: refConfirm,
  } = useDropdown();
  const [popupMessage, setPopUpMessage] = useState("");
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const context = useContext(MyActivityListContext);

  if (!context) {
    throw new Error(
      "MyActivityListContext이 컨텍스트가 올바르게 제공되지 않습니다.",
    );
  }

  const { myActivityList, setMyActivityList } = context;

  const { data } = useQuery<MyActivityType[]>({
    queryKey: ["myActivityList"],
    queryFn: async () => {
      const response = await getMyActivities();
      return response.activities as MyActivityType[];
    },
    initialData: myActivityList,
    staleTime: 1000 * 60 * 5,
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
      return { previousData: previousData || [] };
    },
    onError: (err, variables, context) => {
      if (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        const errorMessage = axiosError.response?.data?.message;
        if (errorMessage) {
          setPopUpMessage(errorMessage);
          togglePopUp();
        }
      } else if (context?.previousData) {
        setMyActivityList(context.previousData);
      }
    },
    onSuccess: (data, variables) => {
      setMyActivityList((prev) =>
        prev.filter((activity) => activity.id !== variables),
      );
      queryClient.invalidateQueries({ queryKey: ["myActivityList"] });
    },
  });

  const handleDelete = (id: number) => {
    setActivityToDelete(id);
    toggleConfirm(); // 모달 열기/닫기
  };

  const confirmDelete = () => {
    if (activityToDelete !== null) {
      mutation.mutate(activityToDelete);
      toggleConfirm(); // 삭제 후 모달 닫기
    }
  };

  const handleRegisterClick = () => {
    router.push("/mypage/activity-list/create");
  };

  return (
    <>
      {isPopUpOpen && (
        <FormErrorMessageModal
          errorMessage={popupMessage}
          toggle={togglePopUp}
          ref={refPopUp}
        />
      )}
      {isConfirmOpen && ( // 모달이 열려 있을 때만 렌더링
        <ConfirmModal
          ref={refConfirm}
          toggle={toggleConfirm}
          handleDelete={confirmDelete} // 삭제 작업 처리 함수 전달
        />
      )}
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
    </>
  );
}
