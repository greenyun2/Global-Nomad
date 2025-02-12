"use client";

import React, { useEffect, useRef, useState } from "react";
import Calendar, { TileArgs, TileDisabledFunc } from "react-calendar";
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import {
  getActivityDetailSchedule,
  postApplicationReservation,
} from "@api/fetchActivityDetail";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { time } from "console";
import { format } from "date-fns";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { formatPriceKorean } from "@utils/formatPrice";
import "@lib/CalendarStyles/ReservationCard.css";
import icon_close from "@icons/icon_x_40px.svg";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReservationCardProps {
  price: number;
  userId: number;
  schedules: Schedules[];
  activityId: number;
  isLoginUserData: User | null;
}

interface Schedules {
  id: number;
  date: string;
  times: Times[];
}

interface Times {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

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

const TODAY = new Date();
const FORMAT_DATE = format(new Date(), "yyyy-MM-dd");
const FORMAT_DATE_GET_YEAR = format(FORMAT_DATE, "yyyy");
const FORMAT_DATE_GET_MONTH = format(FORMAT_DATE, "MM");

/**
 * 
 * 코드 깔끔하게 가독성있게 정리하는건 포기, 시간이 지체됨
 * @TODO 인풋 인원수 제어하는 state값 여기서 관리
 * 그다음: 달력 제외한 스타일 정리해서 PR 금방한다

 */

export default function ReservationCardDesktop({
  price,
  userId,
  schedules,
  activityId,
  isLoginUserData,
}: ReservationCardProps) {
  const [totalInfo, setTotalInfo] = useState<TotalInfo>({
    totalPrice: price,
    totalNumber: 1,
  });

  const updateTotalInfo = (modifier: number) => {
    setTotalInfo((prevTotalInfo) => ({
      totalPrice: prevTotalInfo.totalPrice + price * modifier,
      totalNumber: prevTotalInfo.totalNumber + modifier,
    }));
  };

  const handleOnPlus = () => updateTotalInfo(1);

  const handleOnMinus = () => {
    if (totalInfo.totalNumber > 1) {
      updateTotalInfo(-1);
    }
  };

  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setTotalInfo({
        totalPrice: value * price,
        totalNumber: value,
      });
    }
  };

  // 예약가능 스케쥴 데이터
  const [scheduleData, setScheduleData] = useState(schedules);

  const todayScheduleTimes = scheduleData
    .filter((item) => item.date === FORMAT_DATE)
    .flatMap((item) => item.times.map((time) => time));

  const [value, onChange] = useState<Value>(TODAY);
  const [activeDate, setActiveDate] = useState<Date>(TODAY);
  const [scheduleId, setScheduleId] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [message, setMessage] = useState<null | string>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableMessage, setAvailableMessage] =
    useState("날짜를 선택해주세요!");
  // 예약가능한 날짜 정보를 불러오기 위한 api 파라미터값
  const [monthSchedule, setMonthSchedule] = useState({
    year: FORMAT_DATE_GET_YEAR,
    month: FORMAT_DATE_GET_MONTH,
  });

  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [buttonClick, setButtonClick] = useState(false);
  const [availableSchedule, setAvailableSchedule] = useState<Times[] | []>(
    todayScheduleTimes,
  );
  const [selectedDate, setSelectedDate] = useState("");

  const modalRef = useRef(null);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postApplicationReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["availableSchedule"] });
      setIsModal(true);
      setMessage(
        `${selectedTime}시간에 ${totalInfo.totalNumber}명 예약이 완료됐습니다.`,
      );
      setIsDisabled(true);
      setButtonClick(false);
      setTotalInfo({
        totalPrice: price,
        totalNumber: 1,
      });
      setActiveButton(null);
    },
    onError: (error) => {
      setIsModal(true);
      setMessage(`${error}`);
    },
  });

  // 달력 날짜 클릭 시 => 버튼 렌더링을 위한 데이터 수집
  const selectedDateChange = (date: Value) => {
    if (date instanceof Date) {
      const selectedDate = format(date, "yyyy-MM-dd");
      // 클릭해서 선택한 날짜와 스케쥴 배열에서 date와 일치하면, 일치하는 date가 속한 배열에서 times만 뽑아서 전달
      const filterSchedule = scheduleData
        .filter((item) => item.date === selectedDate)
        .flatMap((item) => item.times.map((time) => time));

      setAvailableSchedule(filterSchedule);

      if (availableSchedule.length === 0) {
        setAvailableMessage("예약 가능한 날짜가 없습니다.");
      }
    }
  };

  // 모달 확인 버튼
  const handleOnModalClick = () => {
    setIsModal((prevClick) => !prevClick);
  };

  const handlePostSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 로그인 검사
    if (isLoginUserData?.id === null) {
      setIsModal(true);
      setIsDisabled(true);
      return;
    }

    if (mutation.isPending) return;

    mutation.mutate({
      activityId,
      scheduleId,
      headCount: totalInfo.totalNumber,
    });
  };

  // 스케쥴 시간 버튼 클릭시
  const handleOnClick = (
    timeId: number,
    startTime: string,
    endTime: string,
  ) => {
    setButtonClick(true);

    if (timeId && timeId !== activeButton) {
      setActiveButton(timeId);
      setScheduleId(timeId);
      setSelectedTime(`${startTime}~${endTime}`);
      setIsDisabled(false);
    }

    if (timeId === activeButton && buttonClick === true) {
      setButtonClick(false);
      setIsDisabled(true);
    }

    if (timeId === activeButton && buttonClick === false) {
      setButtonClick(true);
      setIsDisabled(false);
    }
  };

  // onActiveDateChange
  // 다음달에 대한 정보를 얻오는 함수
  const handleOnActiveDateChange = (
    action: string,
    value: Value,
    activeStartDate: Date | null,
  ) => {
    if (action === "next" || action === "prev") {
      setIsDisabled(true);
      if (value instanceof Date && activeStartDate instanceof Date) {
        const changeYear = format(activeStartDate, "yyyy");
        const changeMonth = format(activeStartDate, "MM");
        setMonthSchedule({ year: changeYear, month: changeMonth });
        // month가 바뀌면 예약가능한 날짜에 메세지 변경해 주기
        setActiveDate(activeStartDate);

        if (activeStartDate !== activeDate) {
          setAvailableMessage("날짜를 선택해주세요");
        }
      }
    }
  };

  // onClickMonth 일떄
  const handleOnClickViewMonth = (month: Date) => {
    setActiveDate(month);
    const selectedYear = format(month, "yyyy");
    const selectedMonth = format(month, "MM");
    setMonthSchedule({ year: selectedYear, month: selectedMonth });
  };

  // 다음달, 이전달에 대한 스케쥴 데이터 받아오기
  const { year, month } = monthSchedule;
  const { data, isSuccess } = useQuery({
    queryKey: ["availableSchedule", activityId, year, month],
    queryFn: () => getActivityDetailSchedule({ activityId, year, month }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuccess) {
      setScheduleData(data);
      const changeScheduleDate = format(activeDate, "yyyy-MM");
      const changeScheduleTimes = scheduleData
        .filter((item) => format(item.date, "yyyy-mm") === changeScheduleDate)
        .flatMap((item) => item.times.map((time) => time));
      setAvailableSchedule(changeScheduleTimes);
    }
  }, [data, isSuccess, activeDate, scheduleData]);

  const tileContent = (date: Date) => {
    const eachDate = format(date, "d");
    const today = new Date();
    const isPastDate = format(date, "yyyy-MM-dd") < format(today, "yyyy-MM-dd");
    return (
      <div className={`${isPastDate && "text-[#a4a1aa]"}`}>{eachDate}</div>
    );
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    // 해당 date에 예약건이 있는지 확인합니다.
    const hasSchedule = scheduleData?.find(
      (scheduleData) => scheduleData.date == format(date, "yyyy-MM-dd"),
    );

    const isSelected = selectedDate == format(date, "yyyy-MM-dd");

    if (view === "month") {
      if (isSelected) {
        return "react-calendar__tile--selectedDate";
      } else if (hasSchedule) {
        return "react-calendar__tile--hasScedule";
      }
    }
    return null;
  };

  const disabledTiles: TileDisabledFunc = ({ date }: TileArgs) => {
    const hasSchedule = scheduleData?.find(
      (scheduleData) => scheduleData.date == format(date, "yyyy-MM-dd"),
    );
    const today = new Date();

    if (!hasSchedule) {
      return true;
    } else if (format(date, "yyyy-MM-dd") < format(today, "yyyy-MM-dd")) {
      return true;
    }
    return false;
  };

  const [isTabletModalClick, setIsTabletModalClick] = useState(false);

  const handleOnTabletModalClick = () => {
    setIsTabletModalClick((prevClick) => !prevClick);
  };

  return (
    <>
      {isModal && (
        <Modal ref={modalRef}>
          <div className="relative flex h-[250px] flex-col items-center justify-center">
            <div>
              <p className="flex items-center justify-center text-2lg font-medium text-[#333236]">
                {isLoginUserData?.id ? (
                  <span>{message}</span>
                ) : (
                  "로그인후 예약 신청해주세요"
                )}
              </p>
            </div>
            <div className="absolute bottom-7 right-7 flex justify-end">
              <Button
                type="button"
                onClick={handleOnModalClick}
                size="md"
                color="dark"
              >
                확인
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isLoginUserData?.id !== userId && (
        <div className="hidden h-full md:block">
          <form
            // @TODO onSubmit 이벤트헨들러 수정
            onSubmit={handlePostSubmit}
            className="relative mt-[1px] flex h-full w-full flex-col gap-4 rounded-xl border border-solid border-gray-300 pb-[1.125rem] shadow-[0_0.25rem_1rem_0_#1122110D] md:w-[15.6875rem] xl:w-[24rem] xl:pb-0"
          >
            <section className="flex h-full flex-col gap-4">
              {/* 인당 가격 표시 */}
              <div className="w-full md:mt-6 md:block md:pl-6 xl:pl-[1.028125rem]">
                <p className="flex items-center gap-[0.3125rem] text-center font-bold md:text-2xl xl:text-3xl">
                  {formatPriceKorean(price)}
                  <span className="font-normal text-gray-800 md:text-lg xl:text-xl">
                    / 인
                  </span>
                </p>
              </div>
              {/* 달력 */}
              <div className="flex md:justify-center">
                <div className="flex w-[21rem] flex-col gap-4 border-t border-solid border-gray-300 px-6 pt-4 md:w-full">
                  <h3 className="text-xl/[1.625rem] font-bold text-primary md:text-xl">
                    날짜
                  </h3>

                  <button
                    type="button"
                    className="sm:hidden flex w-[87px] justify-start text-lg font-semibold text-primary md:block xl:hidden"
                    onClick={handleOnTabletModalClick}
                  >
                    날짜 선택하기
                  </button>
                  <div className="reservation-card flex justify-center md:hidden xl:block">
                    <Calendar
                      locale="eng"
                      calendarType="gregory"
                      value={value}
                      tileContent={({ date }) => tileContent(date)}
                      prev2Label={null}
                      next2Label={null}
                      onChange={onChange}
                      minDate={TODAY}
                      onClickDay={(date) => {
                        setSelectedDate(format(date, "yyyy-MM-dd"));
                        selectedDateChange(date);
                      }}
                      formatDay={(locale, date) => format(date, "dd")}
                      minDetail="year"
                      activeStartDate={activeDate}
                      onActiveStartDateChange={({
                        action,
                        activeStartDate,
                        value,
                        view,
                      }) =>
                        handleOnActiveDateChange(action, value, activeStartDate)
                      }
                      onClickMonth={(value, event) =>
                        handleOnClickViewMonth(value)
                      }
                      tileDisabled={disabledTiles}
                      tileClassName={tileClassName}
                      showNeighboringMonth={false}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="flex h-full w-full flex-col items-start gap-[1.5rem] px-6">
              <div className="w-full">
                {/* 예약 스케쥴 버튼 */}
                <div className="flex w-full flex-col gap-[0.875rem] border-b border-solid border-gray-300 pb-4 md:hidden xl:block">
                  <h3 className="text-2lg font-bold text-primary xl:mb-[0.875rem]">
                    예약 가능한 시간
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {availableSchedule.length > 0 ? (
                      availableSchedule.map((item) => (
                        <Button
                          size="sm"
                          className={twMerge(`h-[2.875rem] w-[7.3125rem]`)}
                          color={
                            buttonClick && activeButton === item.id
                              ? "dark"
                              : "bright"
                          }
                          onClick={() =>
                            handleOnClick(item.id, item.startTime, item.endTime)
                          }
                          type="button"
                          key={item.id}
                        >
                          <time>{item.startTime}</time>~
                          <time>{item.endTime}</time>
                        </Button>
                      ))
                    ) : (
                      <span>{availableMessage}</span>
                    )}
                  </div>
                </div>
                {/* 참여 인원 수 */}
                <div className="flex flex-col gap-2 pt-3 md:pt-[0.6875rem]">
                  <h3 className="text-2lg font-bold text-primary">
                    참여 인원 수
                  </h3>
                  <div className="flex w-[7.5rem] justify-start rounded-md border border-solid border-[#CDD0DC]">
                    <button
                      type="button"
                      onClick={handleOnMinus}
                      className="h-[2.5rem] w-[2.5rem]"
                    >
                      -
                    </button>

                    <input
                      className="h-[2.5rem] w-[2.5rem] text-center"
                      type="number"
                      value={totalInfo.totalNumber}
                      onChange={handleOnChangeInput}
                    />

                    <button
                      type="button"
                      onClick={handleOnPlus}
                      className="h-[2.5rem] w-[2.5rem]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <Button
                disabled={isDisabled}
                type="submit"
                size="lg"
                color={isDisabled ? "bright" : "dark"}
                className={twMerge(`rounded`)}
              >
                예약하기
              </Button>
              {/* 총 합계 */}
              <div className="flex w-full items-center justify-between border-t border-solid border-gray-300 pb-4 pt-4">
                <span className="text-xl font-bold text-primary">총 합계</span>
                <span className="text-xl font-bold text-primary">
                  {formatPriceKorean(totalInfo.totalPrice)}
                </span>
              </div>
            </section>
            {/* 테블릿 모달 */}
            {isTabletModalClick && (
              <div className="sm:hidden absolute right-0 top-[-3px] z-[40] flex w-[30rem] flex-col justify-start rounded-3xl bg-white px-6 pb-[2rem] pt-[1.75rem] xl:hidden">
                <div className="flex h-full w-full items-center justify-between">
                  <h3 className="text-2xl font-bold text-black">날짜</h3>
                  <button onClick={handleOnTabletModalClick} type="button">
                    <Image
                      width={40}
                      height={40}
                      src={icon_close}
                      alt="close_icon"
                    />
                  </button>
                </div>
                <div className="reservation-card mb-8 mt-5 flex h-full justify-center">
                  <Calendar
                    locale="eng"
                    calendarType="gregory"
                    value={value}
                    tileContent={({ date }) => tileContent(date)}
                    prev2Label={null}
                    next2Label={null}
                    onChange={onChange}
                    minDate={TODAY}
                    onClickDay={(date) => {
                      setSelectedDate(format(date, "yyyy-MM-dd"));
                      selectedDateChange(date);
                    }}
                    formatDay={(locale, date) => format(date, "dd")}
                    minDetail="year"
                    activeStartDate={activeDate}
                    onActiveStartDateChange={({
                      action,
                      activeStartDate,
                      value,
                      view,
                    }) =>
                      handleOnActiveDateChange(action, value, activeStartDate)
                    }
                    onClickMonth={(value, event) =>
                      handleOnClickViewMonth(value)
                    }
                    tileDisabled={disabledTiles}
                    tileClassName={tileClassName}
                    showNeighboringMonth={false}
                  />
                </div>
                <div className="sm:hidden mb-16 ml-[0.71875rem] flex h-full w-full flex-col gap-[0.875rem]">
                  <h3 className="text-2lg font-bold text-primary">
                    예약 가능한 시간
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {availableSchedule.length > 0 ? (
                      availableSchedule.map((item) => (
                        <Button
                          size="sm"
                          className={twMerge(`h-[2.875rem] w-[7.3125rem]`)}
                          color={
                            buttonClick && activeButton === item.id
                              ? "dark"
                              : "bright"
                          }
                          onClick={() =>
                            handleOnClick(item.id, item.startTime, item.endTime)
                          }
                          type="button"
                          key={item.id}
                        >
                          <time>{item.startTime}</time>~
                          <time>{item.endTime}</time>
                        </Button>
                      ))
                    ) : (
                      <span>{availableMessage}</span>
                    )}
                  </div>
                </div>
                <Button
                  disabled={isDisabled}
                  type="submit"
                  size="lg"
                  color={isDisabled ? "bright" : "dark"}
                  className=""
                >
                  예약하기
                </Button>
              </div>
            )}

            {/* 테블릿 모달 */}
          </form>
        </div>
      )}
    </>
  );
}
