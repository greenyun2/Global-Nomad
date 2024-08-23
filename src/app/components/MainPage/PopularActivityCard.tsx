import { ActivityInfo } from "@customTypes/MainPage";
import Image from "next/image";
import Link from "next/link";
import { formatPriceKorean } from "@utils/formatPrice";
import icon_star from "@icons/icon_star_on.svg";

interface PopularActivityCardProps {
  cardData: ActivityInfo;
}
const PopularActivityCard = ({
  cardData: { id, title, price, bannerImageUrl, rating, reviewCount },
}: PopularActivityCardProps) => {
  return (
    <Link href={`/activities/${id}`}>
      <div
        className="aspect-square rounded-3xl bg-cover bg-center"
        style={{
          backgroundImage: `url('${bannerImageUrl}')`,
          objectFit: "cover",
        }}
      >
        <div className="absolute bottom-2 mb-6 ml-5 flex flex-col gap-[6px]">
          <div className="flex gap-1">
            <Image
              src={icon_star}
              alt="star icon"
              style={{ width: 20, height: 20 }}
            />
            <p className="text-lg">
              {rating}
              <span>{` (${reviewCount})`}</span>
            </p>
          </div>
          <div className="max-w-[310px] text-[18px] font-semibold md:text-3xl">
            {title}
          </div>
          <div className="text-lg font-bold md:text-xl">
            {formatPriceKorean(price)}
            <span className="text-lg text-gray-800 md:text-xl"> / 인</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default PopularActivityCard;
