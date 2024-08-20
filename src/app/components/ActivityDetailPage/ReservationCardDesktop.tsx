"use client";

import React, { MouseEventHandler, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useForm } from "react-hook-form";
import { getActivityDetailSchedule } from "@api/fetchActivityDetail";
import { format } from "date-fns";
import Button from "../Button/Button";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReservationCardProps {
  price: number | string;
  userId: number;
  onPlusClick: () => void;
  onMinusClick: () => void;
  onChangeTotalNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
  user: User | null;
  totalPrice: number | string;
  totalNumber: number;
  schedules: Schedules[];
  activityId: number;
  disabled: boolean;
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
/**
 *
 * 테블릿, 데스크탑 사이즈 일때
 */
export default function ReservationCardDesktop({
  price,
  userId,
  onPlusClick,
  onMinusClick,
  onChangeTotalNumber,
  totalNumber,
  totalPrice,
  user,
  schedules,
  activityId,
  disabled,
}: ReservationCardProps) {
  // 날짜 형식 포맷팅
  const formatDate = format(new Date(), "yyyy-MM-dd");
  // const [times, setTimes] = useState<Times>([])
  const filterTodaySchedules = schedules.filter(
    (item) => item.date === formatDate,
  );

  const [filterSchedulesDate, setFilterSchedulesDate] =
    useState(filterTodaySchedules);
  const [value, onChange] = useState<Value>(TODAY);

  const selectedDateChange = (date: Value) => {
    let newFormatDate = "";
    if (date instanceof Date) {
      newFormatDate = format(date, "yyyy-MM-dd");
    }
    const newFilterScheduleDate = schedules.filter(
      (item) => item.date === newFormatDate,
    );
    setFilterSchedulesDate(
      (prevFilterDate) => (prevFilterDate = newFilterScheduleDate),
    );
  };

  const filter = schedules.map((item) => item.date.split("-")[2]);

  const reservationTile = (date: Date) => {
    let div;
    filter.forEach((filterDate) => {
      if (date.getDate() === Number(filterDate)) {
        div = <div className="h-full w-full bg-blue-300"></div>;
      }
    });
    return div;
  };

  // const filter = schedules.map((item) => item.date.split("-")[2]);

  // const reservationTile = (date: Date) => {
  //   let className = "";
  //   filter.forEach((filterDate) => {
  //     if (date.getDate() === Number(filterDate)) {
  //       className = "bg-blue-300 rounded-md w-[90%]";
  //     }
  //   });
  //   return className;
  // };
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = (e.target as HTMLButtonElement).value;
    console.log(value);
  };

  let button;
  filterSchedulesDate.forEach((item) => {
    button = item.times.map((time) => (
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

  const {} = useForm();

  // console.log(schedules);

  /**
   * 요구사항 => 버튼(시간) 클릭(스케쥴 id값 넘겨줘야 함), 인원수 1명 이상 => 에약하기 버튼 활성화
   */
  const handleOnSubmit = async (e: React.FormEvent<SubmitEvent>) => {
    e.preventDefault();
  };

  return (
    <>
      {userId !== user?.id && (
        <form className="mt-[1px] flex h-[46.625rem] w-[24rem] flex-col gap-4 rounded-xl border border-solid border-gray-300 pb-[1.125rem] pt-6 shadow-[0_0.25rem_1rem_0_#1122110D]">
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
                  <button
                    type="button"
                    onClick={onMinusClick}
                    className="h-[2.5rem] w-[2.5rem]"
                  >
                    -
                  </button>
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
              disabled={disabled}
              type="submit"
              size="lg"
              color={disabled ? "bright" : "dark"}
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
