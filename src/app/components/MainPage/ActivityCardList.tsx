"use client";

import { useCallback, useEffect, useState } from "react";
import { MouseEvent } from "react";
import instance from "@api/axios";
import { ActivityResponse } from "@customTypes/MainPage";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import ActivityCard from "./ActivityCard";
import CategorySort from "./CategorySort";
import Pagination from "./Pagination";
import useOffsetSize from "@hooks/useOffsetSize";

const getActivitiesData = async (
  pageNum: number,
  size: number,
  category?: string,
  sort?: string,
) => {
  const params = new URLSearchParams({
    method: "offset",
    page: String(pageNum + 1),
    size: String(size),
  });
  if (category) params.append("category", category);
  if (sort) params.append("sort", sort);
  const response = await instance.get<ActivityResponse>(
    `/activities?${params}`,
  );
  return response.data;
};

const useActivitiesData = (
  pageNum: number,
  size: number,
  category?: string,
  sort?: string,
) => {
  return useQuery({
    queryKey: ["activities", pageNum, size, category, sort],
    queryFn: () => getActivitiesData(pageNum, size, category, sort),
  });
};

const ActivityCardList = () => {
  const [currentPageNum, setCurrentPageNum] = useState(0); // 현재 페이지 번호
  const [currentCategory, setCurrentCategory] = useState(""); // 현재 카테고리
  const [currentSort, setCurrentSort] = useState(""); // 현재 정렬
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const router = useRouter();
  const currentPageGroup = Math.floor(currentPageNum / 5); // 현재 페이지 그룹 계산
  const currentSize = useOffsetSize(); // 페이지의 데이터 수 - 화면 크기에 따라 결정

  const handlePageNum = (page: number) => {
    setCurrentPageNum(page);
  };

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const sortParam = searchParams.get("sort");
    if (sortParam) setCurrentSort(sortParam);
    if (categoryParam) setCurrentCategory(categoryParam);
    if (pageParam) setCurrentPageNum(Number(pageParam) - 1);
  }, []);

  const setSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
    },
    [searchParams],
  );

  const deleteSearchParams = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
    },
    [searchParams],
  );
  useEffect(() => {
    if (currentSort) setSearchParams("sort", currentSort);
    if (currentCategory) setSearchParams("category", currentCategory);

    setSearchParams("page", String(currentPageNum + 1));
    router.push(`?${searchParams}`);
  }, [
    currentSort,
    currentCategory,
    currentPageNum,
    setSearchParams,
    router,
    searchParams,
  ]);

  const handleSort = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    setCurrentSort(button.value);
    setCurrentPageNum(0);
  };

  const handleCategory = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    if (currentCategory === button.value) {
      setCurrentCategory("");
      deleteSearchParams("category");
    } else {
      setCurrentCategory(button.value);
      setSearchParams("category", button.value);
    }
    setCurrentPageNum(0);
  };

  const { data } = useActivitiesData(
    currentPageNum,
    currentSize,
    currentCategory,
    currentSort,
  );

  const totalCount = data?.totalCount || 0; // activity 데이터에서 totalCount
  const activities = data?.activities || []; // activity 데이터에서 activities

  return (
    <>
      <CategorySort
        onSetSort={handleSort}
        onSetCategory={handleCategory}
        currentCategory={currentCategory}
      />
      <h1 className="my-6 text-[18px] font-bold md:my-8 md:text-[36px]">
        {currentCategory || "🎯모든 체험"}
      </h1>
      <div className="flex flex-col gap-[38px] md:gap-[72px] xl:gap-[64px]">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} cardData={activity} />
          ))}
        </div>
        <div className="mb-[83px] flex items-center justify-center">
          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPageNum}
            totalCount={totalCount}
            offsetLimit={currentSize}
            currentGroup={currentPageGroup}
            setPageNum={handlePageNum}
          />
        </div>
      </div>
    </>
  );
};

export default ActivityCardList;
