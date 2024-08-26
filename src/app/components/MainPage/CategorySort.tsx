import { MouseEvent, useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  const categoryRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = (value: number) => {
    const nextCategory = categoryState + value;
    if (nextCategory >= 0 && nextCategory <= changeSize) {
      setCategoryState(nextCategory);
    }
  };
  useEffect(() => {
    if (categoryRef.current !== null) {
      categoryRef.current.style.transition = "all 0.5s ease-in-out";
      categoryRef.current.style.transform = `translateX(-${categoryState * 50}%)`;
    }
  }, [categoryState, changeSize]);

  return (
    <div className="flex justify-between text-[16px] font-medium md:text-[18px]">
      {/* Category */}
      <div className="flex overflow-hidden">
        {categoryState !== 0 && (
          <button
            className="z-10 flex shrink-0 items-center"
            onClick={() => handleButtonClick(-1)}
          >
            <Image
              src={icon_arrow_prev}
              alt="arrow prev"
              width={42}
              height={42}
              style={{ width: 42, height: 42 }}
            />
          </button>
        )}
        <div
          ref={categoryRef}
          className="flex gap-[8px] overflow-hidden md:gap-[14px] xl:gap-[24px]"
        >
          {CATEGORIES.map((category) => (
            <button
              className={`${category === currentCategory ? "bg-primary text-white" : "bg-white text-primary"} h-[41px] w-[100px] shrink-0 rounded-[15px] border border-primary hover:bg-primary hover:text-white md:h-[58px] md:w-[120px] xl:w-[127px]`}
              key={category}
              value={category}
              onClick={onSetCategory}
            >
              {category}
            </button>
          ))}
        </div>
        {categoryState < changeSize && (
          <button
            className="flex shrink-0 items-center"
            onClick={() => handleButtonClick(1)}
          >
            <Image
              src={icon_arrow_next}
              alt="arrow next"
              width={42}
              height={42}
              style={{ width: 42, height: 42 }}
            />
          </button>
        )}
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
