"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import { useMediaQuery } from "react-responsive";
import ReservationCardDesktop from "./ReservationCardDesktop";
import ReservationCardMobile from "./ReservationCardMobile";
import "./customCalendar.css";
import { useAuth } from "@context/AuthContext";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReservationCardProps {
  price: number;
  userId: number;
}

interface TotalInfo {
  totalPrice: number;
  totalNumber: number;
}

export default function ReservationCard({
  price,
  userId,
}: ReservationCardProps) {
  const { user } = useAuth();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const today = new Date();
  const [date, setDate] = useState<Value>(today);

  /** @TODO 서버 사이드 렌더링에서 유저 정보 가져오는 함수  */

  const [totalInfo, setTotalInfo] = useState<TotalInfo>({
    totalPrice: price,
    totalNumber: 1,
  });

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
   * 예약 카드 조건
   * 1. 모바일, (데스크탑, 테블릿) 사이즈의 렌더링
   * 데스크탑, 테블릿 || 모바일 사이즈
   * : useMediaQuery => isMobile ? 모바일 사이즈 : 데스크탑, 테블릿 사이즈
   * 2. userId 와 현재 로그인중인 유저의 Id 값을 비교해서 렌더링 결정
   * userId !== 현재 로그인중인 유저 Id && <ReservationCard />
   */

  return (
    <>
      {isMobile ? (
        <ReservationCardMobile
          user={user}
          userId={userId}
          price={price.toLocaleString()}
          Calendar={<Calendar locale="ko" calendarType="hebrew" value={date} />}
        />
      ) : (
        <ReservationCardDesktop
          user={user}
          userId={userId}
          price={price.toLocaleString()}
          Calendar={<Calendar locale="ko" calendarType="hebrew" value={date} />}
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
