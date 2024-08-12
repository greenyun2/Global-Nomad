"use client";

import { Suspense } from "react";
import ActivityCardList from "@app/components/MainPage/ActivityCardList";
import PopularActivityList from "@app/components/MainPage/PopularActivityList";

export default function Home() {
  const monthNum = new Date().getMonth() + 1;

  return (
    <>
      <section>
        <div className="relative flex h-[240px] w-full justify-center bg-[url('../../public/images/img_main_banner.png')] bg-cover bg-center md:h-[550px]">
          <div className="relative -left-1/4 mt-[74px] flex flex-col gap-5 md:mt-[144px] xl:mt-[159px]">
            <h1 className="text-[24px] font-bold leading-tight text-white md:text-[54px] xl:text-[68px]">
              함께 배우면 즐거운
              <br /> 스트릿 댄스
            </h1>
            <p className="text-[14px] font-bold leading-tight text-white md:text-[20px] xl:text-[24px]">{`${monthNum}월의 인기 체험 BEST 🔥`}</p>
          </div>
        </div>
      </section>
      <div className="container">
        {/* 체험 검색 기능 필요 */}
        <section>Search section</section>
        <section>
          {/* 인기 체험 구현 필요 */}
          <PopularActivityList />
        </section>
        <section>
          <div>
            <Suspense>
              <ActivityCardList />
            </Suspense>
          </div>
        </section>
      </div>
    </>
  );
}
