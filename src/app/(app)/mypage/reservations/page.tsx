"use client";

import { getMyReservation } from "@api/myReservation";
import EmptyState from "@app/components/EmptyState/EmptyState";
import { useQuery } from "@tanstack/react-query";
import MyReservationCard from "./components/MyReservationCard";

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
  const { data } = useMyReservation();
  const reservations = data?.reservations || [];
  const totalCount = data?.totalCount || 0;
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-primary">예약 내역</h2>
      {totalCount === 0 ? (
        <EmptyState>체험 예약 내역이 없어요</EmptyState>
      ) : (
        <ul className="flex flex-col gap-4 xl:gap-6">
          {reservations.map((reservation) => (
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
