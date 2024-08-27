"use client";

import { formatPriceKorean } from "@utils/formatPrice";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReservationCardProps {
  price: number;
  userId: number;
  handleOpenReservationCard: () => void;
  isLoginUserData: User | null;
}

// useAuth 컨텍스트를 부모로 부터? 아니면 자식에서?
type User = {
  id: number;
  email: string;
  nickname?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

interface TotalInfo {
  totalPrice: number;
  totalNumber: number;
}

/**
 *
 * 모바일 사이즈일때
 */
export default function ReservationCardMobileOpener({
  isLoginUserData,
  price,
  userId,
  handleOpenReservationCard,
}: ReservationCardProps) {
  return (
    <>
      {userId !== isLoginUserData?.id && (
        <div className="fixed bottom-0 left-0 z-[9999] flex h-[83px] w-full justify-between border-t border-solid border-gray-600 bg-white px-4">
          <div className="flex flex-col gap-2 pb-[0.625rem] pt-4">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold text-primary">
                {formatPriceKorean(price)}
              </h2>
              <span className="text-xl font-semibold text-primary">/</span>
              {/** @TODO text-[]/[]으로 font-size, line-height 다른곳에서도 값 바꾸기*/}
              <span className="text-[1.125rem]/[1.625rem] font-medium text-green-300">
                1명
              </span>
            </div>
            <button
              onClick={() => handleOpenReservationCard()}
              className="cursor-pointer text-md/[1.044375rem] font-semibold text-green-300 underline"
            >
              날짜 선택하기
            </button>
          </div>
          <div className="flex h-full items-center justify-center">
            <button className="h-[3rem] w-[6.625rem] rounded-lg bg-gray-600 text-center text-lg font-bold text-white">
              예약하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
