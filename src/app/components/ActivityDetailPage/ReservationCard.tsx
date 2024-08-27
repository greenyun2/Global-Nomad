"use client";

import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ReservationCardMobile from "@app/components/ActivityDetailPage/ReservationCardMobile";
import ReservationCardDesktop from "./ReservationCardDesktop";
import ReservationCardMobileOpener from "./ReservationCardMobileOpener";

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

  const [openReservationCard, setOpenReservationCard] = useState(false);

  const handleOpenReservationCard = () => {
    setOpenReservationCard((prev) => !prev);
  };

  useEffect(() => {
    !isMobile && setOpenReservationCard(false);
  }, [isMobile]);

  return (
    <>
      {openReservationCard ? (
        <ReservationCardMobile
          isLoginUserData={isLoginUserData}
          schedules={schedules}
          activityId={activityId}
          userId={userId}
          price={price}
          handleCloseClick={handleOpenReservationCard}
        />
      ) : (
        <div className={`block md:hidden`}>
          <ReservationCardMobileOpener
            userId={userId}
            price={price}
            handleOpenReservationCard={handleOpenReservationCard}
          />
        </div>
      )}
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
