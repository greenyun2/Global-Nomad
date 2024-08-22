import {
  getActivityDetailList,
  getActivityDetailReviews,
  getActivityDetailSchedule,
} from "@api/fetchActivityDetail";
import { getUserMe } from "@api/user";
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

const TODAY = new Date();
const TODAY_DATE = TODAY.toISOString().split("T").join("").split("-");
const TODAY_YEAR = TODAY_DATE[0];
const TODAY_MONTH = TODAY_DATE[1];

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const activityId = Number(params.activityId);

  const [activityDetailList, activityDetailReviews, activityDetailSchedules] =
    await Promise.all([
      getActivityDetailList({
        activityId,
      }),
      getActivityDetailReviews({ activityId }),
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

  const { reviews, totalCount, averageRating } = activityDetailReviews;

  /**
   * 태그 SEO 신경써야함
   * h1 => h2태그, h3태그로 변경 SEO 신경쓰기
   * p 태그 span or data 태그
   * 주소는 adress 태그
   * SEO에 맞게 태그 변경
   * p태그는 소개글일때만
   * 예약카드는 form 태그에, 가격은 span or data
   * 버튼은 타입=버튼,
   * 총합계 = h1 x
   * 메타 태그
   *
   * 급한 부분
   * 예약하기에 대한 기능 구현이 가장 급함
   */

  return (
    <div className="container h-full w-full pt-4 md:pt-6 xl:pt-[4.875rem]">
      <ActivityHeader
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
            <p className="text-lg font-normal text-primary text-opacity-75">
              {description}
            </p>
          </div>

          {/* 카카오 지도 */}
          <div className="flex h-[30.125rem] w-full flex-col gap-[0.5rem] border-t border-solid border-primary border-opacity-25 pb-10 pt-4 md:h-[29.75rem] md:w-full md:border-b">
            <ActivityKakaoMap />
            <ActivityIconWrap
              iconType="location"
              fontColor="location"
              text={address}
            />
          </div>

          {/* 리뷰 */}
          <div className="md:pt-10">
            <ActivityDetailReviews
              reviews={reviews}
              totalCount={totalCount}
              averageRating={averageRating}
            />
          </div>
        </div>
        {/* 예약 카드 */}
        <ReservationCard
          schedules={activityDetailSchedules}
          activityId={activityId}
          price={price}
          userId={userId}
        />
      </div>
    </div>
  );
}
