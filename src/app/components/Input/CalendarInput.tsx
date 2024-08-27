"use client";

import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import Calendar, { TileArgs, TileDisabledFunc } from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// react-calendar 기본 css
// date객체를 쉽게 format할 수 있는 library를 설치 했습니다.
import { format } from "date-fns";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useDropdown } from "@hooks/useDropdown";
import "@lib/CalendarStyles/CalendarInput.css";
import icon_calendar from "@icons/icon_calendar.svg";

// react-calender용 types
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type CalendarInputPropsType = {
  placeholder: string;
  id: string;
  onChange: (value: any) => void;
  invalid?: boolean;
  value?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  className?: string;
};

const CalendarInput = forwardRef<HTMLInputElement, CalendarInputPropsType>(
  (
    { id, onChange, onBlur, invalid, placeholder, value, className },
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const {
      isOpen: isDayPickerOpen,
      toggle,
      close,
      ref: CalendarRef,
    } = useDropdown();

    // 사용자가 react-calendar를 이용하여 선택한 date object입니다.
    const [selectedDate, setSelectedDate] = useState<Value>(null);
    // react-hook-form의 controller에게 전달할 date-format 입니다.
    const [dateformat1, setDate1] = useState("");
    // 사용자가 input field에서 보게될 date-format입니다.
    const [dateformat2, setDate2] = useState("");

    // selectedDate값이 변하면 실행할 함수들
    useEffect(() => {
      if (selectedDate) {
        // react-hook-form에 전달할 date값을 schema에 맞게 formatting 합니다.
        setDate1(format(selectedDate as Date, "yyyy-MM-dd"));
        // react-hook-form에 포맷이 완료된 날짜 값을 전달합니다.
        onChange(dateformat1);

        // input tag에 보여줄 date값을 formatting 해줍니다.
        setDate2(format(selectedDate as Date, "yy/MM/dd"));
      }
    }, [selectedDate, onChange, dateformat1, close]);

    // 비활성화 시킬 date를 결정하는 함수
    const disabledTiles: TileDisabledFunc = ({ date }: TileArgs) => {
      const today = new Date();
      if (format(date, "yyyy-MM-dd") < format(today, "yyyy-MM-dd")) {
        return true;
      }
      return false;
    };

    return (
      <div ref={CalendarRef} className="relative flex items-center">
        <input
          readOnly
          placeholder={placeholder}
          id={id}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          value={(value && format(value, "yy/MM/dd")) || dateformat2}
          ref={ref}
          className={twMerge(
            `${invalid ? "border-red-100" : "border-gray-700"} h-[58px] w-full cursor-pointer rounded-[6px] border px-[16px] py-[20px] text-[16px] font-[400] text-black md:px-[16px] md:py-[20px]`,
            className,
          )}
          onClick={() => toggle()}
        />
        <Image
          src={icon_calendar}
          width={24}
          alt="calendar-icon"
          className="absolute right-[10px] cursor-pointer text-[#9FA6B2]"
          onClick={() => toggle()}
        />
        {isDayPickerOpen ? (
          <div className="calendar-input absolute top-[50px] z-50 md:left-[120px] xl:left-[390px]">
            {/* 1. 유저가 날짜를 선택하면 selectedDate에 값을 저장합니다. */}
            <Calendar
              onChange={setSelectedDate}
              onClickDay={() => toggle()}
              tileDisabled={disabledTiles}
              showNeighboringMonth={false}
              prev2Label={false}
              next2Label={false}
              calendarType="gregory"
            />
          </div>
        ) : null}
      </div>
    );
  },
);

CalendarInput.displayName = "CalendarInput";
export default CalendarInput;
