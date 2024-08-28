"use client";

import React, { useMemo, useState } from "react";
import Slider from "react-slick";
import { Settings } from "react-slick";
import Image from "next/image";
import { block } from "sharp";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./slick.css";
import nextArrow from "@icons/icon_detail_arrow_next.svg";
import prevArrow from "@icons/icon_detail_arrow_prev.svg";

interface SubImages {
  id: number;
  imageUrl: string;
}

interface Images {
  bannerImageUrl: string;
  subImages: SubImages[];
}
/**
 * 슬릭 슬라이더 Props
 * className, 클래스명 입니다
 * style, 인라인 스타일 입니다
 * onClick, 슬릭 슬라이더의 onClick() 입니다
 */
type CustomArrowProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export default function ActivityImageSlider({
  bannerImageUrl,
  subImages,
}: Images) {
  const CustomNextButton: React.FC<CustomArrowProps> = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          cursor: "pointer",
          zIndex: "9999",
          right: "2rem",
          width: "24px",
          height: "47px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        onClick={onClick}
      >
        <div className="flex h-full w-full items-center justify-center rounded bg-black">
          <div className="relative h-3 w-[0.375rem]">
            <Image fill src={nextArrow} alt="다음 버튼" />
          </div>
        </div>
      </div>
    );
  };

  const CustomPrevButton: React.FC<CustomArrowProps> = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          cursor: "pointer",
          zIndex: "9999",
          left: "2rem",
          width: "24px",
          height: "47px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        onClick={onClick}
      >
        <div className="flex h-full w-full items-center justify-center rounded bg-black">
          <div className="relative h-3 w-[0.375rem]">
            <Image fill src={prevArrow} alt="다음 버튼" />
          </div>
        </div>
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <CustomNextButton />,
    prevArrow: <CustomPrevButton />,
  };

  return (
    <div className="h-[19.375rem] w-full overflow-hidden md:relative md:h-[19.375rem] xl:h-[33.375rem]">
      <Slider {...settings}>
        <div className="relative h-[19.375rem] w-full md:h-[19.375rem] xl:h-[33.375rem]">
          <Image
            style={{ objectFit: "cover", borderRadius: "1rem" }}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={bannerImageUrl}
            alt="Main banner image"
          />
        </div>

        {subImages.length !== 0 &&
          subImages.map((image) => (
            <div
              key={image.id}
              className="relative h-[19.375rem] w-full md:h-[19.375rem] xl:h-[33.375rem]"
            >
              <Image
                fill
                style={{ objectFit: "cover", borderRadius: "1rem" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={image.imageUrl}
                alt="서브 이미지"
              />
            </div>
          ))}
      </Slider>
    </div>
  );
}
