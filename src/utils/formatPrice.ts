/**
 * 숫자를 한국 원화(₩)로 포맷하는 함수
 * Intl.NumberFormat은 숫자를 특정 로케일에 맞게 포맷팅하는 기능을 제공합니다.
 * 특히 통화, 소수점 자리수, 그룹화 구분자(콤마 등)를 포함한 다양한 포맷팅 옵션을 지원합니다.
 *
 * Intl.NumberFormat 생성자는 로케일 인자와 옵션 객체, 두 개의 인자를 받습니다.
 * 로케일 인자는 숫자를 포맷팅할 때 사용할 로케일을 지정합니다. ko-KR, en-US 등
 * 옵션 객체는 Object 형태로, 숫자 포맷팅의 세부 사항을 지정하는 여러 속성을 지원합니다.
 *
 * @param {number} price - 포맷할 숫자
 * @returns {string} - 포맷된 문자열 (예: ₩1,000,000)
 */
export function formatPriceKorean(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency", // 통화 형식으로 포맷팅
    currency: "KRW", // KRW으로 설정하여 앞에 '₩' 사인이 붙음
    minimumFractionDigits: 0, // 표시할 최소 소수점 자릿수를 지정
  }).format(price); // 이 함수가 호출되면 숫자 price가 포맷된 문자열로 변환됩니다.
}
