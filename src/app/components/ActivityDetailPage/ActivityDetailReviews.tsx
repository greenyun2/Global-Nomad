import { ReviewsItem } from "../../../types/ActivityDetailTypes";
import EmptyState from "../EmptyState/EmptyState";
import ActivityIconWrap from "./ActivityIconWrap";
import ReviewCard from "./ReviewCard";

interface ActivityDetailReviewsProps {
  reviews: ReviewsItem[];
  totalCount: number;
  averageRating: number;
}

export default function ActivityDetailReviews({
  reviews,
  totalCount,
  averageRating,
}: ActivityDetailReviewsProps) {
  return (
    <div className="mb-4 flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-[1.125rem] md:gap-6">
        <h2 className="text-xl font-bold text-primary xl:text-2lg">후기</h2>
        <div className="flex gap-4">
          <h1 className="text-averageRating font-semibold text-primary">
            {averageRating}
          </h1>
          <div className="flex flex-col gap-2">
            <p className="text-2lg font-normal text-primary">매우 만족</p>
            <ActivityIconWrap
              iconType="star"
              fontColor="star"
              text={`${totalCount}개 후기`}
            />
          </div>
        </div>
      </div>

      <ul className="mb-10 flex w-full flex-col gap-6 md:mb-[5.625rem] xl:mb-[4.5rem]">
        {reviews.length >= 1 ? (
          reviews.map((item) => <ReviewCard key={item.id} {...item} />)
        ) : (
          <EmptyState>아직 등록된 리뷰가 없어요.</EmptyState>
        )}
      </ul>

      {/* 피이지 네이션 버튼 */}
      <div>
        <button>페이지 네이션 버튼</button>
      </div>
    </div>
  );
}
