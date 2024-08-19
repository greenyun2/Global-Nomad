import Image from "next/image";
import { ReviewsItem } from "../../../types/ActivityDetailTypes";

export default function ReviewCard({
  id,
  user,
  activityId,
  content,
  rating,
  createdAt,
  updatedAt,
}: ReviewsItem) {
  // updatedAt: 2024-08-13T09:47:25.907Z 'T' 를 기준으로 보여줄 시간만 표시합니다
  const userDate = updatedAt.split("T")[0];
  return (
    <li className="flex w-full gap-4 border-b border-solid border-primary border-opacity-25 pb-6">
      {/* 프로필 이미지 부터 반응형 */}
      <div className="relative h-[2.8125rem] w-[2.8125rem]">
        <Image
          sizes=""
          className="rounded-[50%]"
          fill
          src={user.profileImageUrl}
          alt="프로필 이미지"
        />
      </div>
      {/* 이름, 날짜, 리뷰 */}
      <div className="flex w-full flex-col gap-2">
        {/* 이름, 날짜 */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {user.nickname}
          </span>
          <span className="text-md/[1.066875rem] font-normal text-primary">
            |
          </span>
          <span className="text-lg font-normal text-gray-600">{userDate}</span>
        </div>
        {/* 리뷰 글 */}
        <div className="h-auto w-full">
          <p className="text-lg font-normal text-primary">{content}</p>
        </div>
      </div>
    </li>
  );
}
