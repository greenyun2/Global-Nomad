// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Calendar from "react-calendar";
// import {
//   useForm,
//   Controller,
//   SubmitHandler,
//   FieldValues,
// } from "react-hook-form";
// import {
//   getActivityDetailSchedule,
//   postApplicationReservation,
// } from "@api/fetchActivityDetail";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { format } from "date-fns";
// import Button from "../Button/Button";
// import Modal from "../Modal/Modal";
// import "./customCalendar.css";

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

// interface ReservationCardProps {
//   price: number | string;
//   userId: number;
//   onPlusClick: () => void;
//   onMinusClick: () => void;
//   onChangeTotalNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   totalPrice: number | string;
//   totalNumber: number;
//   schedules: Schedules[];
//   activityId: number;
//   isLoginUserData: User | null;
// }

// interface Schedules {
//   id: number;
//   date: string;
//   times: Times[];
// }

// interface Times {
//   id: number;
//   date: string;
//   startTime: string;
//   endTime: string;
// }

// type User = {
//   id: number;
//   email: string;
//   nickname?: string;
//   profileImageUrl?: string;
//   createdAt: string;
//   updatedAt: string;
// };

// const TODAY = new Date();

// interface FormData extends FieldValues {
//   name?: string;
//   email?: string;
//   message?: string;
//   scheduleId: number;
//   headCount: number;
// }

// interface ReservationState {
//   value: Value;
//   scheduleId: number;
//   isModal: boolean;
//   isDisabled: boolean;
//   message: string | null;
//   selectedTime: string;
//   availableMessage: string;
//   monthSchedule: { year: string; month: string };
//   scheduleData: Schedules[];
//   activeDate: Date;
//   activeButton: number | null;
//   buttonClick: boolean;
//   availableSchedule: Times[];
// }

// interface QueryData {
//   data: Schedules[];
//   isSuccess: boolean;
// }

// export default function ReservationCardStateTest({
//   price,
//   userId,
//   onPlusClick,
//   onMinusClick,
//   onChangeTotalNumber,
//   totalNumber,
//   totalPrice,
//   schedules,
//   activityId,
//   isLoginUserData,
// }: ReservationCardProps) {
//   const formatDate = format(new Date(), "yyyy-MM-dd");
//   const formatYearDate = format(formatDate, "yyyy");
//   const formatMonthDate = format(formatDate, "MM");

//   const [reservationState, setReservationState] = useState<ReservationState>({
//     value: TODAY,
//     scheduleId: 0,
//     isModal: false,
//     isDisabled: true,
//     message: null,
//     selectedTime: "",
//     availableMessage: "날짜를 선택해주세요!",
//     monthSchedule: { year: formatYearDate, month: formatMonthDate },
//     scheduleData: schedules,
//     activeDate: TODAY,
//     activeButton: null,
//     buttonClick: false,
//     availableSchedule: schedules
//       .filter((schedule) => schedule.date === formatDate)
//       .flatMap((scheduleTimes) => scheduleTimes.times.map((time) => time)),
//   });

//   const modalRef = useRef(null);
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: postApplicationReservation,
//     onSuccess: () => {
//       setReservationState((prevState) => ({
//         ...prevState,
//         isModal: true,
//         message: `${prevState.selectedTime}시간에 ${totalNumber}명 예약이 완료됐습니다.`,
//       }));
//       queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
//     },
//     onError: (error) => {
//       setReservationState((prevState) => ({
//         ...prevState,
//         isModal: true,
//         message: `${error}`,
//       }));
//     },
//   });

//   const selectedDateChange = (date: Value) => {
//     if (date instanceof Date) {
//       const selectedDate = format(date, "yyyy-MM-dd");
//       const filterSchedule = reservationState.scheduleData
//         .filter((schedule) => schedule.date === selectedDate)
//         .flatMap((scheduleTimes) => scheduleTimes.times.map((time) => time));

//       setReservationState((prevState) => ({
//         ...prevState,
//         availableSchedule: filterSchedule,
//         availableMessage:
//           filterSchedule.length === 0
//             ? "예약 가능한 날짜가 없습니다."
//             : prevState.availableMessage,
//       }));
//     }
//   };

//   const handleOnModalClick = () => {
//     setReservationState((prevState) => ({
//       ...prevState,
//       isModal: !prevState.isModal,
//     }));
//   };

