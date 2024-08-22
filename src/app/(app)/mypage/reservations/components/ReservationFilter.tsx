import { MouseEvent } from "react";

interface ReservationFilterProps {
  isOpen: boolean;
  handleFilter: (e: MouseEvent<HTMLButtonElement>) => void;
}
const ReservationFilter = ({
  isOpen,
  handleFilter,
}: ReservationFilterProps) => {
  return (
    <div
      className="absolute flex flex-col"
      style={{ display: isOpen ? "flex" : "none" }}
    >
      <button
        className="h-[41px] w-[100px] rounded-t-[6px] border border-primary bg-white hover:bg-primary hover:text-white md:h-[53px] md:w-[140px] xl:w-[127px]"
        type="button"
        onClick={handleFilter}
        value={""}
      >
        전체
      </button>
      <button
        className="h-[41px] w-[100px] border border-primary bg-white hover:bg-primary hover:text-white md:h-[53px] md:w-[140px] xl:w-[127px]"
        type="button"
        onClick={handleFilter}
        value={"pending"}
      >
        예약 신청
      </button>
      <button
        className="h-[41px] w-[100px] border border-primary bg-white hover:bg-primary hover:text-white md:h-[53px] md:w-[140px] xl:w-[127px]"
        type="button"
        onClick={handleFilter}
        value={"canceled"}
      >
        예약 취소
      </button>
      <button
        className="h-[41px] w-[100px] border border-primary bg-white hover:bg-primary hover:text-white md:h-[53px] md:w-[140px] xl:w-[127px]"
        type="button"
        onClick={handleFilter}
        value={"confirmed"}
      >
        예약 승인
      </button>
      <button
        className="h-[41px] w-[100px] border border-primary bg-white hover:bg-primary hover:text-white md:h-[53px] md:w-[140px] xl:w-[127px]"
        type="button"
        onClick={handleFilter}
        value={"declined"}
      >
        예약 거절
      </button>
      <button
        className="h-[41px] w-[100px] rounded-b-[6px] border border-primary bg-white hover:bg-primary hover:text-white md:h-[53px] md:w-[140px] xl:w-[127px]"
        type="button"
        onClick={handleFilter}
        value={"completed"}
      >
        체험 완료
      </button>
    </div>
  );
};

export default ReservationFilter;
