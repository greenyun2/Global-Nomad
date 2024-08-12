import Image from "next/image";
import subImage from "@images/sub_image-4.png";
import starIcon from "@icons/icon_star_on.svg";

// 리뷰 아이템 배열 요소
interface ReviewsItem {}

interface ActivityDetailReviewsProps {
  reviews: [];
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
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-2lg font-bold text-primary">후기</h2>
        <div className="flex gap-4">
          <h1 className="text-[3.125rem] font-semibold text-primary">
            {averageRating}
          </h1>
          <div className="flex flex-col gap-2">
            <p className="text-2lg font-normal text-primary">매우 만족</p>
            <div className="flex items-center gap-1.5">
              <Image width={16} height={16} src={starIcon} alt="별점 아이콘" />
              <span className="text-md font-normal text-black">
                {totalCount}개 후기
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[43.375rem] w-full flex-col gap-[4.5rem]">
        <ul className="flex w-full flex-col gap-6">
          {/**  @TODO 컴포넌트 분리 */}
          <li className="flex w-full gap-4 border-b border-solid border-primary border-opacity-25 pb-6">
            {/* 프로필 이미지 */}
            <div className="relative h-[2.8125rem] w-[2.8125rem]">
              <Image
                className="rounded-[50%]"
                fill
                src={subImage}
                alt="프로필 이미지"
              />
            </div>
            {/* 이름, 날짜, 리뷰 */}
            <div className="flex w-full flex-col gap-2">
              {/* 이름, 날짜 */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">김태현</span>
                <span className="text-md/[1.066875rem] font-normal text-primary">
                  |
                </span>
                <span className="text-lg font-normal text-[#999]">
                  2023. 2. 4
                </span>
              </div>
              {/* 리뷰 글 */}
              <div>
                <p>리뷰 글</p>
              </div>
            </div>
          </li>
        </ul>
        <button>페이지 네이션 버튼</button>
      </div>
    </div>
  );
}
