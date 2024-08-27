import { MouseEvent, useState } from "react";
import Slider from "react-slick";
import instance from "@api/axios";
import { ActivityResponse } from "@customTypes/MainPage";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import PopularActivityCard from "./PopularActivityCard";
import "./Slider.css";
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
    staleTime: 1000 * 60 * 5,
  });
};

const PopularActivityList = () => {
  const SlickButtonFix = (props: {
    children: JSX.Element;
    slideCount?: number;
    currentSlide?: number;
  }) => {
    const { children, currentSlide, slideCount, ...others } = props;
    return <span {...others}>{children}</span>;
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    nextArrow: (
      <SlickButtonFix>
        <Image src={Arrow_Right} alt="right arrow" />
      </SlickButtonFix>
    ),
    prevArrow: (
      <SlickButtonFix>
        <Image src={Arrow_Left} alt="left arrow" />
      </SlickButtonFix>
    ),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 786,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const { data } = usePopularData();
  const totalCount = data?.totalCount || 0;
  const activities = data?.activities || [];
  const popularActivities = activities.slice(0, 6);
  const [color, setColor] = useState("bright");
  const handleTextColor = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    setColor(button.value);
  };
  return (
    <div className="md:mb-15 mb-10 mt-32 md:mt-40">
      <div className="flex justify-between">
        <h1 className="mb-4 text-[18px] font-bold md:mb-8 md:text-[36px]">
          🔥인기 체험
        </h1>
        <div className="flex gap-2">
          <button
            value={"bright"}
            onClick={handleTextColor}
            className="h-5 w-5 rounded-lg border-2 border-primary bg-white text-md font-bold text-primary md:h-10 md:w-10 md:text-2xl"
          >
            T
          </button>
          <button
            value={"dark"}
            onClick={handleTextColor}
            className="h-5 w-5 rounded-lg border-2 border-primary bg-primary text-md font-bold text-white md:h-10 md:w-10 md:text-2xl"
          >
            T
          </button>
        </div>
      </div>
      <div
        className={`slider-css container ${color === "bright" ? "text-white" : "text-primary"}`}
      >
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
