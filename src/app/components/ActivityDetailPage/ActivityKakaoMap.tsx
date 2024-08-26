"use client";

import { useState, useEffect } from "react";
import {
  Map,
  MapTypeControl,
  ZoomControl,
  MapMarker,
} from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";

interface MapProps {
  address: string;
}

const LoadingMessage = ({ message }: { message: string }) => (
  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-center text-gray-700">
    {message}
  </div>
);

export default function KakaoMap({ address }: MapProps) {
  const isKakaoLoaded = useKakaoLoader(); // SDK 로드 상태 확인
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isKakaoLoaded) {
      setError("Kakao Maps SDK 로드 중..."); // SDK 로드 중
      return; // SDK가 로드되지 않았을 경우 로딩 상태를 유지합니다.
    }

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.log("Kakao Maps services 라이브러리가 로드되지 않았습니다.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y, x } = result[0];
        setMapCenter({ lat: parseFloat(y), lng: parseFloat(x) });
        setError(null); // 오류 초기화
      } else {
        setError("주소를 찾을 수 없습니다."); // 오류 설정
      }
    });
  }, [isKakaoLoaded, address]);

  return (
    <div className="h-[30.125rem] overflow-hidden rounded-2xl md:h-[29.75rem] md:w-full">
      {error || !isKakaoLoaded || !mapCenter ? (
        <LoadingMessage message={error || "로딩 중..."} />
      ) : (
        <Map
          id="map"
          center={mapCenter}
          style={{
            width: "100%",
            height: "100%",
          }}
          level={3}
        >
          <MapTypeControl position={"TOPRIGHT"} />
          <ZoomControl position={"RIGHT"} />
          <MapMarker position={mapCenter} />
        </Map>
      )}
    </div>
  );
}
