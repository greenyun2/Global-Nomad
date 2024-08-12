import Slider from "react-slick";
import instance from "@api/axios";
import { ActivityResponse } from "@customTypes/MainPage";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import PopularActivityCard from "./PopularActivityCard";
import Arrow_Left from "@icons/icon_arrow_left_on_44px.svg";
import Arrow_Right from "@icons/icon_arrow_right_on_44px.svg";

const getPopularData = async () => {
  const params = new URLSearchParams({
    method: "offset",
    sort: "most_reviewed",
    page: String(1),
    size: String(10),
  });
  const response = await instance.get<ActivityResponse>(
    `/activities?${params}`,
  );
  return response.data;
};
const usePopularData = () => {
  return useQuery({
    queryKey: ["popularActivities"],
    queryFn: () => getPopularData(),
  });
};

const PopularActivityList = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    nextArrow: <Image src={Arrow_Right} alt="right arrow" />,
    prevArrow: <Image src={Arrow_Left} alt="legt arrow" />,
  };
  const { data } = usePopularData();
  const totalCount = data?.totalCount || 0;
  const activities = data?.activities || [];
  const popularActivities = activities.slice(0, 6);
  return (
    <div className="md:mb-15 mb-10">
      <h1 className="mb-4 text-[18px] font-bold md:mb-8 md:text-[36px]">
        🔥인기 체험
      </h1>
      <div>
        <Slider {...settings}>
          {popularActivities.map((activity) => (
            <PopularActivityCard key={activity.id} cardData={activity} />
          ))}
        </Slider>
      </div>
    </div>
  );
};
export default PopularActivityList;
