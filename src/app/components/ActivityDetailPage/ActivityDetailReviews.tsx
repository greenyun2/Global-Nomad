"use client";

import { useState } from "react";
import instance from "@api/axios";
// import { getActivityDetailReviews } from "@api/fetchActivityDetail";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { ReviewsItem } from "../../../types/ActivityDetailTypes";
import EmptyState from "../EmptyState/EmptyState";
import Pagination from "../MainPage/Pagination";
import ActivityIconWrap from "./ActivityIconWrap";
import ReviewCard from "./ReviewCard";
import { getRatingEvaluation } from "@utils/getRatingEvaluation";

interface ActivityDetailReviewsProps {
  reviews: ReviewsItem[];
  totalCount: number;
  averageRating: number;
}

const getActivityReviews = async (
  activityId: number,
  page: number,
  size: number,
) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  const response = await instance.get<ActivityDetailReviewsProps>(
    `/activities/${activityId}/reviews?${params}`,
  );
  return response.data;
};
const useActivityReviews = (activityId: number, page: number, size: number) => {
  return useQuery({
    queryKey: ["reviews", activityId, page, size],
    queryFn: () => getActivityReviews(activityId, page, size),
  });
};

export default function ActivityDetailReviews() {
  const [currentPageNum, setCurrentPageNum] = useState(0); // 현재 페이지 번호
  const currentPageGroup = Math.floor(currentPageNum / 5); // 현재 페이지 그룹 계산
  const currentSize = 3; // 페이지의 데이터 수
  const router = useRouter();
  const pathname = usePathname();
  const handlePageNum = (page: number) => {
    setCurrentPageNum(page);
    router.push(pathname + `/reviews?page=${page + 1}`);
  };
  const activityId = Number(pathname.slice(12));

  const { data } = useActivityReviews(
    activityId,
    currentPageNum + 1,
    currentSize,
  );
  const rating = data?.averageRating || 0;
  const activityReviews = data?.reviews || [];
  const total = data?.totalCount || 0;
  return (
    <div className="mb-4 flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-[1.125rem] md:gap-6">
        <h3 className="text-xl font-bold text-primary xl:text-2lg">후기</h3>
        <div className="flex gap-4">
          <data className="text-averageRating font-semibold text-primary">
            {rating.toFixed(1)}
          </data>
          <div className="flex flex-col gap-2">
            <span className="text-2lg font-normal text-primary">
              {getRatingEvaluation(rating)}
            </span>
            <ActivityIconWrap
              iconType="star"
              fontColor="star"
              text={`${total}개 후기`}
            />
          </div>
        </div>
      </div>

      <ul className="mb-10 flex w-full flex-col gap-6 md:mb-[5.625rem] xl:mb-[4.5rem]">
        {activityReviews.length >= 1 ? (
          activityReviews.map((item) => <ReviewCard key={item.id} {...item} />)
        ) : (
          <EmptyState>아직 등록된 리뷰가 없어요.</EmptyState>
        )}
      </ul>

      <div className="flex h-[55px] w-full items-center justify-center gap-[10px]">
        <Pagination
          totalCount={total}
          currentPage={currentPageNum}
          offsetLimit={currentSize}
          currentGroup={currentPageGroup}
          setPageNum={handlePageNum}
        />
      </div>
    </div>
  );
}
