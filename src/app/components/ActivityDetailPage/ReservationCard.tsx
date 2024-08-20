"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useMediaQuery } from "react-responsive";
import { getActivityDetailSchedule } from "@api/fetchActivityDetail";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReservationCardDesktop from "./ReservationCardDesktop";
import ReservationCardMobile from "./ReservationCardMobile";
import "./customCalendar.css";
import { useAuth } from "@context/AuthContext";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReservationCardProps {
  activityId: number;
  price: number;
  userId: number;
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

interface TotalInfo {
  totalPrice: number;
  totalNumber: number;
}

const TODAY = new Date();
const TODAY_DATE = TODAY.toISOString().split("T").join("").split("-");
const TODAY_YEAR = TODAY_DATE[0];
const TODAY_MONTH = TODAY_DATE[1];

export default function ReservationCard({
  activityId,
  price,
  userId,
  schedules,
}: ReservationCardProps) {
  const { user } = useAuth();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [totalInfo, setTotalInfo] = useState<TotalInfo>({
    totalPrice: price,
    totalNumber: 1,
  });

  const [selectedDate, setSelectedDate] = useState<Value>(TODAY);

  // const [year, setYear] = useState(TODAY_YEAR);
  // const [month, setMonth] = useState(TODAY_MONTH);
  // const [monthSchedules, setMonthSchedules] = useState(schedules);
  // const [isSchedule, setIsSchedule] = useState(false);
  // const [scheduleItem, setScheduleItem] = useState([]);

  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["available-schedule", year, month],
  //   queryFn: () =>
  //     getActivityDetailSchedule({
  //       activityId,
  //       year,
  //       month,
  //     }),
  // });

  const updateTotalInfo = (modifier: number) => {
    setTotalInfo((prevTotalInfo) => ({
      totalPrice: prevTotalInfo.totalPrice + price * modifier,
      totalNumber: prevTotalInfo.totalNumber + modifier,
    }));
  };

  const handleOnPlus = () => updateTotalInfo(1);

  const handleOnMinus = () => {
    if (totalInfo.totalNumber > 1) {
      updateTotalInfo(-1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setTotalInfo({
        totalPrice: value * price,
        totalNumber: value,
      });
    }
  };

  /**
   * 이해가 안가는 부분
   * 서버 컴포넌트에서 => 클라이언트 컴포넌트로 데이터를 넘겨줄떄
   * 갑자기 데이터가 잘 나오다가 JSON.stringify() 형태로 변경됨
   *
   * 어디서, 데이터를 불러와야 하는지?
   */

  return (
    <>
      {isMobile ? (
        <ReservationCardMobile
          user={user}
          userId={userId}
          price={price.toLocaleString()}
          Calendar={
            <Calendar
              locale="ko"
              calendarType="gregory"
              value={selectedDate}
              view="month"
              prev2Label={null}
              next2Label={null}
              showNeighboringMonth={false}
              onChange={setSelectedDate}
            />
          }
        />
      ) : (
        <ReservationCardDesktop
          schedules={schedules}
          user={user}
          userId={userId}
          price={price.toLocaleString()}
          totalNumber={totalInfo.totalNumber}
          totalPrice={totalInfo.totalPrice.toLocaleString()}
          onPlusClick={handleOnPlus}
          onMinusClick={handleOnMinus}
          onChangeTotalNumber={handleChange}
        />
      )}
    </>
  );
}
