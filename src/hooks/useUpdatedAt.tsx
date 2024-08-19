export default function useUpdatedAt(updatedAt: string) {
  const start = new Date(updatedAt);
  const end = new Date();

  const second = Math.floor((end.getTime() - start.getTime()) / 1000);
  if (second < 60) return "방금 전";

  const minute = second / 60;
  if (minute < 60) return `${Math.floor(minute)}분 전`;

  const hour = minute / 60;
  if (hour < 24) return `${Math.floor(hour)}시간 전`;

  const day = hour / 24;
  if (day < 7) return `${Math.floor(day)}일 전`;

  return `${start.toLocaleDateString()}`;
}
