import ActivityHeaderKebabMenu from "./ActivityHeaderKebabMenu";
import ActivityIconWrap from "./ActivityIconWrap";

interface ActivityHeaderProps {
  userId: number;
  category: string;
  title: string;
  rating: number;
  reviewCount: number;
  address: string;
  activityId: number;
  isLoginUserData: User | null;
}

type User = {
  id: number;
  email: string;
  nickname?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export default function ActivityHeader({
  category,
  title,
  rating,
  reviewCount,
  address,
  userId,
  activityId,
  isLoginUserData,
}: ActivityHeaderProps) {
  /**
   * @TODO 이미지, 텍스트 반복되는 부분 컴포넌트로 분리
   * p 태그 span or data 태그
   * 주소는 adress 태그
   * SEO에 맞게 태그 변경
   */
  return (
    <header className="mb-4 flex h-[6.625rem] justify-between md:mb-[0.9375rem] xl:mb-[1.5625rem]">
      <div className="flex h-full w-[18.25rem] flex-col justify-between md:w-[24.375rem]">
        {/* span or data */}
        <data className="text-md font-regular text-primary">{category}</data>
        <div className="flex h-[4.5rem] w-full flex-col gap-4 md:h-[5.125rem]">
          {/* white-space: nowrap title 스타일 수정 */}
          <h2 className="whitespace-nowrap text-2xl font-bold text-primary md:text-3xl">
            {title}
          </h2>
          <div className="flex items-center gap-[0.75rem]">
            <ActivityIconWrap
              iconType="star"
              fontColor="star"
              text={`${rating.toFixed(1)} (${reviewCount})`}
            />
            <ActivityIconWrap
              iconType="location"
              fontColor="location"
              text={address}
            />
          </div>
        </div>
      </div>
      {/* 케밥 메뉴 영역 */}
      {isLoginUserData?.id === userId && (
        <ActivityHeaderKebabMenu activityId={activityId} />
      )}
    </header>
  );
}
