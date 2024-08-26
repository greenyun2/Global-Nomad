"use client";

import { useState, useEffect } from "react";
import { Map, MapTypeControl, ZoomControl, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";

interface MapProps {
  address: string;
}

export default function KakaoMap({ address }: MapProps) {
  const isKakaoLoaded = useKakaoLoader(); // SDK 로드 상태 확인
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (isKakaoLoaded) {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        console.log("Kakao Maps services 라이브러리가 로드되었습니다.");

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const { y, x } = result[0];
            setMapCenter({ lat: parseFloat(y), lng: parseFloat(x) });
          } else {
            alert("주소를 찾을 수 없습니다.");
          }
        });
      } else {
        console.error("Kakao Maps services 라이브러리가 로드되지 않았습니다.");
      }
    }
  }, [isKakaoLoaded, address]);

  if (!isKakaoLoaded) {
    return <div>카카오맵 로딩 중...</div>;
  }

  if (!mapCenter) {
    return <div>지도 로딩 중...</div>;
  }

  return (
    <Map
      id="map"
      center={mapCenter}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "1rem",
      }}
      level={3}
    >
      <MapTypeControl position={"TOPRIGHT"} />
      <ZoomControl position={"RIGHT"} />
      <MapMarker position={mapCenter} />
    </Map>
  );
}