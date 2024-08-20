"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
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
}

interface Schedules {
  id: number;
  date: string;
  times: Times;
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
}: ReservationCardProps) {
  // 날짜 형식 포맷팅
  const formatDate = format(new Date(), "yyyy-MM-dd");
  const filterTodaySchedules = schedules.filter(
    (item) => item.date === formatDate,
  );

  const [filterSchedulesDate, setFilterSchedulesDate] =
    useState(filterTodaySchedules);
  const [selectedDate, setSelectedDate] = useState<Value>(TODAY);

  // 달력의 날짜를 클릭했을때 값이 변합니다
  const handleDateChange = (date: Value) => {
    setSelectedDate(date);
    let newFormatDate = "";
    if (selectedDate instanceof Date) {
      newFormatDate = format(selectedDate, "yyyy-MM-dd");
    }
    const newFilterScheduleDate = schedules.filter(
      (item) => item.date === newFormatDate,
    );
    setFilterSchedulesDate(newFilterScheduleDate);
  };

  // page로 부터 받은 데이터를 prop으로 내려 받았습니다.
  console.log(schedules, "page => card => 데스크탑버전");
  // 받은 데이터를 필터링 했습니다
  console.log(filterSchedulesDate, "필터링된 스케쥴 데이터");
  return (
    <>
      {userId !== user?.id && (
        <aside className="mt-[1px] flex h-[46.625rem] w-[24rem] flex-col gap-4 rounded-xl border border-solid border-gray-300 pb-[1.125rem] pt-6 shadow-[0_0.25rem_1rem_0_#1122110D]">
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
                <h2 className="text-xl/[1.625rem] font-bold text-primary">
                  날짜
                </h2>
                <div className="flex justify-center">
                  <Calendar
                    locale="ko"
                    calendarType="gregory"
                    value={selectedDate}
                    view="month"
                    prev2Label={null}
                    next2Label={null}
                    showNeighboringMonth={false}
                    onChange={handleDateChange}
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
                  {/* {filterSchedulesDate.length > 0 ? (
                    filterSchedulesDate.map((item) => (
                      <button
                        key={item.id}
                      >{`${item.times.startTime}~${item.times.endTime}`}</button>
                    ))
                  ) : (
                    <p>예약이 없습니다.</p>
                  )} */}
                </div>
              </div>
              {/* 참여 인원 수 */}
              <div className="flex flex-col gap-2 pt-3">
                <h3 className="text-2lg font-bold text-primary">
                  참여 인원 수
                </h3>
                <div className="flex w-[7.5rem] justify-start rounded-md border border-solid border-[#CDD0DC]">
                  <button
                    onClick={onMinusClick}
                    className="h-[2.5rem] w-[2.5rem]"
                  >
                    -
                  </button>
                  <input
                    className="h-[2.5rem] w-[2.5rem] text-center"
                    type="text"
                    value={totalNumber}
                    onChange={onChangeTotalNumber}
                  />
                  <button
                    onClick={onPlusClick}
                    className="h-[2.5rem] w-[2.5rem]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <Button size="lg" color="dark" className="">
              예약하기
            </Button>
            {/* 총 합계 */}
            <div className="flex w-full items-center justify-between border-t border-solid border-gray-300 pt-4">
              <h1 className="text-xl font-bold text-primary">총 합계</h1>
              <p className="text-xl font-bold text-primary">{`₩ ${totalPrice}`}</p>
            </div>
          </section>
        </aside>
      )}
    </>
  );
}
