/**
 * 별점의 평균에 따른 평가를 반환하는 함수
 * @param averageRating - 별점 평균
 * @returns 별점 평균에 따른 평가 (매우 만족, 만족, 보통, 불만족, 매우 불만족)
 */
export function getRatingEvaluation(averageRating: number): string {
  if (averageRating >= 4.5) {
    return "매우 만족";
  } else if (averageRating >= 3.5) {
    return "만족";
  } else if (averageRating >= 2.5) {
    return "보통";
  } else if (averageRating >= 1.5) {
    return "불만족";
  } else {
    return "매우 불만족";
  }
}
