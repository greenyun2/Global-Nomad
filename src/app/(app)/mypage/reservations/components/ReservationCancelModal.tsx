import { ForwardedRef, forwardRef } from "react";
import { cancelMyReservation } from "@api/myReservation";
import Button from "@app/components/Button/Button";
import Modal from "@app/components/Modal/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import icon_check from "@icons/icon_check.svg";

type ReservationCancelModalProp = {
  ref: ForwardedRef<HTMLDivElement>;
  toggle: () => void;
  reservationId: number;
};

export const ReservationCancelModal = forwardRef<
  HTMLDivElement,
  ReservationCancelModalProp
>(({ reservationId, toggle }, ref: ForwardedRef<HTMLDivElement>) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: cancelMyReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-reservations"],
      });
    },
  });

  const handleDelete = () => {
    mutate(reservationId);
    toggle();
  };
  return (
    <Modal ref={ref}>
      <div className="flex flex-col items-center gap-[43px] px-[60px] pb-[28px] pt-[81px] md:px-[28px]">
        <Image src={icon_check} alt="check icon" />
        <div className="text-[16px] font-[500] text-[#333236] md:text-[18px]">
          예약을 취소하시겠어요?
        </div>
        <div className="flex gap-2">
          <Button
            className="text-[14px] md:w-[120px] md:place-self-end md:text-[16px]"
            size="md"
            color="bright"
            onClick={() => toggle()}
          >
            아니오
          </Button>
          <Button
            className="text-[14px] md:w-[120px] md:place-self-end md:text-[16px]"
            size="md"
            color="dark"
            onClick={handleDelete}
          >
            취소하기
          </Button>
        </div>
      </div>
    </Modal>
  );
});

ReservationCancelModal.displayName = "ReservationCancelModal";

export default ReservationCancelModal;
