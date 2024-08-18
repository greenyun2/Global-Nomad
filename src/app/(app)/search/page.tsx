"use client";

import { Suspense, useState, FormEvent } from "react";
import SearchActivityResult from "@app/components/MainPage/SearchActivityResult";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BedIcon from "@icons/icon_search.svg";

export default function Search() {
  const monthNum = new Date().getMonth() + 1;
  const [keyword, setKeyword] = useState<string>("");
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?keyword=${keyword}`);
  };
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
      <div>
        <section className="container relative flex justify-center bg-none">
          <div className="absolute -top-14 w-full rounded-2xl bg-white px-6 py-9 shadow-custom-shadow-01">
            <h2 className="mb-5 text-lg font-bold md:text-xl">
              무엇을 체험하고 싶으신가요?
            </h2>
            <form className="flex gap-3" onSubmit={handleSearch}>
              <div className="flex h-[56px] w-full gap-2 rounded-[4px] border border-gray-700 px-3 py-4">
                <Image
                  src={BedIcon}
                  alt="search icon"
                  width={22}
                  height={22}
                  style={{ width: 22, height: 22 }}
                />
                {keyword.length > 0 && (
                  <p className="absolute left-16 top-[70px] w-[144px] bg-white text-center text-[18px] text-gray-700 md:top-[76px]">
                    내가 원하는 체험은
                  </p>
                )}
                <input
                  className="w-full bg-white text-[18px] placeholder:text-[18px] placeholder:text-gray-600 active:bg-white"
                  name="keyword"
                  placeholder="내가 원하는 체험은"
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <button
                className="h-[56px] w-[96px] rounded-[4px] bg-primary text-lg font-bold text-white md:w-[136px]"
                type="submit"
                name="name"
              >
                검색하기
              </button>
            </form>
          </div>
        </section>
        <Suspense>
          <SearchActivityResult />
        </Suspense>
      </div>
    </>
  );
}
