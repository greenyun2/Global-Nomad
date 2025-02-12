"use client";

import { useCallback, useState, useEffect } from "react";
import { MouseEvent } from "react";
import instance from "@api/axios";
import { ActivityResponse } from "@customTypes/MainPage";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import EmptyState from "../EmptyState/EmptyState";
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
    page: String(pageNum),
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
    staleTime: 1000 * 60 * 5,
  });
};

const ActivityCardList = () => {
  const [currentPageNum, setCurrentPageNum] = useState(1); // 현재 페이지 번호
  const [currentCategory, setCurrentCategory] = useState(""); // 현재 카테고리
  const [currentSort, setCurrentSort] = useState(""); // 현재 정렬
  const currentPageGroup = Math.floor(currentPageNum / 5); // 현재 페이지 그룹 계산
  const currentSize = useOffsetSize(); // 페이지의 데이터 수 - 화면 크기에 따라 결정
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handlePageNum = (pageNum: number) => {
    setCurrentPageNum(pageNum);
    router.push(pathname + "?" + createQueryString("page", String(pageNum)), {
      scroll: false,
    });
  };

  const handleSort = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    setCurrentSort(button.value);
    const query = new URLSearchParams({
      page: "1",
      sort: button.value,
      category: currentCategory,
    });
    router.push(`/?${query}`, {
      scroll: false,
    });
    setCurrentPageNum(1);
  };

  const handleCategory = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    if (currentCategory === button.value) {
      setCurrentCategory("");
      router.replace(pathname, { scroll: false });
    } else {
      setCurrentCategory(button.value);
      const query = new URLSearchParams({
        page: "1",
        sort: currentSort,
        category: button.value,
      });
      router.push(`/?${query}`, { scroll: false });
    }
    setCurrentPageNum(1);
  };
  useEffect(() => {
    const sort = searchParams.get("sort");
    const page = searchParams.get("page");
    const category = searchParams.get("category");

    setCurrentSort(sort || "");
    setCurrentPageNum(Number(page) || 1);
    setCurrentCategory(category || "");
  }, [searchParams]);
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
        {totalCount === 0 ? (
          <EmptyState>등록된 체험이 없습니다.</EmptyState>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} cardData={activity} />
            ))}
          </div>
        )}

        <div className="mb-[83px] flex items-center justify-center">
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
