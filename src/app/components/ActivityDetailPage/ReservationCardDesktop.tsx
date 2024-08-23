"use client";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import {
  getActivityDetailSchedule,
  postApplicationReservation,
} from "@api/fetchActivityDetail";
import { getUserMe } from "@api/user";
import { getUserMeServer } from "@app/apiServer/getUserMeServer";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { string } from "zod";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReservationCardProps {
  price: number | string;
  userId: number;
  onPlusClick: () => void;
  onMinusClick: () => void;
  onChangeTotalNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalPrice: number | string;
  totalNumber: number;
  schedules: Schedules[];
  activityId: number;
  isLoginUserData: User | null;
}

interface Schedules {
  id: number;
  date: string;
  times: Times[];
}

interface Times {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

type User = {
  id: number;
  email: string;
  nickname?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
};
const TODAY = new Date();

interface FormData extends FieldValues {
  name?: string;
  email?: string;
  message?: string;
  scheduleId: number; // 추가된 속성
  headCount: number; // 추가된 속성
}

interface SubmitData {
  activityId: number;
  formData: FormData;
}

// const FORM_DATA = {
//   scheduleId: 0,
//   headCount: 0,
// };

export default function ReservationCardDesktop({
  price,
  userId,
  onPlusClick,
  onMinusClick,
  onChangeTotalNumber,
  totalNumber,
  totalPrice,
  schedules,
  activityId,
  isLoginUserData,
}: ReservationCardProps) {
  const formatDate = format(new Date(), "yyyy-MM-dd");
  const filterTodaySchedules = schedules.filter(
    (item) => item.date === formatDate,
  );

  const [filterSchedulesDate, setFilterSchedulesDate] =
    useState(filterTodaySchedules);
  const [value, onChange] = useState<Value>(TODAY);

  // const [userData, setUserData] = useState<User | null>(null);
  const [scheduleId, setScheduleId] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [message, setMessage] = useState<null | string>(null);
  const [selectedTime, setSelectedTime] = useState("");

  const modalRef = useRef(null);

  // 유저 정보 요청

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postApplicationReservation,
    onSuccess: () => {
      setIsModal(true);
      setMessage(`${selectedTime}시간에 ${totalNumber}명 예약이 완료됐습니다.`);
      // 데이터 캐싱 무효화의 기준은 useQuery를 사용한 쿼리키
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
    },
    onError: (error) => {
      setIsModal(true);
      setMessage(`${error}`);
    },
  });

  // 달력 날짜 클릭 시
  const selectedDateChange = (date: Value) => {
    let newFormatDate = "";
    if (date instanceof Date) {
      newFormatDate = format(date, "yyyy-MM-dd");
    }
    const newFilterScheduleDate = schedules.filter(
      (item) => item.date === newFormatDate,
    );
    setFilterSchedulesDate(newFilterScheduleDate);
    setSelectedTime(newFormatDate);
    setIsDisabled(true);
  };

  // 모달 확인 버튼
  const handleOnModalClick = () => {
    setIsModal((prevClick) => !prevClick);
  };

  const handlePostSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 로그인 검사
    // if (userData?.id === null) {
    //   setIsModal(true);
    //   setIsDisabled(true);
    //   return;
    // }
    mutation.mutate({ activityId, scheduleId, headCount: totalNumber });
    setIsDisabled(true);
  };

  // 달력 각각의 날짜의 파란색 바
  const reservationTile = (date: Date) => {
    const filter = schedules.map((item) => item.date.split("-")[2]);
    let div;
    filter.forEach((filterDate) => {
      if (date.getDate() === Number(filterDate)) {
        div = <div className="h-full w-full bg-blue-300"></div>;
      }
    });
    return div;
  };

  // 날짜 클릭시 생성되는 스케쥴 시간 버튼
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = (e.target as HTMLButtonElement).value;
    filterSchedulesDate.forEach((item) => {
      item.times.forEach((time) => {
        if (time.id === Number(value)) {
          setScheduleId(Number(value));
          setIsDisabled(false);
          setSelectedTime(
            (selectedDate) =>
              `${selectedDate} ${time.startTime}~${time.endTime}`,
          );
        } else {
          setIsDisabled(true);
        }
      });
    });
  };

  // 날짜 클릭시 버튼 렌더링
  let button;
  filterSchedulesDate.forEach((item) => {
    button = item.times.map((time) => (
      /** @TODO useForm을 적용해야 하는 부분 */
      <button
        key={time.id}
        className="border border-solid border-gray-600 bg-white focus:bg-blue-200"
        type="button"
        onClick={handleOnClick}
        value={time.id}
      >
        {time.startTime}~{time.endTime}
      </button>
    ));
  });

  return (
    <>
      {isModal && (
        <Modal ref={modalRef}>
          <div className="relative flex h-[250px] flex-col items-center justify-center">
            <div>
              <p className="flex items-center justify-center text-2lg font-medium text-[#333236]">
                {/* {!userData?.id ? (
                  "로그인후 예약 신청해주세요"
                ) : (
                  <time>{message}</time>
                )} */}
              </p>
            </div>
            <div className="absolute bottom-7 right-7 flex justify-end">
              <Button
                type="button"
                onClick={handleOnModalClick}
                size="md"
                color="dark"
              >
                확인
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* {userData === null ? null : userData.id === userId ? ( */}
      {isLoginUserData?.id !== userId && (
        <form
          // @TODO onSubmit 이벤트헨들러 수정
          onSubmit={handlePostSubmit}
          className="mt-[1px] flex h-[46.625rem] w-[24rem] flex-col gap-4 rounded-xl border border-solid border-gray-300 pb-[1.125rem] pt-6 shadow-[0_0.25rem_1rem_0_#1122110D]"
        >
          <section className="flex flex-col gap-4">
            {/* 인당 가격 표시 */}
            <div className="w-full pl-[1.028125rem]">
              <p className="flex items-center gap-[0.3125rem] text-center text-3xl font-bold">
                {`₩ ${price}`}
                <span className="text-xl font-normal text-gray-800">/ 인</span>
              </p>
            </div>
            {/* 달력 */}
            <div className="flex justify-center">
              <div className="flex w-[21rem] flex-col gap-4 border-t border-solid border-gray-300 pt-4">
                <h3 className="text-xl/[1.625rem] font-bold text-primary">
                  날짜
                </h3>
                <div className="flex justify-center">
                  <Calendar
                    locale="ko"
                    calendarType="gregory"
                    value={value}
                    tileContent={({ date }) => reservationTile(date)}
                    prev2Label={null}
                    next2Label={null}
                    showNeighboringMonth={false}
                    onChange={onChange}
                    onClickDay={(date) => selectedDateChange(date)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="flex h-[21.25rem] w-full flex-col items-start gap-[1.5rem] px-6">
            <div className="w-full">
              {/* 예약 스케쥴 버튼 */}
              <div className="flex w-full flex-col gap-[0.875rem] border-b border-solid border-gray-300 pb-4">
                <h3 className="text-2lg font-bold text-primary">
                  예약 가능한 시간
                </h3>
                <div className="flex gap-3">
                  {/** @TODO map() 메서드 사용 */}
                  {filterSchedulesDate.length > 0 ? (
                    button
                  ) : (
                    <p>예약 가능한 시간이 없습니다.</p>
                  )}
                </div>
              </div>
              {/* 참여 인원 수 */}
              <div className="flex flex-col gap-2 pt-3">
                <h3 className="text-2lg font-bold text-primary">
                  참여 인원 수
                </h3>
                <div className="flex w-[7.5rem] justify-start rounded-md border border-solid border-[#CDD0DC]">
                  {/** @TODO useFrom 사용해서 데이터 보내기, 현재 리퀘스트의 body에 데이터를 잘못 보내지만 응답은 잘오는중 */}
                  <button
                    type="button"
                    onClick={onMinusClick}
                    className="h-[2.5rem] w-[2.5rem]"
                  >
                    -
                  </button>
                  {/** @TODO useForm을 적용해야 하는 부분*/}

                  <input
                    className="h-[2.5rem] w-[2.5rem] text-center"
                    type="number"
                    value={totalNumber}
                    onChange={onChangeTotalNumber}
                  />

                  <button
                    type="button"
                    onClick={onPlusClick}
                    className="h-[2.5rem] w-[2.5rem]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <Button
              disabled={isDisabled}
              type="submit"
              size="lg"
              color={isDisabled ? "bright" : "dark"}
              className=""
            >
              예약하기
            </Button>
            {/* 총 합계 */}
            <div className="flex w-full items-center justify-between border-t border-solid border-gray-300 pt-4">
              <span className="text-xl font-bold text-primary">총 합계</span>
              <data className="text-xl font-bold text-primary">{`₩ ${totalPrice}`}</data>
            </div>
          </section>
        </form>
      )}
    </>
  );
}
