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
        <div className="absolute bottom-2 mb-3 ml-2 flex flex-col gap-[6px] xl:mb-6 xl:ml-5">
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
          <div className="max-w-[140px] text-[18px] font-semibold md:max-w-[240px] md:text-2xl xl:text-3xl">
            {title}
          </div>
          <div className="text-lg font-bold md:text-xl">
            {formatPriceKorean(price)}
            <span className="text-lg md:text-xl"> / 인</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default PopularActivityCard;
