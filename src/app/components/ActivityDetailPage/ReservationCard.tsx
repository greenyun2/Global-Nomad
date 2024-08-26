"use client";

import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import ReservationCardDesktop from "./ReservationCardDesktop";
import ReservationCardMobile from "./ReservationCardMobile";

interface ReservationCardProps {
  activityId: number;
  price: number;
  userId: number;
  schedules: Schedules[];
  isLoginUserData: User | null;
}

type User = {
  id: number;
  email: string;
  nickname?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

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

interface TotalInfo {
  totalPrice: number;
  totalNumber: number;
}

export default function ReservationCard({
  activityId,
  price,
  userId,
  schedules,
  isLoginUserData,
}: ReservationCardProps) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const today = new Date();

  /**
   * 반응형 스타일
   * 데스크탑 - 테블릿 - 모바일
   */

  return (
    <>
      {isMobile ? (
        <ReservationCardMobile
          userId={userId}
          price={price}
          // Calendar={<Calendar locale="ko" calendarType="hebrew" value={date} />}
        />
      ) : (
        <ReservationCardDesktop
          isLoginUserData={isLoginUserData}
          schedules={schedules}
          activityId={activityId}
          userId={userId}
          price={price}
        />
      )}
    </>
  );
}
