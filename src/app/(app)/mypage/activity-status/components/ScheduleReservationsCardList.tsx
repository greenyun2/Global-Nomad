import { updateScheduleReservationStatus } from "@api/MyActivityStatusApi";
import Button from "@app/components/Button/Button";
import { ScheduleReservationsListPropType } from "@customTypes/MyActivityStatusType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import ReservationStatusBadge from "./ReservationStatusBadge";
import no_notification from "@images/no_notification2.gif";

export default function ScheduleReservationsList({
  scheduleReservations,
}: ScheduleReservationsListPropType) {
  const schedules = scheduleReservations?.reservations;
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({
      selectedActivityId,
      scheduleId,
      confirmOrDecline,
    }: {
      selectedActivityId: string;
      scheduleId: string;
      confirmOrDecline: string;
    }) => {
      return updateScheduleReservationStatus(
        selectedActivityId,
        scheduleId,
        confirmOrDecline,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scheduleReservationsStatus", "MonthlyReservations"],
      });
    },
  });

  return (
    <>
      {scheduleReservations?.totalCount === 0 && (
        <Image height={132} src={no_notification} alt="no_schedules" />
      )}
      {schedules &&
        schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex w-full flex-col gap-[6px] rounded-[12px] border-2 px-[16px] py-[12px] text-[16px] text-black md:rounded-[4px]"
          >
            <section className="flex gap-[10px]">
              <div className="font-semibold text-gray-700">닉네임</div>
              <div className="font-medium">{schedule.nickname}</div>
            </section>
            <section className="flex gap-[10px]">
              <div className="font-semibold text-gray-700">인원</div>
              <div className="font-medium">{schedule.headCount}</div>
            </section>
            {schedule.status !== "pending" && (
              <section className="place-self-end">
                <ReservationStatusBadge
                  text={
                    schedule.status === "confirmed" ? "예약 승인" : "예약 거절"
                  }
                  type={
                    schedule.status === "confirmed" ? "confirmed" : "declined"
                  }
                />
              </section>
            )}

            {schedule.status === "pending" && (
              <section className="flex gap-[6px] place-self-end text-[14px]">
                <Button
                  onClick={() =>
                    mutate({
                      selectedActivityId: schedule.activityId.toString(),
                      scheduleId: schedule.id.toString(),
                      confirmOrDecline: "confirmed",
                    })
                  }
                  color="dark"
                  size="sm"
                  className="w-[82px]"
                >
                  승인 하기
                </Button>
                <Button
                  onClick={() =>
                    mutate({
                      selectedActivityId: schedule.activityId.toString(),
                      scheduleId: schedule.id.toString(),
                      confirmOrDecline: "declined",
                    })
                  }
                  color="bright"
                  size="sm"
                  className="w-[82px]"
                >
                  거절 하기
                </Button>
              </section>
            )}
          </div>
        ))}
    </>
  );
}
