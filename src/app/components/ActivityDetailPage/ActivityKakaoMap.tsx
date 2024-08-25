"use client";

import { useState, useEffect } from "react";
import { Map, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";

/**
 * 카카오맵의 초기 렌더링시, 주소에 맞게 화면을 보여줌
 * 주소에 맞는 위치에 마크업 표시
 *
 */

interface MapProps {
  address: string;
}

export default function KakaoMap({ address }: MapProps) {
  useKakaoLoader();

  return (
    <Map
      // 지도를 표시할 Container
      id="map"
      center={{
        // 지도의 중심좌표
        lat: 33.450701,
        lng: 126.570667,
      }}
      style={{
        // 지도의 크기
        width: "100%",
        height: "100%",
        borderRadius: "1rem",
      }}
      level={3} // 지도의 확대 레벨
    >
      <MapTypeControl position={"TOPRIGHT"} />
      <ZoomControl position={"RIGHT"} />
    </Map>
  );
}
