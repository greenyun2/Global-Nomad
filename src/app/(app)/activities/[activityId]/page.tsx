import {
  getActivityDetailList,
  getActivityDetailReviews,
} from "@api/fetchActivityDetail";
import ActivityDetailReviews from "@app/components/ActivityDetailPage/ActivityDetailReviews";
import ActivityHeader from "@app/components/ActivityDetailPage/ActivityHeader";
import ActivityImageSlider from "@app/components/ActivityDetailPage/ActivityImageSlider";
import ActivityKakaoMap from "@app/components/ActivityDetailPage/ActivityKakaoMap";
import ReservationCard from "@app/components/ActivityDetailPage/ReservationCard";
import Image from "next/image";
import locationIcon from "@icons/icon_location.svg";

interface ActivityDetailPageProps {
  params: {
    activityId: string | number;
  };
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const activityId = Number(params.activityId);
  const activityDetailList = await getActivityDetailList({
    activityId,
  });

  const activityDetailReviews = await getActivityDetailReviews({ activityId });

  const {
    category,
    title,
    rating,
    reviewCount,
    address,
    description,
    subImages,
    bannerImageUrl,
    price,
    userId,
  } = activityDetailList;

  const { reviews, totalCount, averageRating } = activityDetailReviews;

  return (
    <div className="container h-[2798px] w-full pt-[4.875rem]">
      <ActivityHeader
        userId={userId}
        category={category}
        title={title}
        rating={rating}
        reviewCount={reviewCount}
        address={address}
      />
      <ActivityImageSlider
        bannerImageUrl={bannerImageUrl}
        subImages={subImages}
      />
      <div className="mb-[2.5rem] flex w-full gap-[0.875rem]">
        <div className="h-[53.8125rem] w-[49.375rem] border-t border-solid border-primary border-opacity-25">
          {/* 체험 설명 */}
          <div className="flex flex-col gap-[1rem] pb-[2.125rem] pt-[2.5rem]">
            <h3 className="text-xl font-bold text-primary">체험 설명</h3>
            <p className="text-lg font-normal text-primary">{description}</p>
          </div>

          {/* 카카오 지도 */}
          <div className="flex h-[29.75rem] w-full flex-col gap-[0.5rem] border-b border-t border-solid border-primary border-opacity-25 py-10">
            <ActivityKakaoMap />
            <div className="flex items-center">
              <Image
                width={18}
                height={18}
                src={locationIcon}
                alt="주소 아이콘"
              />
              <span className="text-base/[1rem] text-primary">{address}</span>
            </div>
          </div>
          {/* 리뷰 */}
          <div className="pt-10">
            <ActivityDetailReviews
              reviews={reviews}
              totalCount={totalCount}
              averageRating={averageRating}
            />
          </div>
        </div>
        {/* 예약 카드 */}
        <ReservationCard price={price} />
      </div>
    </div>
  );
}
