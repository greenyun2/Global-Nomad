import React, { ForwardedRef, forwardRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import instance from "@api/axios";
import { ReservationData } from "@api/myReservation";
import Button from "@app/components/Button/Button";
import BasicInput from "@app/components/Input/BasicInput";
import Modal from "@app/components/Modal/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { z } from "zod";
import { formatPriceKorean } from "@utils/formatPrice";
import star_icon_off from "@icons/icon_star_off.svg";
import star_icon_on from "@icons/icon_star_on.svg";
import close_icon from "@icons/icon_x_40px.svg";

type ReservationReviewModalProps = {
  cardData: ReservationData;
  toggle: () => void;
};

const activityReviewSchema = z.object({
  content: z.string(),
  rating: z.number(),
});

type TActivityReviewSchema = z.infer<typeof activityReviewSchema>;

const ratings = [1, 2, 3, 4, 5];

export const ReservationReviewModal = forwardRef<
  HTMLDivElement,
  ReservationReviewModalProps
>(
  (
    { cardData, toggle: toggleReviewModal },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [rating, setRating] = useState<number>(0);
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: async (formData: TActivityReviewSchema) => {
        const response = await instance.post(
          `/my-reservations/${cardData.id}/reviews`,
          formData,
        );
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["my-reservations"],
        });
        queryClient.invalidateQueries({
          queryKey: ["reviews"],
        });
        toggleReviewModal();
        toast.success("후기가 정상적으로 등록됐습니다.");
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage = axiosError.response?.data?.message;
        if (errorMessage) {
          toast.error(errorMessage);
        }
        console.error("Error submitting review:", error);
      },
    });

    const handleReviewSubmit = async (formData: TActivityReviewSchema) => {
      mutation.mutate(formData);
    };

    const { control, setValue, handleSubmit } = useForm<TActivityReviewSchema>({
      mode: "onSubmit",
    });

    return (
      <Modal className="md:max-w-[480px]" ref={ref}>
        <div className="fixed inset-0 flex flex-col bg-white p-[23px] pb-[41px] md:static">
          <section className="flex w-full justify-between text-[28px] font-bold text-black md:text-2xl">
            <h1>후기 작성</h1>
            <Image
              src={close_icon}
              alt="close_icon"
              width={30}
              height={30}
              onClick={() => toggleReviewModal()}
              className="cursor-pointer"
            />
          </section>
          <section className="mt-[41px] flex flex-col gap-[24px]">
            <ReservationCardSmall cardData={cardData} />
            <form
              onSubmit={handleSubmit(handleReviewSubmit)}
              className="flex flex-col gap-[24px]"
            >
              <ul className="flex justify-center gap-[10px] py-[24px]">
                {ratings.map((star, index) => (
                  <li key={index}>
                    <Image
                      src={
                        star <= rating
                          ? star_icon_on
                          : star_icon_off || star_icon_off
                      }
                      alt="star-icon"
                      onClick={() => {
                        setRating(star);
                        setValue("rating", star);
                      }}
                      className="h-auto w-auto cursor-pointer"
                      width={52}
                      height={49}
                    />
                  </li>
                ))}
              </ul>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <BasicInput
                    type="textarea"
                    placeholder="후기를 작성해주세요"
                    className="h-[240px] overflow-y-scroll border-[#79747E] placeholder-[#999999]"
                    id="content"
                    onChange={field.onChange}
                  />
                )}
              />
              <Button
                color="dark"
                size="lg"
                className="bg-[#112211]"
                type="submit"
              >
                작성하기
              </Button>
            </form>
          </section>
        </div>
      </Modal>
    );
  },
);

ReservationReviewModal.displayName = "ReservationReviewModal";

export default ReservationReviewModal;

function ReservationCardSmall({ cardData }: { cardData: ReservationData }) {
  return (
    <div className="flex gap-[8px] md:gap-[24px]">
      <div className="w-[100px] md:w-[126px]">
        <Image
          src={cardData.activity.bannerImageUrl}
          alt="banner-Image"
          className="aspect-square rounded-[12px]"
          width={126}
          height={126}
        />
      </div>
      <section className="flex flex-col justify-between text-primary">
        <div className="text-lg font-bold md:text-xl">
          {cardData.activity.title}
        </div>
        <div className="flex gap-[2px] text-md font-normal md:gap-2 md:text-[18px]">
          <div>{cardData.date}</div>
          <div>·</div>
          <div>{cardData.startTime}</div>
          <div>·</div>
          <div>{cardData.endTime}</div>
          <div>·</div>
          <div>{cardData.headCount}명</div>
        </div>
        <div className="text-xl font-bold md:text-3xl">
          {formatPriceKorean(cardData.totalPrice / cardData.headCount)}
        </div>
      </section>
    </div>
  );
}
