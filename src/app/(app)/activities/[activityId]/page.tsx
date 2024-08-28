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
import type { Metadata, ResolvingMetadata } from "next";

interface ActivityDetailPageProps {
  params: {
    activityId: string | number;
  };
}

const TODAY = new Date();
const TODAY_DATE = TODAY.toISOString().split("T").join("").split("-");
const TODAY_YEAR = TODAY_DATE[0];
const TODAY_MONTH = TODAY_DATE[1];

// 동적 메타 데이터 설정
export async function generateMetadata(
  { params }: ActivityDetailPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const activityId = Number(params.activityId);

  const product = await getActivityDetailList({ activityId });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.title} | globalNomad`,
    description: product.description,
    openGraph: {
      images: [product.bannerImageUrl, ...previousImages],
    },
  };
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const activityId = Number(params.activityId);

  const [isLoginUserData, activityDetailList, activityDetailSchedules] =
    await Promise.all([
      getUserMeServer(),
      getActivityDetailList({
        activityId,
      }),
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

      <div className="mb-[2.5rem] pt-[0.9375rem] md:flex md:w-full md:items-start md:justify-start md:gap-[0.875rem] md:pt-8 xl:gap-6 xl:pt-[5.3125rem]">
        <div className="h-full md:w-full md:border-t md:border-solid md:border-primary md:border-opacity-25">
          {/* 체험 설명 */}
          <div className="flex h-auto w-full flex-col gap-[1rem] pb-4 md:pb-[2.125rem] md:pt-[2.5rem]">
            <h3 className="text-xl font-bold text-primary">체험 설명</h3>
            {/* white-spce: pre-line, 워드브레이크 */}
            <p className="whitespace-pre-line break-words text-lg font-normal text-primary text-opacity-75">
              {description}
            </p>
          </div>

          {/* 카카오 지도 */}
          <div className="flex w-full flex-col gap-[0.5rem] border-t border-solid border-primary border-opacity-25 pb-10 pt-4 md:border-b">
            <ActivityKakaoMap address={address} />
            <ActivityIconWrap
              iconType="location"
              fontColor="location"
              text={address}
            />
          </div>
          {/* 리뷰 */}
          <div className="md:pt-10">
            <ActivityDetailReviews />
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
