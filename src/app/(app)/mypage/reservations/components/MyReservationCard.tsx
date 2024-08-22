import { ReservationData } from "@api/myReservation";
import Image from "next/image";
import ReservationCancelModal from "./ReservationCancelModal";
import { useDropdown } from "@hooks/useDropdown";
import { formatPriceKorean } from "@utils/formatPrice";

interface MyReservationCardProp {
  reservationId: number;
  cardData: ReservationData;
}

const MyReservationCard = ({
  reservationId,
  cardData: {
    status,
    activity,
    date,
    startTime,
    endTime,
    headCount,
    totalPrice,
  },
}: MyReservationCardProp) => {
  const { isOpen, ref, toggle } = useDropdown();
  const getStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "예약 신청";
      case "canceled":
        return "예약 취소";
      case "confirmed":
        return "예약 승인";
      case "declined":
        return "예약 거절";
      case "completed":
        return "체험 완료";
      default:
        return "";
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-blue-200";
      case "canceled":
        return "text-gray-700";
      case "confirmed":
        return "text-orange-200";
      case "declined":
        return "text-red-100";
      case "completed":
        return "text-gray-700";
      default:
        return "";
    }
  };

  return (
    <>
      {isOpen && (
        <ReservationCancelModal
          ref={ref}
          toggle={toggle}
          reservationId={reservationId}
        />
      )}
      <li className="h-32 rounded-3xl bg-white shadow-custom-shadow-01 md:h-[9.75rem] xl:h-[12.75rem]">
        <div className="flex h-full w-full">
          <div className="relative aspect-square h-full overflow-hidden rounded-l-3xl">
            <Image
              src={`${activity.bannerImageUrl}`}
              alt="activity bannerImage"
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col p-3 md:px-4 md:py-3 xl:px-6 xl:py-4">
            <div className="overflow-hidden">
              <h4 className={`text-lg font-bold ${getStatusColor(status)}`}>
                {getStatus(status)}
              </h4>
              <h3 className="truncate text-md font-bold text-primary md:text-2lg xl:text-xl">
                {activity.title}
              </h3>
              <div className="flex gap-3">
                <span>{date}</span>
                <span>
                  {startTime} - {endTime}
                </span>
                <span>{headCount}명</span>
              </div>
            </div>
            <div className="mt-auto flex place-items-center justify-between">
              <div className="truncate text-lg font-medium text-black md:text-xl xl:text-2xl xl:text-gray-800">
                {formatPriceKorean(totalPrice)}
              </div>
              {status === "pending" && (
                <button
                  onClick={toggle}
                  className="flex h-[32px] w-[80px] items-center justify-center rounded-md border-2 border-primary px-3 py-2 text-md font-bold md:h-[42px] md:w-[112px] md:text-lg xl:w-[144px]"
                >
                  예약 취소
                </button>
              )}
              {status === "completed" && (
                <button className="flex h-[32px] w-[80px] items-center justify-center rounded-md bg-primary px-3 py-2 text-md font-bold text-white md:h-[42px] md:w-[112px] md:text-lg xl:w-[144px]">
                  후기 작성
                </button>
              )}
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default MyReservationCard;
