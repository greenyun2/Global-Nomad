"use client";

import { MouseEvent, useState } from "react";
import { getMyReservation, ReservationData } from "@api/myReservation";
import ReservationCancelModal from "@app/(app)/mypage/reservations/components/ReservationCancelModal";
import ReservationReviewModal from "@app/(app)/mypage/reservations/components/ReservationReviewModal";
import EmptyState from "@app/components/EmptyState/EmptyState";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import MyReservationCard from "./components/MyReservationCard";
import ReservationFilter from "./components/ReservationFilter";
import { useDropdown } from "@hooks/useDropdown";
import icon_arrow_filter from "@icons/icon_arrow_filter.svg";

const useMyReservation = (size: 500, cursorId?: number, status?: string) => {
  return useQuery({
    queryKey: ["my-reservations"],
    queryFn: () => getMyReservation(size),
    staleTime: 1000 * 60 * 5,
  });
};

const currentSize = 500;

export default function MyReservationPage() {
  const { ref, isOpen, toggle, close } = useDropdown();
  const [filter, setFilter] = useState("");
  const { data } = useMyReservation(currentSize);
  const reservations = data?.reservations || [];
  const totalCount = data?.totalCount || 0;
  const handleFilter = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    setFilter(button.value);
  };
  const [clickedReservationId, setClickedReservationId] = useState<
    number | null
  >(null);

  const handleReservationClick = (reservationId: number) => {
    setClickedReservationId(reservationId);
  };

  const FilteredData = reservations.filter(
    (reservation) => reservation.status === filter,
  );
  const FilteredDataLength = FilteredData.length;

  const {
    isOpen: isReviewModalOpen,
    ref: reviewModalRef,
    toggle: toggleReviewModal,
  } = useDropdown();

  const {
    isOpen: isReservationCancelModalOpen,
    ref: cancelModalRef,
    toggle: toggleCancelModal,
  } = useDropdown();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="mb-6 text-3xl font-bold text-primary">예약 내역</h2>
        <div ref={ref}>
          <button
            onClick={toggle}
            className="mb-2 flex h-[41px] w-[100px] items-center justify-between rounded-[15px] border border-primary px-[10px] py-[20px] text-primary md:h-[53px] md:w-[140px] md:px-[16px] xl:w-[127px]"
          >
            <p className="text-[14px] font-medium text-primary md:text-[18px]">
              {filter === "" && "전체"}
              {filter === "pending" && "예약 신청"}
              {filter === "canceled" && "예약 취소"}
              {filter === "confirmed" && "예약 승인"}
              {filter === "declined" && "예약 거절"}
              {filter === "completed" && "체험 완료"}
            </p>
            <Image
              src={icon_arrow_filter}
              alt="arrow icon"
              width={22}
              height={22}
              style={{ width: 22, height: 22 }}
            />
          </button>
          {isOpen && (
            <div onClick={close}>
              <ReservationFilter isOpen={isOpen} handleFilter={handleFilter} />
            </div>
          )}
        </div>
      </div>
      {totalCount === 0 ? (
        <EmptyState>체험 예약 내역이 없어요</EmptyState>
      ) : (
        <ul className="flex flex-col gap-4 xl:gap-6">
          {filter === "" ? (
            reservations.map((reservation) => (
              <MyReservationCard
                key={reservation.id}
                cardData={reservation}
                reservationId={reservation.id}
                handleReservationClick={handleReservationClick}
                toggleCancelModal={toggleCancelModal}
                toggleReviewModal={toggleReviewModal}
              />
            ))
          ) : FilteredDataLength === 0 ? (
            <EmptyState>내역이 없습니다.</EmptyState>
          ) : (
            FilteredData.map((reservation) => (
              <MyReservationCard
                key={reservation.id}
                cardData={reservation}
                reservationId={reservation.id}
                handleReservationClick={handleReservationClick}
                toggleCancelModal={toggleCancelModal}
                toggleReviewModal={toggleReviewModal}
              />
            ))
          )}
        </ul>
      )}
      {isReservationCancelModalOpen && (
        <ReservationCancelModal
          ref={cancelModalRef}
          toggle={toggleCancelModal}
          reservationId={
            data?.reservations.find(
              (reservation) => reservation.id == clickedReservationId,
            )?.id as number
          }
        />
      )}
      {isReviewModalOpen && (
        <ReservationReviewModal
          cardData={
            data?.reservations.find(
              (reservation) => reservation.id == clickedReservationId,
            ) as ReservationData
          }
          toggle={toggleReviewModal}
          ref={reviewModalRef}
        />
      )}
    </div>
  );
}
