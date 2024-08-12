"use client";

import React, { ChangeEvent, useState } from "react";
import Calendar from "react-calendar";
import Button from "../Button/Button";
import "./customCalendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReservationCardProps {
  price: number;
}
interface TotalInfo {
  totalPrice: number;
  totalNumber: number;
}

export default function ReservationCard({ price }: ReservationCardProps) {
  const today = new Date();
  const [date, setDate] = useState<Value>(today);

  const [totalInfo, setTotalInfo] = useState<TotalInfo>({
    totalPrice: price,
    totalNumber: 1,
  });

  const handleOnPlus = () => {
    setTotalInfo((prevTotalInfo) => ({
      totalPrice: prevTotalInfo.totalPrice + price,
      totalNumber: prevTotalInfo.totalNumber + 1,
    }));
  };

  const handleOnMinus = () => {
    const { totalNumber } = totalInfo;
    if (totalNumber === 1) return;
    setTotalInfo((prevTotalInfo) => ({
      totalPrice: prevTotalInfo.totalPrice - price,
      totalNumber: prevTotalInfo.totalNumber - 1,
    }));
  };

  return (
    <aside className="mt-[1px] flex h-[46.625rem] w-[24rem] flex-col gap-4 rounded-xl border border-solid border-gray-300 pb-[1.125rem] pt-6 shadow-[0_0.25rem_1rem_0_#1122110D]">
      <section className="flex flex-col gap-4">
        {/* 인당 가격 표시 */}
        <div className="w-full pl-[1.028125rem]">
          <p className="flex items-center gap-[0.3125rem] text-center text-3xl font-bold">
            {`₩ ${price.toLocaleString()}`}
            <span className="text-xl font-normal text-gray-800">/ 인</span>
          </p>
        </div>
        {/* 달력 */}
        <div className="flex justify-center">
          <div className="flex w-[21rem] flex-col gap-4 border-t border-solid border-gray-300 pt-4">
            <h2 className="text-xl/[1.625rem] font-bold text-primary">날짜</h2>
            <div className="flex justify-center">
              <Calendar locale="ko" calendarType="hebrew" value={date} />
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
            <div className="flex gap-3">
              <Button size="md" color="dark" className="">
                14:00~15:00
              </Button>
              <Button size="md" color="bright" className="">
                14:00~15:00
              </Button>
            </div>
          </div>
          {/* 참여 인원 수 */}
          <div className="flex flex-col gap-2 pt-3">
            <h3 className="text-2lg font-bold text-primary">참여 인원 수</h3>
            <div className="flex w-[7.5rem] justify-start rounded-md border border-solid border-[#CDD0DC]">
              <button onClick={handleOnMinus} className="h-[2.5rem] w-[2.5rem]">
                -
              </button>
              <input
                className="h-[2.5rem] w-[2.5rem] text-center"
                type="text"
                value={totalInfo.totalNumber}
              />
              <button onClick={handleOnPlus} className="h-[2.5rem] w-[2.5rem]">
                +
              </button>
            </div>
          </div>
        </div>
        <Button size="lg" color="dark" className="">
          예약하기
        </Button>
        {/* 총 합계 */}
        <div className="flex w-full items-center justify-between border-t border-solid border-gray-300 pt-4">
          <h1 className="text-xl font-bold text-primary">총 합계</h1>
          <p className="text-xl font-bold text-primary">{`₩ ${totalInfo.totalPrice.toLocaleString()}`}</p>
        </div>
      </section>
    </aside>
  );
}
