import { MouseEvent, useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./CategorySlider.css";
import Sort from "./Sort";
import { useDropdown } from "@hooks/useDropdown";
import useOffsetSize from "@hooks/useOffsetSize";
import icon_arrow_next from "@icons/icon_arrow_button.svg";
import icon_arrow_prev from "@icons/icon_arrow_button_prev.svg";
import icon_arrow_filter from "@icons/icon_arrow_filter.svg";

interface CategorySortProps {
  onSetSort: (e: MouseEvent<HTMLButtonElement>) => void;
  onSetCategory: (e: MouseEvent<HTMLButtonElement>) => void;
  currentCategory: string;
}

const CATEGORIES = ["문화 · 예술", "식음료", "스포츠", "투어", "관광", "웰빙"];

const CategorySort = ({
  onSetSort,
  onSetCategory,
  currentCategory,
}: CategorySortProps) => {
  const { ref, isOpen, toggle, close } = useDropdown();
  const changeSize = useOffsetSize(1, 2, 3);
  const [categoryState, setCategoryState] = useState(0);

  const handleButtonClick = (value: number) => {
    const nextCategory = categoryState + value;
    if (nextCategory >= 0 && nextCategory <= changeSize) {
      setCategoryState(nextCategory);
    }
  };

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
    infinite: false,
    slidesToShow: 6,
    slidesToScroll: 3,
    initialSlide: 0,
    nextArrow: (
      <SlickButtonFix>
        <Image src={icon_arrow_next} alt="right arrow" />
      </SlickButtonFix>
    ),
    prevArrow: (
      <SlickButtonFix>
        <Image src={icon_arrow_prev} alt="left arrow" style={{ top: "-2px" }} />
      </SlickButtonFix>
    ),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 786,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
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

  return (
    <div className="flex justify-between gap-3 text-[16px] font-medium md:text-[18px]">
      {/* Category */}
      <div className="w-full overflow-hidden px-5">
        <div className="gap-[8px] md:gap-[14px] xl:gap-[24px]">
          <Slider {...settings}>
            {CATEGORIES.map((category) => (
              <button
                className={`${category === currentCategory ? "bg-primary text-white" : "bg-white text-primary"} h-[41px] shrink-0 whitespace-nowrap rounded-[15px] border border-primary hover:bg-primary hover:text-white md:h-[58px]`}
                key={category}
                value={category}
                onClick={onSetCategory}
              >
                {category}
              </button>
            ))}
          </Slider>
        </div>
      </div>
      {/* Sort */}
      <div ref={ref}>
        <button
          onClick={toggle}
          className="mb-2 flex h-[41px] w-[90px] items-center justify-between rounded-[15px] border border-primary px-[10px] py-[20px] text-primary md:h-[58px] md:w-[120px] md:px-[16px] xl:w-[127px]"
        >
          <p className="text-[14px] text-primary md:text-[18px]">가격</p>
          <Image
            src={icon_arrow_filter}
            alt="arrow icon"
            width={22}
            height={22}
            style={{ width: 22, height: 22 }}
          />
        </button>
        {isOpen && (
          <div onClick={close}>
            <Sort isOpen={isOpen} onSetSort={onSetSort} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySort;