//   const handlePostSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (isLoginUserData?.id === null) {
//       setReservationState((prevState) => ({
//         ...prevState,
//         isModal: true,
//         isDisabled: true,
//       }));
//       return;
//     }
//     mutation.mutate({
//       activityId,
//       scheduleId: reservationState.scheduleId,
//       headCount: totalNumber,
//     });
//     setReservationState((prevState) => ({
//       ...prevState,
//       isDisabled: true,
//     }));
//   };

//   const handleOnClick = (
//     timeId: number,
//     startTime: string,
//     endTime: string,
//   ) => {
//     setReservationState((prevState) => ({
//       ...prevState,
//       buttonClick: true,
//       activeButton:
//         timeId !== prevState.activeButton ? timeId : prevState.activeButton,
//       scheduleId: timeId !== prevState.activeButton ? timeId : 0,
//       selectedTime:
//         timeId !== prevState.activeButton ? `${startTime}~${endTime}` : "",
//       isDisabled: timeId === prevState.activeButton,
//     }));
//   };

//   const handleOnActiveDateChange = (
//     action: string,
//     value: Value,
//     activeStartDate: Date | null,
//   ) => {
//     if (action === "next" || action === "prev") {
//       setReservationState((prevState) => ({
//         ...prevState,
//         isDisabled: true,
//       }));
//       if (value instanceof Date && activeStartDate instanceof Date) {
//         const changeYear = format(activeStartDate, "yyyy");
//         const changeMonth = format(activeStartDate, "MM");
//         setReservationState((prevState) => ({
//           ...prevState,
//           monthSchedule: { year: changeYear, month: changeMonth },
//           activeDate: activeStartDate,
//           availableMessage:
//             activeStartDate !== prevState.activeDate
//               ? "날짜를 선택해주세요!"
//               : prevState.availableMessage,
//         }));
//       }
//     }
//   };

//   const handleOnClickViewMonth = (month: Date) => {
//     const selectedYear = format(month, "yyyy");
//     const selectedMonth = format(month, "MM");
//     setReservationState((prevState) => ({
//       ...prevState,
//       activeDate: month,
//       monthSchedule: { year: selectedYear, month: selectedMonth },
//     }));
//   };

//   const { year, month } = reservationState.monthSchedule;
//   const { data, isSuccess } = useQuery<Schedules[], unknown>({
//     queryKey: ["availableSchedule", activityId, year, month],
//     queryFn: () => getActivityDetailSchedule({ activityId, year, month }),
//   });

//   useEffect(() => {
//     if (isSuccess) {
//       setReservationState((prevState) => ({
//         ...prevState,
//         scheduleData: data,
//         availableSchedule: data
//           .filter(
//             (item) =>
//               format(item.date, "yyyy-MM") ===
//               format(prevState.activeDate, "yyyy-MM"),
//           )
//           .flatMap((item) => item.times.map((time) => time)),
//       }));
//     }
//   }, [data, isSuccess]);

//   const reservationTile = (date: Date) => {
//     let tile;
//     if (date instanceof Date) {
//       const formatDate = format(date, "yyyy-MM-dd");
//       reservationState.scheduleData.forEach((item) => {
//         item.date === formatDate
//           ? (tile = (
//               <div className="mx-auto h-1 w-1 rounded-full bg-blue-300"></div>
//             ))
//           : null;
//       });
//     }
//     return tile;
//   };

//   return (
//     <>
//       {reservationState.isModal && (
//         <Modal ref={modalRef}>
//           <div className="relative flex h-[250px] flex-col items-center justify-center">
//             <div>
//               <p className="flex items-center justify-center text-2lg font-medium text-[#333236]">
//                 {isLoginUserData?.id ? (
//                   <span>{reservationState.message}</span>
//                 ) : (
//                   "로그인후 예약 신청해주세요"
//                 )}
//               </p>
//             </div>
//             <div className="absolute bottom-7 right-7 flex justify-end">
//               <Button
//                 type="button"
//                 onClick={handleOnModalClick}
//                 size="md"
//                 color="dark"
//               >
//                 확인
//               </Button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {isLoginUserData?.id !== userId && (
//         <form
//           onSubmit={handlePostSubmit}
//           className="mt-[1px] flex h-[46.625rem] w-full max-w-[34.25rem] flex-col rounded-[0.625rem] border border-solid border-[#ececed] bg-white"
//         >
//           {/* 예약신청 */}
//           <div className="flex justify-between p-6">
//             <h3 className="text-lg font-bold leading-5 text-[#333236]">
//               예약신청
//             </h3>
//             <div className="flex items-center text-base leading-5 text-[#333236]">
//               <div className="mr-[0.875rem] font-bold">{price} 원</div>
//               <div className="font-normal"> /인</div>
//             </div>
//           </div>
//           <div className="mx-6 h-0.5 bg-[#ececed]" />

