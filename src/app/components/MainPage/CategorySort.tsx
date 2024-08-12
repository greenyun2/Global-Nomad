import { MouseEvent } from "react";
import Image from "next/image";
import Sort from "./Sort";
import { useDropdown } from "@hooks/useDropdown";
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

  return (
    <div className="flex justify-between text-[16px] font-medium md:text-[18px]">
      {/* Category */}
      <div className="flex gap-[8px] md:gap-[14px] xl:gap-[24px]">
        {CATEGORIES.map((category) => (
          <button
            className={`${category === currentCategory ? "bg-primary text-white" : "bg-white text-primary"} h-[41px] w-[80px] rounded-[15px] border border-primary hover:bg-primary hover:text-white md:h-[58px] md:w-[120px] xl:w-[127px]`}
            key={category}
            value={category}
            onClick={onSetCategory}
          >
            {category}
          </button>
        ))}
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
