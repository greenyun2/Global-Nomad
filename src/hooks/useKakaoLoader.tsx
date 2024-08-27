import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

const API_KEY = process.env.NEXT_PUBLIC_MAP_KEY;

export default function useKakaoLoader() {
  const isKakaoLoaded = useKakaoLoaderOrigin({
    appkey: `${API_KEY}`,
    libraries: ["services", "clusterer", "drawing"],
  });

  return isKakaoLoaded;
}