//           {/* 달력 */}
//           <div className="relative p-6">
//             <Calendar
//               formatDay={(locale, date) =>
//                 date.toLocaleString("en", { day: "numeric" })
//               }
//               minDetail="month"
//               minDate={new Date()}
//               showNeighboringMonth={false}
//               tileContent={({ date }) => reservationTile(date)}
//               onChange={selectedDateChange}
//               next2Label={null}
//               prev2Label={null}
//               value={reservationState.value}
//               onActiveStartDateChange={({ action, value, activeStartDate }) =>
//                 handleOnActiveDateChange(action, value, activeStartDate)
//               }
//               onClickMonth={handleOnClickViewMonth}
//               tileDisabled={({ date, view }) =>
//                 view !== "year" &&
//                 date.getTime() < new Date().setHours(0, 0, 0, 0)
//               }
//             />
//           </div>
//           <div className="mx-6 h-0.5 bg-[#ececed]" />

//           {/* 인원수 */}
//           <div className="flex p-6">
//             <h3 className="mr-[1.875rem] text-lg font-bold leading-5 text-[#333236]">
//               인원
//             </h3>
//             <div className="flex w-full items-center justify-between border border-solid border-[#d7d8dc]">
//               <button
//                 type="button"
//                 onClick={onMinusClick}
//                 className="flex h-[2.875rem] w-[2.875rem] items-center justify-center text-lg text-[#333236] disabled:text-[#D7D8DC]"
//               >
//                 <span className="sr-only">minus</span>
//                 <span className="inline-block align-middle">-</span>
//               </button>
//               <input
//                 type="number"
//                 onChange={onChangeTotalNumber}
//                 value={totalNumber}
//                 className="flex-1 text-center text-lg font-medium leading-5 text-[#333236]"
//                 disabled
//               />
//               <button
//                 type="button"
//                 onClick={onPlusClick}
//                 className="flex h-[2.875rem] w-[2.875rem] items-center justify-center text-lg text-[#333236]"
//               >
//                 <span className="sr-only">plus</span>
//                 <span className="inline-block align-middle">+</span>
//               </button>
//             </div>
//           </div>

//           <div className="mx-6 h-0.5 bg-[#ececed]" />

//           {/* 시간 */}
//           <div className="flex p-6">
//             <h3 className="mr-[1.875rem] text-lg font-bold leading-5 text-[#333236]">
//               시간
//             </h3>
//             <div className="grid grid-cols-2 gap-2">
//               {reservationState.availableSchedule.length !== 0
//                 ? reservationState.availableSchedule.map((item) => (
//                     <button
//                       key={item.id}
//                       type="button"
//                       className={`${
//                         reservationState.activeButton === item.id
//                           ? "border-1 bg-gray-800 text-white"
//                           : "border border-[#d7d8dc] bg-white"
//                       } flex h-[2.875rem] w-[8.25rem] items-center justify-center rounded border-solid`}
//                       onClick={() =>
//                         handleOnClick(item.id, item.startTime, item.endTime)
//                       }
//                     >
//                       {`${item.startTime}~${item.endTime}`}
//                     </button>
//                   ))
//                 : reservationState.availableMessage}
//             </div>
//           </div>
//           <div className="mx-6 h-0.5 bg-[#ececed]" />
//           <div className="flex items-center justify-between p-6">
//             <div className="text-lg font-bold leading-5 text-[#333236]">
//               총 결제금액{" "}
//               <span className="text-[#4a96f0]">
//                 {reservationState.buttonClick ? totalPrice : 0}
//               </span>
//               원
//             </div>
//             <Button
//               type="submit"
//               size="lg"
//               color="dark"
//               disabled={reservationState.isDisabled}
//             >
//               예약하기
//             </Button>
//           </div>
//         </form>
//       )}
//     </>
//   );
// }
