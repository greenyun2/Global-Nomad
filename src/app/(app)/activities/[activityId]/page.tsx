import {
  getActivityDetailList, // getActivityDetailReviews,
  getActivityDetailSchedule,
} from "@api/fetchActivityDetail";
import { getUserMe } from "@api/user";
import { getUserMeServer } from "@app/apiServer/getUserMeServer";
import ActivityDetailReviews from "@app/components/ActivityDetailPage/ActivityDetailReviews";
import ActivityHeader from "@app/components/ActivityDetailPage/ActivityHeader";
import ActivityIconWrap from "@app/components/ActivityDetailPage/ActivityIconWrap";
import ActivityImageSlider from "@app/components/ActivityDetailPage/ActivityImageSlider";
import ActivityKakaoMap from "@app/components/ActivityDetailPage/ActivityKakaoMap";
import ReservationCard from "@app/components/ActivityDetailPage/ReservationCard";

interface ActivityDetailPageProps {
  params: {
    activityId: string | number;
  };
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
const TODAY_DATE = TODAY.toISOString().split("T").join("").split("-");
const TODAY_YEAR = TODAY_DATE[0];
const TODAY_MONTH = TODAY_DATE[1];

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const activityId = Number(params.activityId);

  const [
    isLoginUserData = null,
    activityDetailList,
    // activityDetailReviews,
    activityDetailSchedules,
  ] = await Promise.all([
    getUserMeServer(),
    getActivityDetailList({
      activityId,
    }),
    // getActivityDetailReviews({ activityId }),
    getActivityDetailSchedule({
      activityId,
      year: TODAY_YEAR,
      month: TODAY_MONTH,
    }),
  ]);

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

  // const { reviews, totalCount, averageRating } = activityDetailReviews;

  return (
    <div className="container h-full w-full pt-4 md:pt-6 xl:pt-[4.875rem]">
      <ActivityHeader
        isLoginUserData={isLoginUserData}
        userId={userId}
        category={category}
        title={title}
        rating={rating}
        reviewCount={reviewCount}
        address={address}
        activityId={activityId}
      />

      <ActivityImageSlider
        bannerImageUrl={bannerImageUrl}
        subImages={subImages}
      />

      <div className="mb-[2.5rem] w-full pt-[0.9375rem] md:flex md:w-full md:gap-[0.875rem] md:pt-8 xl:gap-6 xl:pt-[5.3125rem]">
        <div className="h-full md:w-[49.375rem] md:border-t md:border-solid md:border-primary md:border-opacity-25">
          {/* 체험 설명 */}
          <div className="flex h-auto w-full flex-col gap-[1rem] pb-4 md:pb-[2.125rem] md:pt-[2.5rem]">
            <h3 className="text-xl font-bold text-primary">체험 설명</h3>
            {/* white-spce: pre-line, 워드브레이크 */}
            <p className="whitespace-pre-line break-words text-lg font-normal text-primary text-opacity-75">
              {description}
            </p>
          </div>

          {/* 카카오 지도 */}
          <div className="flex h-[30.125rem] w-full flex-col gap-[0.5rem] border-t border-solid border-primary border-opacity-25 pb-10 pt-4 md:h-[29.75rem] md:w-full md:border-b">
            <ActivityKakaoMap address={address} />
            <ActivityIconWrap
              iconType="location"
              fontColor="location"
              text={address}
            />
          </div>

          {/* 리뷰 */}
          <div className="md:pt-10">
            <ActivityDetailReviews
            // reviews={reviews}
            // totalCount={totalCount}
            // averageRating={averageRating}
            />
          </div>
        </div>
        {/* 예약 카드 */}
        <ReservationCard
          isLoginUserData={isLoginUserData}
          schedules={activityDetailSchedules}
          activityId={activityId}
          price={price}
          userId={userId}
        />
      </div>
    </div>
  );
}
