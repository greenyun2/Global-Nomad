"use client";

import { MouseEvent, useState } from "react";
import { getMyReservation } from "@api/myReservation";
import EmptyState from "@app/components/EmptyState/EmptyState";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import MyReservationCard from "./components/MyReservationCard";
import ReservationFilter from "./components/ReservationFilter";
import { useDropdown } from "@hooks/useDropdown";
import icon_arrow_filter from "@icons/icon_arrow_filter.svg";

const useMyReservation = (
  status?: string,
  cursorId?: number,
  size?: number,
) => {
  return useQuery({
    queryKey: ["my-reservations"],
    queryFn: () => getMyReservation(),
  });
};

export default function MyReservationPage() {
  const { ref, isOpen, toggle, close } = useDropdown();
  const [filter, setFilter] = useState("");
  const { data } = useMyReservation();
  const reservations = data?.reservations || [];
  const totalCount = data?.totalCount || 0;

  const handleFilter = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    setFilter(button.value);
  };

  const FilteredData = reservations.filter(
    (reservation) => reservation.status === filter,
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="mb-6 text-3xl font-bold text-primary">예약 내역</h2>
        <div ref={ref}>
          <button
            onClick={toggle}
            className="mb-2 flex h-[41px] w-[100px] items-center justify-between rounded-[15px] border-2 border-primary px-[10px] py-[20px] text-primary md:h-[53px] md:w-[140px] md:px-[16px] xl:w-[127px]"
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
          {filter === ""
            ? reservations.map((reservation) => (
                <MyReservationCard
                  key={reservation.id}
                  cardData={reservation}
                  reservationId={reservation.id}
                />
              ))
            : FilteredData.map((reservation) => (
                <MyReservationCard
                  key={reservation.id}
                  cardData={reservation}
                  reservationId={reservation.id}
                />
              ))}
        </ul>
      )}
    </div>
  );
}
