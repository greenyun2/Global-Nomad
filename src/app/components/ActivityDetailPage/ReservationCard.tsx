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
   * 예약 카드 조건
   * 1. 모바일, (데스크탑, 테블릿) 사이즈의 렌더링
   * 데스크탑, 테블릿 || 모바일 사이즈
   * : useMediaQuery => isMobile ? 모바일 사이즈 : 데스크탑, 테블릿 사이즈
   * 2. userId 와 현재 로그인중인 유저의 Id 값을 비교해서 렌더링 결정
   * userId !== 현재 로그인중인 유저 Id && <ReservationCard />
   */

  return (
    <>
      {/* {isMobile ? (
        <ReservationCardMobile
          user={user}
          userId={userId}
          Calendar={<Calendar locale="ko" calendarType="hebrew" value={date} />}
        />
      ) : (
        
      )} */}
      <ReservationCardDesktop
        isLoginUserData={isLoginUserData}
        schedules={schedules}
        activityId={activityId}
        userId={userId}
        price={price}
      />
    </>
  );
}
