"use client";

import { useState } from "react";
import { deleteMyActivityPage } from "@api/fetchActivityDetail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@components/Modal/Modal";
import Button from "../Button/Button";
import kebabMenuIcon from "@icons/icon_menu.svg";

interface KebabMenuProps {
  activityId: number;
}

export default function ActivityHeaderKebabMenu({
  activityId,
}: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleOnKebabClick = () => {
    setIsOpen((prevClick) => !prevClick);
  };

  const handleOnDeleteClick = () => {
    setIsModal(true);
  };

  /**
   * 삭제 기능 => 삭제시 useQuery로 클라이언트측에 렌더링되는 데이터 invalidDateQueries 데이터 무효화 해주기
   * popularActivities, queryKey: ["activities", pageNum, size, category, sort], myActivityList
   */

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteMyActivityPage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activities", "myActivityList", "popularActivities"],
      });
      router.replace("/");
    },
    onError: (error) => {
      setMessage(`${error}`);
    },
  });

  const handleOnDeletePage = () => {
    mutation.mutate({ activityId });
  };

  return (
    <>
      {isModal && (
        <Modal>
          <div className="relative flex h-[250px] flex-col items-center justify-center">
            <div>
              <data className="flex items-center justify-center text-2lg font-medium text-[#333236]">
                {message !== null ? message : "정말로 삭제하시겠습니까?"}
              </data>
            </div>
            <div className="absolute bottom-7 right-7 flex justify-end gap-3">
              <Button
                type="button"
                size="md"
                color="dark"
                onClick={handleOnDeletePage}
              >
                확인
              </Button>
              <Button
                type="button"
                onClick={() => setIsModal((prevClick) => !prevClick)}
                size="md"
                color="dark"
              >
                취소
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="relative flex items-center">
        <button
          className="relative h-[2.5rem] w-[2.5rem] cursor-pointer"
          onClick={handleOnKebabClick}
        >
          <Image sizes="" fill src={kebabMenuIcon} alt="케밥 메뉴 아이콘" />
          {isOpen && (
            <ul className="absolute right-0 top-[2.5rem] z-[9999] flex h-[7.125rem] w-[10rem] flex-col items-center justify-center rounded-md bg-white shadow-[0_0.25rem_1rem_0_#1122110D]">
              <Link
                rel="preload"
                className="flex h-full w-full items-center justify-center rounded-t-md border border-solid border-gray-300 hover:bg-primary hover:text-white"
                href={`/mypage/activity-list/${activityId}/edit`}
              >
                <li>수정하기</li>
              </Link>
              <li
                onClick={handleOnDeleteClick}
                className="flex h-full w-full items-center justify-center rounded-b-md border-x border-b border-solid border-gray-300 hover:bg-primary hover:text-white"
              >
                삭제하기
              </li>
            </ul>
          )}
        </button>
      </div>
    </>
  );
}
