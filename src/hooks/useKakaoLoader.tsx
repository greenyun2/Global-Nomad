import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

const API_KEY = process.env.NEXT_PUBLIC_MAP_KEY;

export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    /**
     * ※주의※ appkey의 경우 본인의 appkey를 사용하셔야 합니다.
     * 해당 키는 docs를 위해 발급된 키 이므로, 임의로 사용하셔서는 안됩니다.
     *
     * @참고 https://apis.map.kakao.com/web/guide/
     */
    appkey: `${API_KEY}`,
    libraries: ["clusterer", "drawing", "services"],
  });
}
