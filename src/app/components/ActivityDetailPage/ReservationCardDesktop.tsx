"use client";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
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
} from "@tanstack/react-query";
import { time } from "console";
import { format } from "date-fns";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import "./customCalendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReservationCardProps {
  price: number | string;
  userId: number;
  onPlusClick: () => void;
  onMinusClick: () => void;
  onChangeTotalNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalPrice: number | string;
  totalNumber: number;
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
const TODAY = new Date();

interface FormData extends FieldValues {
  name?: string;
  email?: string;
  message?: string;
  scheduleId: number; // 추가된 속성
  headCount: number; // 추가된 속성
}

// interface SubmitData {
//   activityId: number;
//   formData: FormData;
// }

// const FORM_DATA = {
//   scheduleId: 0,
//   headCount: 0,
// };

export default function ReservationCardDesktop({
  price,
  userId,
  onPlusClick,
  onMinusClick,
  onChangeTotalNumber,
  totalNumber,
  totalPrice,
  schedules,
  activityId,
  isLoginUserData,
}: ReservationCardProps) {
  /**
   * 초기 데이터는 서버 컴포너트에서 가져오는데 8월달
   * 근데 클라이언트 컴포넌트에서 다음달에 대한 정보 다음달에 한정이 아니라 날짜가 바뀌면 정보 요청 useQuery로
   * 1. 초기 데이터 렌더링 => 다음달 클릭시 2024, 09 정보 가져와서 useQuery로 요청
   *
   * 다음달 이전달에 대한 정보는 onActiveStart => onChangeActive 필요한 정보는 month의 정보라서 괜찮음
   *
   *
   * 초기 데이터 = schedules
   * 다음달 데이터 = useQuery로 요청 및 캐싱 => 여기까지 성공
   *
   */

  // 초기 데이터 스케쥴 날짜 포멧팅
  const formatDate = format(new Date(), "yyyy-MM-dd");
  const formatYearDate = format(formatDate, "yyyy");
  const formatMonthDate = format(formatDate, "MM");

  // 달력 클릭시 변경 state
  const [value, onChange] = useState<Value>(TODAY);
  // 스케쥴 아이디
  const [scheduleId, setScheduleId] = useState(0);

  const [isModal, setIsModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [message, setMessage] = useState<null | string>(null);
  const [selectedTime, setSelectedTime] = useState("");

  const [availableMessage, setAvailableMessage] =
    useState("날짜를 선택해주세요!");

  // 예약가능한 날짜 정보를 불러오기 위한 api 파라미터값
  const [monthSchedule, setMonthSchedule] = useState({
    year: formatYearDate,
    month: formatMonthDate,
  });

  // 페이지로 부터 초기에 받은 스케쥴 정보
  const [scheduleData, setScheduleData] = useState(schedules);

  // 날짜 클릭시, 날짜에 에약가능 스케쥴 뽑아서 => 예약가능시간에 스케쥴 시간 버튼으로 렌더링
  const todayScheduleTimes = scheduleData
    .filter((item) => item.date === formatDate)
    .flatMap((item) => item.times.map((time) => time));

  const [availableSchedule, setAvailableSchedule] = useState<Times[] | []>(
    todayScheduleTimes,
  );

  // 현재 선택된 날짜: onActiveDateChange에 필요한 정보
  const [activeDate, setActiveDate] = useState<Date>(TODAY);

  const scheduleButtonRef = useRef(null);

  const modalRef = useRef(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postApplicationReservation,
    onSuccess: () => {
      setIsModal(true);
      setMessage(`${selectedTime}시간에 ${totalNumber}명 예약이 완료됐습니다.`);
      // 데이터 캐싱 무효화의 기준은 useQuery를 사용한 쿼리키
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
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
    mutation.mutate({ activityId, scheduleId, headCount: totalNumber });
    setIsDisabled(true);
  };

  // #CED8D5 스케쥴이 있는 부분 색상, 클릭된 날짜 #0B3B2D

  const [activeButton, setActiveButton] = useState<number | null>(null);

  // 스케쥴 시간 버튼 클릭시
  const handleOnClick = (
    timeId: number,
    startTime: string,
    endTime: string,
  ) => {
    setActiveButton(timeId);
    setScheduleId(timeId);
    setSelectedTime(`${startTime}~${endTime}`);
    setIsDisabled(false);
  };

  // onActiveDateChange
  // 다음달에 대한 정보를 얻오는 함수
  const handleOnActiveDateChange = (
    action: string,
    value: Value,
    activeStartDate: Date | null,
  ) => {
    if (action === "next" || action === "prev") {
      if (value instanceof Date && activeStartDate instanceof Date) {
        const changeYear = format(activeStartDate, "yyyy");
        const changeMonth = format(activeStartDate, "MM");
        setMonthSchedule({ year: changeYear, month: changeMonth });
        // month가 바뀌면 예약가능한 날짜에 메세지 변경해 주기
        setActiveDate(activeStartDate);

        if (activeStartDate !== activeDate) {
          setAvailableMessage("날짜를 선택해주세요!");
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

  const { year, month } = monthSchedule;
  const { data, isSuccess } = useQuery({
    queryKey: ["availableSchedule", activityId, year, month],
    queryFn: () => getActivityDetailSchedule({ activityId, year, month }),
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
  }, [data, isSuccess]);

  // 예약 가능 날짜에 파란색 점으로 표시
  const reservationTile = (date: Date) => {
    let tile;
    if (date instanceof Date) {
      const formatDate = format(date, "yyyy-MM-dd");
      scheduleData.forEach((item) => {
        item.date === formatDate
          ? (tile = (
              <div className="mx-auto h-1 w-1 rounded-full bg-blue-300"></div>
            ))
          : null;
      });
    }
    return tile;
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
        <form
          // @TODO onSubmit 이벤트헨들러 수정
          onSubmit={handlePostSubmit}
          className="mt-[1px] flex h-[46.625rem] w-[24rem] flex-col gap-4 rounded-xl border border-solid border-gray-300 pb-[1.125rem] pt-6 shadow-[0_0.25rem_1rem_0_#1122110D]"
        >
          <section className="flex flex-col gap-4">
            {/* 인당 가격 표시 */}
            <div className="w-full pl-[1.028125rem]">
              <p className="flex items-center gap-[0.3125rem] text-center text-3xl font-bold">
                {`₩ ${price}`}
                <span className="text-xl font-normal text-gray-800">/ 인</span>
              </p>
            </div>
            {/* 달력 */}
            <div className="flex justify-center">
              <div className="flex w-[21rem] flex-col gap-4 border-t border-solid border-gray-300 pt-4">
                <h3 className="text-xl/[1.625rem] font-bold text-primary">
                  날짜
                </h3>
                <div className="flex justify-center">
                  <Calendar
                    className=""
                    locale="ko"
                    calendarType="gregory"
                    value={value}
                    tileContent={({ date }) => reservationTile(date)}
                    prev2Label={null}
                    next2Label={null}
                    onChange={onChange}
                    onClickDay={(date) => selectedDateChange(date)}
                    formatDay={(locale, date) => format(date, "dd")}
                    // 달력 상세로 들어가서 특정 월 클릭시 아 여기도 해야함
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
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="flex h-[21.25rem] w-full flex-col items-start gap-[1.5rem] px-6">
            <div className="w-full">
              {/* 예약 스케쥴 버튼 */}
              <div className="flex w-full flex-col gap-[0.875rem] border-b border-solid border-gray-300 pb-4">
                <h3 className="text-2lg font-bold text-primary">
                  예약 가능한 시간
                </h3>
                {/* @TODO 버튼 부무요소의 레이아웃 수정 필요 */}
                <div className="flex flex-wrap gap-3">
                  {availableSchedule.length > 0 ? (
                    availableSchedule.map((item) => (
                      <Button
                        size="sm"
                        color={
                          activeButton !== null && activeButton === item.id
                            ? "dark"
                            : "bright"
                        }
                        onClick={() =>
                          handleOnClick(item.id, item.startTime, item.endTime)
                        }
                        type="button"
                        key={item.id}
                      >
                        {item.startTime}~{item.endTime}
                      </Button>
                    ))
                  ) : (
                    <p>{availableMessage}</p>
                  )}
                </div>
              </div>
              {/* 참여 인원 수 */}
              <div className="flex flex-col gap-2 pt-3">
                <h3 className="text-2lg font-bold text-primary">
                  참여 인원 수
                </h3>
                <div className="flex w-[7.5rem] justify-start rounded-md border border-solid border-[#CDD0DC]">
                  {/** @TODO useFrom 사용해서 데이터 보내기, 현재 리퀘스트의 body에 데이터를 잘못 보내지만 응답은 잘오는중 */}
                  <button
                    type="button"
                    onClick={onMinusClick}
                    className="h-[2.5rem] w-[2.5rem]"
                  >
                    -
                  </button>
                  {/** @TODO useForm을 적용해야 하는 부분*/}

                  <input
                    className="h-[2.5rem] w-[2.5rem] text-center"
                    type="number"
                    value={totalNumber}
                    onChange={onChangeTotalNumber}
                  />

                  <button
                    type="button"
                    onClick={onPlusClick}
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
              className=""
            >
              예약하기
            </Button>
            {/* 총 합계 */}
            <div className="flex w-full items-center justify-between border-t border-solid border-gray-300 pt-4">
              <span className="text-xl font-bold text-primary">총 합계</span>
              <data className="text-xl font-bold text-primary">{`₩ ${totalPrice}`}</data>
            </div>
          </section>
        </form>
      )}
    </>
  );
}
