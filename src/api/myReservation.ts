import instance from "./axios";

export interface Activity {
  id: number;
  title: string;
  bannerImageUrl: string;
}

export interface ReservationData {
  activity: Activity;
  scheduleId: number;
  id: number;
  teamId: string;
  userId: number;
  status: string;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyReservationsData {
  totalCount: number;
  reservations: ReservationData[];
  cursorId: number;
}

export const getMyReservation = async (
  cursorId?: number,
  size?: number,
  status?: string,
) => {
  const params = new URLSearchParams();
  if (cursorId) params.append("cursorId", String(cursorId));
  if (size) params.append("size", String(size));

  if (status) params.append("status", status);
  const response = await instance.get<MyReservationsData>(
    `/my-reservations?${params}`,
  );
  return response.data;
};

export const cancelMyReservation = async (reservationId: number) => {
  const response = await instance.patch(`/my-reservations/${reservationId}`, {
    status: "canceled",
  });
  return response.data;
};
